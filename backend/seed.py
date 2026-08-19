from app.database import SessionLocal
from app.models.mission import Mission
from app.models.telemetry import TelemetryRecord
from app.models.anomaly import Anomaly

db = SessionLocal()

try:
    mission = Mission(
        mission_name="Artemis Explorer",
        spacecraft_name="AE-01",
        status="Active",
    )
    db.add(mission)
    db.commit()
    db.refresh(mission)

    telemetry_records = [
        TelemetryRecord(
            mission_id=mission.id,
            battery_level=92,
            fuel_level=88,
            temperature=34,
            signal_strength=96,
            thruster_vibration=0.22,
        ),
        TelemetryRecord(
            mission_id=mission.id,
            battery_level=86,
            fuel_level=76,
            temperature=42,
            signal_strength=91,
            thruster_vibration=0.48,
        ),
        TelemetryRecord(
            mission_id=mission.id,
            battery_level=80,
            fuel_level=61,
            temperature=33,
            signal_strength=92,
            thruster_vibration=0.65,
        ),
    ]

    db.add_all(telemetry_records)

    anomalies = [
        Anomaly(
            mission_id=mission.id,
            issue="Thruster vibration trend increasing",
            severity="Medium",
            confidence=0.87,
            recommended_action="Inspect propulsion subsystem",
        ),
        Anomaly(
            mission_id=mission.id,
            issue="Fuel consumption above expected baseline",
            severity="Medium",
            confidence=0.82,
            recommended_action="Review burn efficiency",
        ),
    ]

    db.add_all(anomalies)
    db.commit()

    print("Seed data inserted successfully.")

finally:
    db.close()