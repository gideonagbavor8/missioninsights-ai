from app.models.telemetry import TelemetryRecord


def calculate_health_score(
    telemetry: TelemetryRecord,
    anomalies: list | None = None,
):
    anomalies = anomalies or []

    # Battery: 25%
    battery_score = max(0, min(100, telemetry.battery_level))

    # Fuel: 25%
    fuel_score = max(0, min(100, telemetry.fuel_level))

    # Signal: 20%
    signal_score = max(0, min(100, telemetry.signal_strength))

    # Temperature: 15%
    if 0 <= telemetry.temperature <= 50:
        temperature_score = 100
    elif telemetry.temperature < 0:
        temperature_score = max(0, 100 + telemetry.temperature)
    else:
        temperature_score = max(0, 100 - (telemetry.temperature - 50) * 2)

    # Vibration: 15%
    vibration_score = max(
    0,
    min(100, 100 - (telemetry.thruster_vibration * 50)),
)

    base_score = (
        battery_score * 0.25
        + fuel_score * 0.25
        + signal_score * 0.20
        + temperature_score * 0.15
        + vibration_score * 0.15
    )

    anomaly_penalty = 0

    for anomaly in anomalies:
        severity = anomaly.severity.lower()

        if severity == "low":
            anomaly_penalty += 5
        elif severity == "medium":
            anomaly_penalty += 10
        elif severity in ("high", "critical"):
            anomaly_penalty += 20

    score = max(0, min(100, round(base_score - anomaly_penalty)))

    if score >= 80:
        status = "Healthy"
    elif score >= 60:
        status = "Warning"
    else:
        status = "Critical"

    return {
        "score": score,
        "status": status,
        "factors": {
            "battery": round(battery_score),
            "fuel": round(fuel_score),
            "signal": round(signal_score),
            "temperature": round(temperature_score),
            "vibration": round(vibration_score),
        },
        "anomaly_penalty": anomaly_penalty,
    }