from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from datetime import datetime, timezone

from app.database import Base


class Anomaly(Base):
    __tablename__ = "anomalies"

    id = Column(Integer, primary_key=True, index=True)

    mission_id = Column(
        Integer,
        ForeignKey("missions.id"),
        nullable=False
    )

    issue = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    recommended_action = Column(String, nullable=False)

    detected_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )