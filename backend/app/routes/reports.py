from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.report import AIReport


router = APIRouter(
    prefix="/reports",
    tags=["AI Reports"]
)


class ReportCreate(BaseModel):
    mission_id: int
    summary: str
    risk_level: str
    recommendation: str


@router.get("/")
def get_reports(db: Session = Depends(get_db)):
    reports = db.query(AIReport).all()
    return reports


@router.post("/")
def create_report(
    report: ReportCreate,
    db: Session = Depends(get_db)
):
    new_report = AIReport(
        mission_id=report.mission_id,
        summary=report.summary,
        risk_level=report.risk_level,
        recommendation=report.recommendation
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return new_report