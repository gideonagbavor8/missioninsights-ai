from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import missions
from app.routes import telemetry
from app.routes import anomalies
from app.routes import reports
from app.routes import ai

app = FastAPI(
    title="MissionInsights AI API",
    description="AI-powered space mission data intelligence platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(missions.router)
app.include_router(telemetry.router)
app.include_router(router=anomalies.router)
app.include_router(router=reports.router)
app.include_router(router=ai.router)


@app.get("/")
def root():
    return {
        "message": "MissionInsights AI API is running"
    }