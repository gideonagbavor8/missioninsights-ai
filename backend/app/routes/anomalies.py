from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.anomaly import Anomaly


router = APIRouter(
    prefix="/anomalies",
    tags=["Anomalies"]
)


class AnomalyCreate(BaseModel):
    mission_id: int
    issue: str
    severity: str
    confidence: float
    recommended_action: str


@router.get("/")
def get_anomalies(db: Session = Depends(get_db)):
    anomalies = db.query(Anomaly).all()
    return anomalies


@router.post("/")
def create_anomaly(
    anomaly: AnomalyCreate,
    db: Session = Depends(get_db)
):
    new_anomaly = Anomaly(
        mission_id=anomaly.mission_id,
        issue=anomaly.issue,
        severity=anomaly.severity,
        confidence=anomaly.confidence,
        recommended_action=anomaly.recommended_action
    )

    db.add(new_anomaly)
    db.commit()
    db.refresh(new_anomaly)

    return new_anomaly