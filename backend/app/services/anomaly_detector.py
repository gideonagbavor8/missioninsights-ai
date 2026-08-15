from sqlalchemy.orm import Session

from app.models.telemetry import TelemetryRecord
from app.models.anomaly import Anomaly


def detect_telemetry_anomalies(
    db: Session,
    mission_id: int,
):
    telemetry = (
        db.query(TelemetryRecord)
        .filter(TelemetryRecord.mission_id == mission_id)
        .order_by(TelemetryRecord.recorded_at.asc())
        .all()
    )

    if len(telemetry) < 2:
        return []

    anomalies = []

    latest = telemetry[-1]
    previous = telemetry[-2]

    # Detect increasing thruster vibration
    if latest.thruster_vibration > previous.thruster_vibration:
        increase = latest.thruster_vibration - previous.thruster_vibration

        if increase >= 0.15:
            severity = "High"
            confidence = 92.0
            action = "Inspect propulsion system and monitor vibration levels."
        elif increase >= 0.08:
            severity = "Medium"
            confidence = 82.0
            action = "Monitor thruster vibration closely."
        else:
            severity = "Low"
            confidence = 70.0
            action = "Continue monitoring thruster vibration."

        anomaly = Anomaly(
            mission_id=mission_id,
            issue="Thruster vibration increasing",
            severity=severity,
            confidence=confidence,
            recommended_action=action,
        )

        db.add(anomaly)
        anomalies.append(anomaly)

    # Detect declining battery
    if latest.battery_level < previous.battery_level:
        decrease = previous.battery_level - latest.battery_level

        if decrease >= 5:
            severity = "High"
            confidence = 90.0
            action = "Investigate abnormal battery consumption."
        elif decrease >= 2:
            severity = "Medium"
            confidence = 80.0
            action = "Monitor battery consumption closely."
        else:
            severity = "Low"
            confidence = 65.0
            action = "Continue monitoring battery levels."

        anomaly = Anomaly(
            mission_id=mission_id,
            issue="Battery level decreasing",
            severity=severity,
            confidence=confidence,
            recommended_action=action,
        )

        db.add(anomaly)
        anomalies.append(anomaly)

    # Detect increasing temperature
    if latest.temperature > previous.temperature:
        increase = latest.temperature - previous.temperature

        if increase >= 5:
            severity = "High"
            confidence = 90.0
            action = "Investigate thermal conditions immediately."
        elif increase >= 2:
            severity = "Medium"
            confidence = 80.0
            action = "Monitor spacecraft temperature closely."
        else:
            severity = "Low"
            confidence = 65.0
            action = "Continue monitoring temperature."

        anomaly = Anomaly(
            mission_id=mission_id,
            issue="Spacecraft temperature increasing",
            severity=severity,
            confidence=confidence,
            recommended_action=action,
        )

        db.add(anomaly)
        anomalies.append(anomaly)

    db.commit()

    for anomaly in anomalies:
        db.refresh(anomaly)

    return anomalies