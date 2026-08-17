from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.mission import Mission
from app.models.telemetry import TelemetryRecord
from app.models.anomaly import Anomaly
from app.models.report import AIReport
from app.services.watsonx_service import generate_mission_report


router = APIRouter(
    prefix="/ai",
    tags=["AI Analysis"]
)


class AnalyzeRequest(BaseModel):
    mission_id: int


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
        f"Confidence: {a.confidence}% | "
        f"Action: {a.recommended_action}"
        for a in anomalies
    )

    if not anomaly_text:
        anomaly_text = "No detected anomalies."

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
        "ai_report": report,
    }