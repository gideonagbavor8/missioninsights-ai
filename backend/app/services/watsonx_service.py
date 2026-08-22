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

def answer_mission_question(
    telemetry_data: str,
    anomaly_data: str,
    question: str,
) -> str:
    messages = [
        {
            "role": "system",
            "content": (
                "You are Mission Commander, an AI assistant for spacecraft operations. "
                "You answer questions from mission operators using ONLY the telemetry "
                "readings and detected anomalies provided. "

                "IMPORTANT DATA INTERPRETATION RULES: "
                "Anomaly confidence values are whole-number percentages from 0 to 100. "
                "A confidence value of 87 means 87 percent confidence. "
                "A confidence value of 82 means 82 percent confidence. "
                "Treat confidence values exactly as provided in the anomaly data. "
                "Never convert confidence values to decimal fractions. "
                "Never divide confidence values by 100. "
                "Never multiply confidence values by 100. "
                "Never report 87 as 0.87 percent or 1 percent. "
                "If the data says 87 percent confidence, report 87 percent confidence. "
                "If the data says 82 percent confidence, report 82 percent confidence. "

                "When determining which anomaly should receive priority, consider "
                "severity, confidence, potential mission impact, and whether the "
                "anomaly indicates a worsening trend. "

                "A worsening thruster vibration trend should be treated as an important "
                "propulsion risk because propulsion is mission-critical. "

                "Never invent telemetry values, anomaly events, confidence values, "
                "or system states. "
                "When proposing a cause, clearly label it as a possibility, not a fact. "
                "If the supplied data does not establish a definite relationship, say so. "

                "Keep answers concise, practical, and operator-focused. "
                "Respond in plain text, with no markdown, bullet symbols, or code blocks."
            ),
        },
        {
            "role": "user",
            "content": (
                f"Current mission context:\n\n"
                f"Telemetry:\n{telemetry_data}\n\n"
                f"Detected anomalies:\n{anomaly_data}\n\n"
                f"Operator question: {question}"
            ),
        },
    ]

    response = model.chat(messages=messages)
    return response["choices"][0]["message"]["content"].strip()