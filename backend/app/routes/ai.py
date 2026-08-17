from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.anomaly import Anomaly
from app.services.watsonx_service import generate_mission_report


router = APIRouter(
    prefix="/ai",
    tags=["AI Analysis"]
)


class TelemetryRequest(BaseModel):
    mission: str
    spacecraft_id: str
    battery: int
    fuel: int
    temperature: float
    signal_strength: int
    vibration: float


@router.post("/analyze")
def analyze_telemetry(
    data: TelemetryRequest,
    db: Session = Depends(get_db)
):
    telemetry_text = f"""
Mission: {data.mission}
Spacecraft ID: {data.spacecraft_id}

Battery: {data.battery}%
Fuel: {data.fuel}%
Temperature: {data.temperature}°C
Signal Strength: {data.signal_strength}%
Thruster Vibration: {data.vibration}g
"""

    anomalies = (
        db.query(Anomaly)
        .filter(Anomaly.mission_id == 1)
        .order_by(Anomaly.detected_at.desc())
        .all()
    )

    anomaly_text = "\n".join(
        [
            f"- {anomaly.issue} | Severity: {anomaly.severity} | "
            f"Confidence: {anomaly.confidence}% | "
            f"Action: {anomaly.recommended_action}"
            for anomaly in anomalies
        ]
    )

    if not anomaly_text:
        anomaly_text = "No detected anomalies."

    report = generate_mission_report(
        telemetry_data=telemetry_text,
        anomaly_data=anomaly_text,
    )

    return {
        "mission": data.mission,
        "spacecraft_id": data.spacecraft_id,
        "ai_report": report
    }