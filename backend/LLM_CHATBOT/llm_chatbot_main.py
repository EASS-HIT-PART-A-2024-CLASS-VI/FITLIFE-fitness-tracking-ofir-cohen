from fastapi import FastAPI
from llm_chatbot_service import router as chatbot_router

app = FastAPI(title="LLM Chatbot Microservice", description="Handles AI-powered fitness chatbot.")

# Register the chatbot service
app.include_router(chatbot_router, prefix="/chatbot", tags=["Chatbot"])

@app.get("/")
async def root():
    return {"message": "LLM Chatbot Microservice is running!"}
