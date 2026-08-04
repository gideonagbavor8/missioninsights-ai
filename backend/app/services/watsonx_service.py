import os


from dotenv import load_dotenv
load_dotenv()

from ibm_watsonx_ai.foundation_models import ModelInference
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams


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
            "content": "You are an AI space mission intelligence assistant. Analyze spacecraft telemetry data and provide mission insights."
        },
        {
            "role": "user",
            "content": f"""
Analyze this spacecraft telemetry data.

Provide:
1. Mission health summary
2. Detected anomalies
3. Risk level
4. Recommended actions

Telemetry:
{telemetry_data}
"""
        }
    ]

    response = model.chat(messages=messages)

    return response["choices"][0]["message"]["content"]