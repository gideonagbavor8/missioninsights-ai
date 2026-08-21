import re

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.mission import Mission
from app.models.telemetry import TelemetryRecord
from app.models.anomaly import Anomaly
from app.models.report import AIReport
from app.services.watsonx_service import generate_mission_report, answer_mission_question


router = APIRouter(
    prefix="/ai",
    tags=["AI Analysis"]
)


class AnalyzeRequest(BaseModel):
    mission_id: int


# Namespace for the per-mission advisory lock taken around analyze requests.
# Arbitrary constant; only needs to be stable and not collide with other locks.
_ANALYZE_LOCK_NAMESPACE = 4242

_NUMBERED_ITEM = re.compile(r"\s*\d+\.\s+")


def _split_recommendations(recommendation: str) -> list[str]:
    """Invert the ``"1. a 2. b"`` join used when a report is persisted."""
    if not recommendation or recommendation.strip() == "No recommendations.":
        return []
    parts = [p.strip() for p in _NUMBERED_ITEM.split(recommendation) if p.strip()]
    return parts or [recommendation.strip()]


@router.post("/analyze")
def analyze_mission(
    data: AnalyzeRequest,
    db: Session = Depends(get_db)
):
    mission = db.query(Mission).filter(Mission.id == data.mission_id).first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    telemetry = (
        db.query(TelemetryRecord)
        .filter(TelemetryRecord.mission_id == data.mission_id)
        .order_by(TelemetryRecord.recorded_at.desc())
        .first()
    )
    if not telemetry:
        raise HTTPException(
            status_code=404,
            detail="No telemetry found for this mission",
        )

    anomalies = (
        db.query(Anomaly)
        .filter(Anomaly.mission_id == data.mission_id)
        .order_by(Anomaly.detected_at.desc())
        .all()
    )

    telemetry_text = f"""
Mission: {mission.mission_name}
Spacecraft ID: {mission.spacecraft_name}

Battery: {telemetry.battery_level}%
Fuel: {telemetry.fuel_level}%
Temperature: {telemetry.temperature}°C
Signal Strength: {telemetry.signal_strength}%
Thruster Vibration: {telemetry.thruster_vibration}g
"""

    anomaly_text = "\n".join(
        f"- {a.issue} | Severity: {a.severity} | "
        f"Confidence: {a.confidence:.0f}% | "
        f"Action: {a.recommended_action}"
        for a in anomalies
    )

    if not anomaly_text:
        anomaly_text = "No detected anomalies."

    # ── Deduplication ────────────────────────────────────────────────────────
    # A report is a function of (mission, latest telemetry, anomaly state).
    # All three tables stamp their timestamps with datetime.now(timezone.utc),
    # so a report created at or after the newest input timestamp necessarily
    # describes the current state. That gives a deterministic identity without
    # adding a column or a migration.
    state_at = telemetry.recorded_at
    if anomalies:
        # `anomalies` is ordered by detected_at desc, and the detector refreshes
        # detected_at when it updates an existing row, so [0] is the newest edit.
        state_at = max(state_at, anomalies[0].detected_at)

    # Serialise concurrent analyses of the same mission so the check-then-insert
    # below is atomic. Released automatically when this transaction ends.
    db.execute(
        text("SELECT pg_advisory_xact_lock(:ns, :mission_id)"),
        {"ns": _ANALYZE_LOCK_NAMESPACE, "mission_id": data.mission_id},
    )

    existing_report = (
        db.query(AIReport)
        .filter(
            AIReport.mission_id == data.mission_id,
            AIReport.created_at >= state_at,
        )
        .order_by(AIReport.created_at.desc())
        .first()
    )

    if existing_report is not None:
        # Nothing has changed since this report was written — reuse it rather
        # than paying for another Granite call and storing a near-identical row.
        db.commit()  # ends the transaction, releasing the advisory lock
        return {
            "mission": mission.mission_name,
            "spacecraft_id": mission.spacecraft_name,
            "reused": True,
            "ai_report": {
                "health_summary": existing_report.summary,
                "anomalies": [a.issue for a in anomalies],
                "risk_level": existing_report.risk_level,
                "recommendations": _split_recommendations(existing_report.recommendation),
            },
        }

    report = generate_mission_report(
        telemetry_data=telemetry_text,
        anomaly_data=anomaly_text,
    )

    # Persist the AI analysis so the dashboard reports section is populated.
    # recommendations is a list — join to a single readable string.
    recommendations = report.get("recommendations", [])
    recommendation_text = (
        " ".join(f"{i + 1}. {r}" for i, r in enumerate(recommendations))
        if recommendations
        else "No recommendations."
    )

    saved_report = AIReport(
        mission_id=data.mission_id,
        summary=report.get("health_summary", ""),
        risk_level=report.get("risk_level", "Unknown"),
        recommendation=recommendation_text,
    )
    db.add(saved_report)
    db.commit()
    db.refresh(saved_report)

    return {
        "mission": mission.mission_name,
        "spacecraft_id": mission.spacecraft_name,
        "reused": False,
        "ai_report": report,
    }


class AskRequest(BaseModel):
    mission_id: int
    question: str


@router.post("/ask")
def ask_mission(
    data: AskRequest,
    db: Session = Depends(get_db),
):
    if not data.question.strip():
        raise HTTPException(status_code=422, detail="Question must not be empty")

    mission = db.query(Mission).filter(Mission.id == data.mission_id).first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    telemetry = (
        db.query(TelemetryRecord)
        .filter(TelemetryRecord.mission_id == data.mission_id)
        .order_by(TelemetryRecord.recorded_at.desc())
        .first()
    )
    if not telemetry:
        raise HTTPException(
            status_code=404,
            detail="No telemetry found for this mission",
        )

    anomalies = (
        db.query(Anomaly)
        .filter(Anomaly.mission_id == data.mission_id)
        .order_by(Anomaly.detected_at.desc())
        .all()
    )

    telemetry_text = (
        f"Mission: {mission.mission_name}\n"
        f"Spacecraft: {mission.spacecraft_name}\n"
        f"Battery: {telemetry.battery_level}%\n"
        f"Fuel: {telemetry.fuel_level}%\n"
        f"Temperature: {telemetry.temperature}°C\n"
        f"Signal Strength: {telemetry.signal_strength}%\n"
        f"Thruster Vibration: {telemetry.thruster_vibration}g"
    )

    anomaly_text = "\n".join(
        f"- {a.issue} | Severity: {a.severity} | "
        f"Confidence: {a.confidence * 100:.0f}% "
        f"(stored value: {a.confidence}) | "
        f"Action: {a.recommended_action}"
        for a in anomalies
    ) or "No detected anomalies."

    answer = answer_mission_question(
        telemetry_data=telemetry_text,
        anomaly_data=anomaly_text,
        question=data.question.strip(),
    )

    return {"answer": answer}
