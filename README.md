<div align="center">

# MissionInsights AI

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="frontend/public/brand/logo-on-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="frontend/public/brand/logo-on-light.svg">
  <img alt="MissionInsights AI" src="frontend/public/brand/logo-on-light.svg" width="420">
</picture>

### AI-powered space mission intelligence

MissionInsights AI transforms spacecraft telemetry into actionable mission intelligence through
mission health scoring, anomaly detection, and IBM Granite-powered analysis.

🚀 **[Live Demo](https://missioninsights-ai.vercel.app/)** &nbsp;·&nbsp;
📦 **[GitHub](https://github.com/gideonagbavor8/missioninsights-ai)** &nbsp;·&nbsp;
🎥 **Demo Video:** _Add before submission_

</div>

---

## 🚀 IBM AI Builders Challenge

**IBM AI Builders Challenge 2026**
**August Theme — Advance Space Exploration with AI**

MissionInsights AI was built to demonstrate how AI can help mission operators interpret spacecraft
telemetry, identify anomalies, assess mission health, and make informed operational decisions.

---

## 🌌 The Problem

Space missions generate large volumes of telemetry across multiple spacecraft subsystems. Raw
telemetry can show *what* is happening, but operators still need to interpret trends, identify
abnormal behaviour, assess mission risk, and determine what action should be taken.

Traditional dashboards display metrics. They rarely explain them.

---

## 🛰️ The Solution

MissionInsights AI acts as a **Mission Control Copilot**. It:

- Monitors spacecraft telemetry across five subsystems
- Detects telemetry anomalies from trends in the data
- Calculates a mission health score
- Provides AI-powered mission analysis
- Generates mission reports with recommended actions
- Answers operator questions through **Mission Commander**

Every AI response is grounded in the **current** mission telemetry and detected anomalies — the
live mission state is passed into the model on each request, rather than relying on the model's
own assumptions.

---

## ✨ Core Capabilities

### Mission Health Score

A single **0–100** index summarising spacecraft condition, computed from weighted telemetry factors:

| Factor | Weight |
| :--- | ---: |
| Battery level | 25% |
| Fuel level | 25% |
| Signal strength | 20% |
| Temperature | 15% |
| Thruster vibration | 15% |

Active anomalies apply a further penalty, scaled by each anomaly's **severity** and the detector's
own **confidence** — so a low-confidence trend costs less than a near-certain fault. The result is
banded as **Healthy** (≥ 80), **Warning** (≥ 60) or **Critical**, and the dashboard shows the
per-factor breakdown behind the score.

### Telemetry Monitoring

Spacecraft telemetry surfaced as live gauges and time-series charts across battery, fuel,
temperature, signal strength and thruster vibration — so drift in any subsystem is visible at a
glance rather than buried in a table. Each dashboard region loads independently, so the page never
waits on the slowest system.

### AI Anomaly Detection

Trend analysis across consecutive telemetry records identifies developing problems:

- **Rising thruster vibration**
- **Declining battery level**
- **Increasing spacecraft temperature**

Each detection carries a **severity** (Low / Medium / High), a **confidence score**, and a
**recommended action**. Detections are graded by how sharply the trend is moving, so a small drift
and a sudden change are not treated alike.

### Mission Commander

Operators ask questions in natural language and receive answers grounded in the current mission
state — for example:

> *Which system is most at risk right now?*
> *Battery and vibration are both flagged — could they be related?*
> *What action should I take first based on the current anomalies?*

### AI Mission Reports

Generated mission analysis including a **health summary**, **risk level**, **detected issues** and
**ranked recommended actions**. Reports are persisted for review, and an existing report is reused
when the mission state has not changed — so repeated analysis of unchanged telemetry does not
produce redundant records.

---

## 🧠 Mission Intelligence Workflow

```text
        Spacecraft Telemetry
                 ↓
            AI Analysis
                 ↓
         Anomaly Detection
                 ↓
     Mission Health Assessment
                 ↓
   Actionable Mission Insights
```

---

## 🏗️ Architecture

```text
        Next.js Frontend
                │
                ▼
         FastAPI Backend
                │
        ┌───────┴───────┐
        ▼               ▼
  PostgreSQL      IBM watsonx.ai
   Database      (IBM Granite)
        └───────┬───────┘
                ▼
   Mission Insights & Recommendations
```

---

## 🧰 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Recharts |
| **Backend** | Python · FastAPI · SQLAlchemy 2 · Alembic · Pydantic v2 · Uvicorn |
| **Database** | PostgreSQL |
| **AI** | IBM watsonx.ai · IBM Granite (`ibm/granite-4-h-small`) |
| **Tooling** | IBM Bob IDE |

---

## 🔌 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/missions/` | List missions |
| `POST` | `/missions/` | Create a mission |
| `GET` | `/telemetry/` | List telemetry records |
| `POST` | `/telemetry/` | Record telemetry |
| `GET` | `/anomalies/` | List detected anomalies |
| `POST` | `/anomalies/` | Create an anomaly |
| `DELETE` | `/anomalies/{anomaly_id}` | Remove an anomaly |
| `GET` | `/health/{mission_id}` | Mission health score and factor breakdown |
| `GET` | `/reports/` | List AI mission reports |
| `POST` | `/reports/` | Create a report |
| `DELETE` | `/reports/cleanup-duplicates` | Remove redundant reports |
| `POST` | `/ai/analyze` | Generate (or reuse) an AI mission analysis |
| `POST` | `/ai/ask` | Ask Mission Commander a question |

Interactive API docs are available at `/docs` when the backend is running.

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL
- An IBM watsonx.ai project and API key

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS / Linux

pip install -r requirements.txt
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/missioninsights
IBM_API_KEY=<your-watsonx-api-key>
WATSONX_PROJECT_ID=<your-watsonx-project-id>
WATSONX_URL=<your-watsonx-region-url>
```

Apply migrations, seed sample mission data, and start the API:

```bash
alembic upgrade head
python seed.py
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

---

## 📁 Project Structure

```text
missioninsights-ai/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy models
│   │   ├── routes/          # FastAPI routers
│   │   ├── services/        # Health score, anomaly detection, watsonx
│   │   ├── database.py
│   │   └── main.py
│   ├── alembic/             # Database migrations
│   └── seed.py              # Idempotent sample mission data
├── frontend/
│   ├── public/brand/        # Logo assets
│   └── src/
│       ├── app/             # Landing page, dashboard, metadata
│       ├── components/      # Dashboard, landing and brand components
│       └── lib/             # API client, types, design tokens
├── datasets/
└── docs/
```

---

## 🤖 IBM Technologies

### IBM watsonx.ai

The AI platform behind all mission analysis. Model inference runs through the
`ibm-watsonx-ai` SDK.

### IBM Granite

`ibm/granite-4-h-small` generates the health summaries, risk levels and recommended actions shown
on the dashboard, and powers Mission Commander responses.

### IBM Bob

IBM Bob IDE was the primary development environment for this project. It was used to build and
refine the Next.js frontend and dashboard components, develop the telemetry visualisation and
mission health interfaces, implement the AI-powered analysis features, integrate the frontend with
the FastAPI backend, review code, and resolve build issues — while maintaining a structured
GitHub workflow with feature branches and incremental testing.

---

## ✅ Project Status

MVP complete:

- [x] Telemetry dashboard with live gauges and charts
- [x] AI anomaly detection with severity and confidence
- [x] Mission health score with factor breakdown
- [x] Mission Commander (grounded natural-language Q&A)
- [x] AI mission reports with deduplication
- [x] Public landing page and brand identity

---

<div align="center">

Built for the **IBM AI Builders Challenge 2026** to demonstrate how AI can improve
space mission monitoring and operational decision support.

**[Launch Mission Control →](https://missioninsights-ai.vercel.app/)**

</div>
