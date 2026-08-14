import json
import os

from dotenv import load_dotenv
from ibm_watsonx_ai.foundation_models import ModelInference

load_dotenv()


model = ModelInference(
    model_id="ibm/granite-4-h-small",
    params={
        "max_tokens": 500,
        "temperature": 0.2,
    },
    credentials={
        "url": os.getenv("WATSONX_URL"),
        "apikey": os.getenv("IBM_API_KEY"),
    },
    project_id=os.getenv("WATSONX_PROJECT_ID"),
)


def generate_mission_report(telemetry_data: str):
    messages = [
        {
            "role": "system",
            "content": (
                "You are an AI space mission intelligence assistant. "
                "Analyze spacecraft telemetry data and identify mission risks. "
                "Always return valid JSON only. "
                "Do not use markdown, code fences, or additional explanations."
            ),
        },
        {
            "role": "user",
            "content": f"""
Analyze the following spacecraft telemetry data.

Return ONLY valid JSON using exactly this structure:

{{
    "health_summary": "A concise summary of the spacecraft's overall health.",
    "anomalies": [
        "Detected anomaly 1",
        "Detected anomaly 2"
    ],
    "risk_level": "Low",
    "recommendations": [
        "Recommended action 1",
        "Recommended action 2"
    ]
}}

Rules:
- "health_summary" must be a concise description of the spacecraft's condition.
- "anomalies" must be a JSON array of detected anomalies.
- If there are no anomalies, return an empty array.
- "risk_level" must be exactly one of: "Low", "Medium", or "High".
- "recommendations" must be a JSON array of recommended actions.
- Return JSON only.

Telemetry:
{telemetry_data}
""",
        },
    ]

    response = model.chat(messages=messages)

    content = response["choices"][0]["message"]["content"].strip()

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {
            "health_summary": content,
            "anomalies": [],
            "risk_level": "Unknown",
            "recommendations": [],
        }