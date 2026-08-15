from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.telemetry import TelemetryRecord
from app.services.anomaly_detector import detect_telemetry_anomalies


router = APIRouter(
    prefix="/telemetry",
    tags=["Telemetry"]
)


class TelemetryCreate(BaseModel):
    mission_id: int
    battery_level: float
    fuel_level: float
    temperature: float
    signal_strength: float
    thruster_vibration: float


@router.get("/")
def get_telemetry(db: Session = Depends(get_db)):
    telemetry = (
        db.query(TelemetryRecord)
        .order_by(TelemetryRecord.recorded_at.desc())
        .all()
    )
    return telemetry


@router.post("/")
def create_telemetry(
    telemetry: TelemetryCreate,
    db: Session = Depends(get_db)
):
    new_telemetry = TelemetryRecord(
        mission_id=telemetry.mission_id,
        battery_level=telemetry.battery_level,
        fuel_level=telemetry.fuel_level,
        temperature=telemetry.temperature,
        signal_strength=telemetry.signal_strength,
        thruster_vibration=telemetry.thruster_vibration
    )

    db.add(new_telemetry)
    db.commit()
    db.refresh(new_telemetry)

    detect_telemetry_anomalies(
    	db=db,
    	mission_id=telemetry.mission_id
    )
    return new_telemetry