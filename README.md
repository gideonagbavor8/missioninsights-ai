# MissionInsights AI: Mission Control Copilot

MissionInsights AI is an AI-powered space operations intelligence platform that transforms spacecraft telemetry data into actionable mission insights.

Built for the IBM AI Builders Challenge 2026, the platform combines telemetry monitoring, anomaly detection, mission health assessment, and IBM Granite-powered decision support to help mission operators understand spacecraft status and respond to potential risks.

## Challenge Theme

**IBM AI Builders Challenge 2026**

**August Challenge:** Advance Space Exploration with AI

---

## Problem

Space missions generate large volumes of telemetry data that operators must continuously monitor.

Traditional dashboards display raw metrics but often require significant manual interpretation before teams can understand mission risks and decide on corrective actions.

---

## Solution

MissionInsights AI acts as a Mission Control Copilot by:

- Monitoring spacecraft telemetry
- Detecting mission anomalies
- Calculating mission health status
- Generating AI-powered mission reports
- Answering operator questions using IBM Granite

---

## Core Features

### Telemetry Dashboard

Monitor:

- Battery Level
- Fuel Level
- Temperature
- Signal Strength
- Thruster Vibration

### AI Anomaly Detection

Automatically identifies:

- Battery degradation
- Temperature increases
- Thruster vibration increases

Each anomaly includes:

- Severity level
- Confidence score
- Recommended action

### Mission Health Score

Provides an overall assessment of spacecraft health using telemetry and anomaly data.

### Mission Commander

An IBM Granite-powered AI assistant that allows operators to ask questions such as:

- Which system is most at risk?
- What action should I take first?
- Are current readings safe?
- Why was this anomaly detected?

Responses are grounded in current mission telemetry and detected anomalies.

### AI Mission Reports

Generate mission summaries that include:

- Health assessment
- Risk evaluation
- Detected issues
- Recommended actions

Reports are stored and available for review.

---

## Architecture

```text
Next.js Frontend
        │
        ▼
FastAPI Backend
        │
        ├── PostgreSQL Database
        │
        └── IBM Granite AI
                │
                ▼
Mission Insights & Recommendations
```

---

## Technology Stack

### Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- Recharts

### Backend

- Python
- FastAPI
- SQLAlchemy

### Database

- PostgreSQL

### Artificial Intelligence

- IBM Granite
- IBM watsonx.ai
- IBM Bob

---

## AI Workflow

Telemetry Data
→ Anomaly Detection
→ Mission Health Assessment
→ IBM Granite Analysis
→ Mission Reports & Mission Commander Responses

---

## Project Status

Current MVP Features Completed:

- Telemetry Dashboard
- AI Anomaly Detection
- Mission Health Score
- Mission Commander
- AI Mission Reports

---

## Repository

MissionInsights AI was developed for the IBM AI Builders Challenge 2026 to demonstrate how AI can improve space mission monitoring and operational decision support.