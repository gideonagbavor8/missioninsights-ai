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
    # Scored against the same 0-10 g full scale the telemetry gauge uses
    # (percent = g / 10 * 100). The previous divisor reached 0 at 2 g, which
    # scored a nominal reading as near-failure and disagreed with the rest
    # of the application.
    vibration_score = max(
        0,
        min(100, 100 - (telemetry.thruster_vibration * 10)),
    )

    base_score = (
        battery_score * 0.25
        + fuel_score * 0.25
        + signal_score * 0.20
        + temperature_score * 0.15
        + vibration_score * 0.15
    )

    # Anomalies are trend detections derived from this same telemetry, so their
    # penalty is weighted by the detector's own stored confidence rather than
    # applied flat. Without this, a 65%-confidence "level decreasing" costs the
    # same as a near-certain fault, and the reading is effectively charged twice.
    weighted_penalty = 0.0

    for anomaly in anomalies:
        severity = anomaly.severity.lower()

        if severity == "low":
            severity_weight = 5
        elif severity == "medium":
            severity_weight = 10
        elif severity in ("high", "critical"):
            severity_weight = 20
        else:
            severity_weight = 0

        # Confidence is stored on a 0-100 scale; clamp so a bad value cannot
        # amplify the penalty beyond its severity weight.
        confidence = min(100.0, max(0.0, float(anomaly.confidence or 0.0)))
        weighted_penalty += severity_weight * (confidence / 100.0)

    anomaly_penalty = round(weighted_penalty)

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