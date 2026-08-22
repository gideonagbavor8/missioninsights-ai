from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os

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


@router.delete("/cleanup-duplicates")
def cleanup_duplicate_reports(
    x_cleanup_token: str | None = Header(default=None),
    db: Session = Depends(get_db)
):
    expected_token = os.getenv("ADMIN_CLEANUP_TOKEN")

    if not expected_token or x_cleanup_token != expected_token:
        raise HTTPException(status_code=403, detail="Forbidden")

    report_ids = [1, 2, 3]

    reports = (
        db.query(AIReport)
        .filter(
            AIReport.id.in_(report_ids),
            AIReport.mission_id == 1
        )
        .all()
    )

    deleted_ids = [report.id for report in reports]

    for report in reports:
        db.delete(report)

    db.commit()

    remaining = (
        db.query(AIReport)
        .filter(AIReport.mission_id == 1)
        .order_by(AIReport.id)
        .all()
    )

    return {
        "deleted_ids": deleted_ids,
        "remaining_reports": [
            {
                "id": report.id,
                "mission_id": report.mission_id,
                "created_at": report.created_at
            }
            for report in remaining
        ]
    }


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