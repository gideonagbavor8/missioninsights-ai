# IBM Bob Development Prompts

## Purpose

This document contains structured prompts for IBM Bob during the development of MissionInsights AI.

The goal is to use IBM Bob efficiently by giving clear context, technical requirements, and expected outcomes.

---

# General Project Context Prompt

Use this at the beginning of development:

```
I am building MissionInsights AI: Mission Control Copilot.

It is an AI-powered spacecraft telemetry intelligence platform that transforms spacecraft data into actionable insights.

Technology stack:
- Next.js 15
- TypeScript
- Tailwind CSS
- FastAPI
- Python
- PostgreSQL
- IBM Granite AI

Core features:
1. Telemetry Dashboard
2. AI Anomaly Detection
3. Mission Commander AI Assistant
4. AI Mission Reports

Follow clean architecture principles.
Do not introduce unnecessary dependencies.
Prioritize maintainable production-quality code.
```

---

# 1. Project Initialization Prompt

```
Set up the initial project structure for MissionInsights AI.

Requirements:

Frontend:
- Next.js 15
- TypeScript
- Tailwind CSS
- App Router

Backend:
- FastAPI
- Python virtual environment

Database:
- PostgreSQL configuration

Create a clean folder structure following best practices.

Explain each generated file before implementation.
```

---

# 2. Frontend Dashboard Prompt

```
Create the MissionInsights AI telemetry dashboard.

Requirements:

Framework:
- Next.js 15
- TypeScript
- Tailwind CSS

Components needed:

- Mission status card
- Battery metric card
- Fuel metric card
- Temperature metric card
- Signal strength card
- Thruster vibration card
- Telemetry chart
- Active alerts panel

Use reusable components.

Create responsive layouts suitable for desktop and mobile.
```

---

# 3. Backend API Prompt

```
Create FastAPI endpoints for MissionInsights AI.

Requirements:

Create APIs for:

GET /missions
GET /telemetry
GET /anomalies
GET /reports

Use PostgreSQL as the database.

Include:
- Data models
- Validation
- Error handling
- API documentation

Follow REST API best practices.
```

---

# 4. Database Integration Prompt

```
Implement PostgreSQL database integration.

Database tables:

missions
telemetry_records
anomalies
ai_reports

Requirements:

- Create database models
- Configure connection
- Add sample seed data
- Explain database relationships
```

---

# 5. Telemetry Dataset Prompt

```
Generate a realistic spacecraft telemetry dataset.

Requirements:

Create 5000 records.

Include:

- timestamp
- mission_id
- battery_level
- fuel_level
- temperature
- signal_strength
- thruster_vibration
- power_consumption
- system_status

Include:
- Normal spacecraft behavior
- Controlled anomaly cases

Export as CSV format.
```

---

# 6. AI Anomaly Detection Prompt

```
Implement an anomaly detection system for spacecraft telemetry.

Requirements:

Analyze:

- Temperature changes
- Battery degradation
- Fuel consumption
- Signal issues
- Thruster vibration

Output:

- Severity
- Description
- Confidence score
- Recommended action

Explain the detection approach.
```

---

# 7. IBM Granite Integration Prompt

```
Integrate IBM Granite AI into MissionInsights AI.

Purpose:

Generate mission explanations and recommendations.

Input:

Telemetry information
Detected anomalies
Mission status

Output:

- Mission summary
- Risk explanation
- Recommended actions

Create a clean AI service layer.
```

---

# 8. Mission Commander Prompt

```
Build the Mission Commander AI assistant.

Requirements:

Users can ask mission questions.

Examples:

"What is the current spacecraft risk?"
"Why is fuel consumption increasing?"
"What system requires attention?"

The AI should use available telemetry and anomaly data when responding.
```

---

# 9. Testing Prompt

```
Review MissionInsights AI for bugs and improvements.

Check:

- Frontend errors
- Backend API issues
- Database problems
- AI response quality
- Performance issues

Suggest fixes without changing the architecture.
```

---

# 10. Final Optimization Prompt

```
Review MissionInsights AI as a senior software engineer.

Evaluate:

- Code quality
- Security
- Performance
- User experience
- Competition readiness

Suggest improvements required before submission.
```

---

# IBM Bob Usage Rules

Always:

- Provide context before requesting code.
- Request one feature at a time.
- Review generated code before accepting.
- Test after every major change.

Avoid:

- Asking Bob to build the entire application at once.
- Adding unnecessary technologies.
- Changing architecture without planning.
