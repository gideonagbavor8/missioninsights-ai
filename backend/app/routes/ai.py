from fastapi import APIRouter
from pydantic import BaseModel

from app.services.watsonx_service import generate_mission_report


router = APIRouter(
    prefix="/ai",
    tags=["AI Analysis"]
)


class TelemetryRequest(BaseModel):
    mission: str
    spacecraft_id: str
    battery: int
    fuel: int
    temperature: float
    signal_strength: int
    vibration: float


@router.post("/analyze")
def analyze_telemetry(data: TelemetryRequest):

    telemetry_text = f"""
Mission: {data.mission}
Spacecraft ID: {data.spacecraft_id}

Battery: {data.battery}%
Fuel: {data.fuel}%
Temperature: {data.temperature}°C
Signal Strength: {data.signal_strength}%
Thruster Vibration: {data.vibration}g
"""

    report = generate_mission_report(telemetry_text)

    return {
        "mission": data.mission,
        "spacecraft_id": data.spacecraft_id,
        "ai_report": report
    }