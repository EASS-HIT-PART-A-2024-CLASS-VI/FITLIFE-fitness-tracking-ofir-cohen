from fastapi import APIRouter, HTTPException
from llm_chatbot_utils import ask_llm_chatbot

router = APIRouter(prefix="/llm_chatbot")

@router.post("/")
async def chatbot_endpoint(request: dict):
    """
    Handle user queries to LLM Chatbot.
    """
    query_text = request.get("question", "").strip()

    if not query_text:
        raise HTTPException(status_code=400, detail="400: Query cannot be empty")

    response = ask_llm_chatbot(query_text)

    if isinstance(response, dict) and "error" in response:
        error_message = response["error"]
        error_code = int(error_message.split(":")[0]) if error_message.split(":")[0].isdigit() else 500
        raise HTTPException(status_code=error_code, detail=error_message)

    return {"response": response}