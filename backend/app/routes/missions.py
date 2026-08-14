from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.mission import Mission

class MissionCreate(BaseModel):
    mission_name: str
    spacecraft_name: str
    status: str

router = APIRouter(
    prefix="/missions",
    tags=["Missions"]
)


@router.get("/")
def get_missions(db: Session = Depends(get_db)):
    missions = db.query(Mission).all()
    return missions


@router.post("/")
def create_mission(
    mission: MissionCreate,
    db: Session = Depends(get_db)
):
    new_mission = Mission(
        mission_name=mission.mission_name,
        spacecraft_name=mission.spacecraft_name,
        status=mission.status
    )

    db.add(new_mission)
    db.commit()
    db.refresh(new_mission)

    return new_mission