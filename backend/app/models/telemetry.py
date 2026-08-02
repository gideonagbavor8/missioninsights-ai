from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.database import Base


class TelemetryRecord(Base):
    __tablename__ = "telemetry_records"

    id = Column(Integer, primary_key=True, index=True)

    mission_id = Column(
        Integer,
        ForeignKey("missions.id"),
        nullable=False
    )

    battery_level = Column(Float, nullable=False)
    fuel_level = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    signal_strength = Column(Float, nullable=False)
    thruster_vibration = Column(Float, nullable=False)

    recorded_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )