from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.telemetry import TelemetryRecord
from app.models.anomaly import Anomaly
from app.services.health_score import calculate_health_score

router = APIRouter(
    prefix="/health",
    tags=["Mission Health"],
)


@router.get("/{mission_id}")
def get_mission_health(
    mission_id: int,
    db: Session = Depends(get_db),
):
    telemetry = (
        db.query(TelemetryRecord)
        .filter(TelemetryRecord.mission_id == mission_id)
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
        .filter(Anomaly.mission_id == mission_id)
        .all()
    )

    return calculate_health_score(
        telemetry=telemetry,
        anomalies=anomalies,
    )