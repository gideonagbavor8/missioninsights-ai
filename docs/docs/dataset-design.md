# MissionInsights AI Dataset Design

## Overview

MissionInsights AI uses spacecraft telemetry data to monitor mission health, detect abnormal conditions, and generate AI-powered insights.

The initial version of the project will use a simulated spacecraft telemetry dataset that represents realistic spacecraft system readings.

The dataset will contain normal operating conditions and intentionally created anomalies to test AI detection capabilities.

---

# Dataset Purpose

The telemetry dataset will support:

- Spacecraft health monitoring
- AI anomaly detection
- Risk assessment
- Mission summaries
- AI-generated recommendations

---

# Telemetry Data Fields

| Field | Type | Description |
|---|---|---|
| timestamp | datetime | Time the telemetry reading was recorded |
| mission_id | UUID | Associated mission identifier |
| battery_level | float | Current battery percentage |
| fuel_level | float | Remaining fuel percentage |
| temperature | float | Spacecraft system temperature |
| signal_strength | float | Communication signal quality percentage |
| thruster_vibration | float | Thruster vibration measurement |
| power_consumption | float | Current energy usage |
| system_status | string | Current spacecraft status |

---

# Normal Operating Range

The AI system will learn normal spacecraft behavior from historical telemetry.

| Metric | Normal Range |
|---|---|
| Battery Level | 70% - 100% |
| Fuel Level | 30% - 100% |
| Temperature | 15°C - 45°C |
| Signal Strength | 80% - 100% |
| Thruster Vibration | 0.05 - 0.20 |
| Power Consumption | Normal mission usage range |

---

# Anomaly Scenarios

The dataset will include simulated spacecraft problems.

## 1. Thruster System Issue

Example:

```
Thruster vibration increases from 0.15 to 0.65
```

AI Detection:

```
Possible propulsion system degradation detected.
Confidence: 92%
```

---

## 2. Battery Degradation

Example:

```
Battery drops from 85% to 45% within a short period.
```

AI Detection:

```
Abnormal battery discharge detected.
Recommended action: Reduce non-essential power usage.
```

---

## 3. Temperature Spike

Example:

```
Temperature increases from 30°C to 85°C.
```

AI Detection:

```
Thermal system warning detected.
Immediate monitoring recommended.
```

---

## 4. Communication Failure

Example:

```
Signal strength decreases from 95% to 40%.
```

AI Detection:

```
Communication instability detected.
Check antenna and transmission systems.
```

---

# Sample Telemetry Records

## Normal Condition

```json
{
  "timestamp": "2026-08-01T10:00:00Z",
  "mission_id": "AE-01",
  "battery_level": 87,
  "fuel_level": 65,
  "temperature": 29,
  "signal_strength": 96,
  "thruster_vibration": 0.15,
  "power_consumption": 62,
  "system_status": "Normal"
}
```

---

## Anomalous Condition

```json
{
  "timestamp": "2026-08-01T14:00:00Z",
  "mission_id": "AE-01",
  "battery_level": 72,
  "fuel_level": 64,
  "temperature": 88,
  "signal_strength": 94,
  "thruster_vibration": 0.68,
  "power_consumption": 85,
  "system_status": "Warning"
}
```

---

# Dataset Generation Strategy

Initial dataset:

- 5,000 telemetry records
- Multiple spacecraft states
- Normal and abnormal conditions
- Time-series data format

Generation approach:

1. Create realistic baseline spacecraft telemetry.
2. Introduce controlled anomalies.
3. Train and test anomaly detection logic.
4. Generate AI explanations based on detected patterns.

---

# Future Dataset Improvements

Possible future integrations:

- NASA open datasets
- Satellite telemetry APIs
- Space weather datasets
- Real spacecraft mission data
