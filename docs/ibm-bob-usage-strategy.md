# IBM Bob Usage Strategy

## Purpose

IBM Bob will be used as the primary AI development assistant for building MissionInsights AI.

The goal is to use IBM Bob efficiently by providing clear requirements, architecture decisions, and technical specifications before requesting code generation.

---

# Development Philosophy

Before asking IBM Bob to generate code:

1. Define the problem clearly.
2. Provide the required architecture.
3. Specify the expected output.
4. Request focused implementation.

IBM Bob should assist with:

- Code generation
- Debugging
- Refactoring
- Testing
- Documentation
- Technical problem solving

---

# What IBM Bob Will Help Build

## Frontend Development

IBM Bob will assist with:

- Next.js 15 components
- TypeScript interfaces
- Tailwind CSS styling
- Dashboard layouts
- Data visualization components

Examples:

- Telemetry cards
- Charts
- Alerts panels
- Mission reports UI

---

## Backend Development

IBM Bob will assist with:

- FastAPI endpoints
- Database integration
- Data processing logic
- API documentation

Examples:

- Telemetry API
- Anomaly API
- AI report API

---

## AI Integration

IBM Bob will assist with:

- IBM Granite integration
- AI prompt design
- AI response formatting
- Context preparation

Examples:

Input:

```
Telemetry:
Temperature: 88°C
Thruster vibration: 0.68
Battery: 72%
```

Output:

```
High risk anomaly detected.

Possible cause:
Propulsion system instability.

Recommendation:
Schedule diagnostics.
```

---

# Bobcoin Conservation Rules

## Avoid

Do not ask:

"Build the entire MissionInsights AI application."

Reason:

Large requests consume more resources and produce less controlled results.

---

## Prefer

Ask focused requests:

"Create a Next.js telemetry dashboard component using TypeScript and Tailwind CSS."

"Create a FastAPI endpoint that returns spacecraft telemetry data."

"Review this anomaly detection function and suggest improvements."

---

# Development Order

IBM Bob usage will follow this sequence:

## Phase 1: Setup

Use Bob for:

- Project initialization
- Configuration
- Dependencies

---

## Phase 2: Frontend

Use Bob for:

- Components
- Pages
- UI improvements

---

## Phase 3: Backend

Use Bob for:

- API development
- Database integration

---

## Phase 4: AI Features

Use Bob for:

- AI integration
- Prompt engineering
- Response processing

---

## Phase 5: Testing

Use Bob for:

- Debugging
- Code review
- Optimization

---

# Prompt Structure

Every IBM Bob request should include:

## Context

Explain the project area.

Example:

"MissionInsights AI is a spacecraft telemetry intelligence platform."

## Task

Clearly define what needs to be built.

Example:

"Create a telemetry API endpoint."

## Requirements

List technical requirements.

Example:

- Use FastAPI
- Return JSON
- Connect to PostgreSQL

## Expected Output

Explain the desired result.

Example:

"Provide production-ready code with explanations."

---

# Final Goal

Use IBM Bob to accelerate development while maintaining:

- Clean architecture
- High-quality code
- Clear documentation
- Efficient use of AI resources

IBM Bob should reduce development time, not replace engineering decisions.
