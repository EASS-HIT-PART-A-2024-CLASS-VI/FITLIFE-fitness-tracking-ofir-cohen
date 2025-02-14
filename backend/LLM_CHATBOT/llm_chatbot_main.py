from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from llm_chatbot_service import router as chatbot_router

app = FastAPI(
    title="LLM Chatbot Microservice",
    description="Handles AI-powered fitness chatbot."
)

# 1) Enable CORS so the React frontend (port 3000) can communicate
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2) Register the chatbot service with the prefix `/chatbot`
app.include_router(chatbot_router, prefix="/chatbot", tags=["Chatbot"])

@app.get("/")
async def root():
    return {"message": "LLM Chatbot Microservice is running!"}

# 3) Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
