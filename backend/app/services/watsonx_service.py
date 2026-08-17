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


def generate_mission_report(
    telemetry_data: str,
    anomaly_data: str,
):
    messages = [
        {
            "role": "system",
            "content": (
                "You are an AI space mission intelligence assistant. "
                "Analyze spacecraft telemetry together with detected anomalies "
                "and determine the actual mission risk. "
                "Pay particular attention to worsening trends and high-severity anomalies. "
                "Always return valid JSON only. "
                "Do not use markdown, code fences, or additional explanations."
            ),
        },
        {
            "role": "user",
            "content": f"""
Analyze the following spacecraft telemetry and detected anomaly data.

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
- "health_summary" must reflect both telemetry values and detected anomalies.
- "anomalies" must contain the important detected anomalies.
- "risk_level" must be exactly one of: "Low", "Medium", or "High".
- If a High severity anomaly is present, risk_level should normally be "High".
- If multiple Medium anomalies or significant worsening trends are present, risk_level should normally be "Medium".
- Use "Low" only when the telemetry and anomalies indicate normal or low-risk operation.
- "recommendations" must contain practical actions based on the detected risks.
- Do not ignore detected anomalies simply because individual telemetry values appear acceptable.
- Return JSON only.

Telemetry:
{telemetry_data}

Detected Anomalies:
{anomaly_data}
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