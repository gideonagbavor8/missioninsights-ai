from fastapi import FastAPI
from app.routes import missions

app = FastAPI(
    title="MissionInsights AI API",
    description="AI-powered space mission data intelligence platform",
    version="1.0.0"
)

app.include_router(missions.router)


@app.get("/")
def root():
    return {
        "message": "MissionInsights AI API is running"
    }