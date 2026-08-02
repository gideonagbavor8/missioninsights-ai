from fastapi import FastAPI

app = FastAPI(
    title="MissionInsights AI API",
    description="Spacecraft telemetry intelligence backend",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "MissionInsights AI Backend is running"
    }