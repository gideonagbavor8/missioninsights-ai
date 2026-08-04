from app.services.watsonx_service import generate_mission_report

telemetry = """
Mission: Artemis Explorer
Spacecraft ID: AE-01

Battery: 87%
Fuel: 65%
Temperature: 29°C
Signal Strength: 96%
Thruster Vibration: 0.15g
"""

result = generate_mission_report(telemetry)

print(result)