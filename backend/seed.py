from app.database import SessionLocal
from app.models.mission import Mission
from app.models.telemetry import TelemetryRecord
from app.models.anomaly import Anomaly

db = SessionLocal()

try:
    # ── Mission: reuse if already exists ────────────────────────────────────
    mission = (
        db.query(Mission)
        .filter_by(mission_name="Artemis Explorer", spacecraft_name="AE-01")
        .first()
    )

    if mission is None:
        mission = Mission(
            mission_name="Artemis Explorer",
            spacecraft_name="AE-01",
            status="Active",
        )
        db.add(mission)
        db.commit()
        db.refresh(mission)
        print(f"Created mission (id={mission.id}).")
    else:
        print(f"Mission already exists (id={mission.id}), reusing.")

    # ── Telemetry: insert only if this mission has no records yet ────────────
    existing_telemetry = (
        db.query(TelemetryRecord).filter_by(mission_id=mission.id).first()
    )

    if existing_telemetry is None:
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
        print("Inserted telemetry records.")
    else:
        print("Telemetry already seeded, skipping.")

    # ── Anomalies: insert only if this mission has no anomalies yet ──────────
    existing_anomaly = (
        db.query(Anomaly).filter_by(mission_id=mission.id).first()
    )

    if existing_anomaly is None:
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
        print("Inserted anomalies.")
    else:
        print("Anomalies already seeded, skipping.")

    db.commit()
    print("Seed complete.")

finally:
    db.close()