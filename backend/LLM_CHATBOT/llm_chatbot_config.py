import os
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv()

# ✅ Retrieve Mistral API Key from .env file
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
if not MISTRAL_API_KEY:
    raise ValueError("Error: Mistral API Key is missing. Please check your .env file.")

MODEL_NAME = "mistral-small-latest"  # ✅ Correct model name
TEMPERATURE = 0.7
MAX_TOKENS = 150
