import os
import requests
import json
from llm_chatbot_config import MISTRAL_API_KEY, MODEL_NAME, TEMPERATURE, MAX_TOKENS

MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"

def ask_llm_chatbot(user_query: str):
    """
    Send a user query to Mistral AI API and return a response.
    """
    if not user_query or not user_query.strip():
        return {"error": "400: Query cannot be empty"}

    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY.strip()}",
        "Content-Type": "application/json"
    }

    payload = json.dumps({
        "model": MODEL_NAME,
        "messages": [
            {"role": "system", "content": "You are a fitness and nutrition expert. Answer only fitness and nutrition-related questions."},
            {"role": "user", "content": user_query.strip()}
        ],
        "temperature": TEMPERATURE,
        "max_tokens": MAX_TOKENS
    })

    try:
        response = requests.post(MISTRAL_API_URL, headers=headers, data=payload)
        response_json = response.json()

        print("🔹 DEBUG: Full API Response:", response_json)

        if response.status_code != 200:
            return {"error": f"500: Mistral API Error: {response_json.get('error', 'Unknown error')}"}

        return response_json["choices"][0]["message"]["content"].strip()

    except requests.exceptions.RequestException as e:
        return {"error": f"500: API Connection Error: {str(e)}"}

    except Exception as e:
        return {"error": f"500: Internal Server Error: {str(e)}"}