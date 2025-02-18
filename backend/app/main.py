from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yaml

# Import routers
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.workouts import router as workouts_router
from app.api.nutrition import router as nutrition_router
from app.api.weight import router as weight_router
from app.api.training_programs import router as training_programs_router
from app.api.recommendations import router as recommendations_router

# Load configuration
try:
    with open("config.yaml", "r") as file:
        config = yaml.safe_load(file)
except FileNotFoundError:
    config = {"welcome_message": "Welcome to the Fitness and Nutrition Tracking API"}

# Initialize FastAPI app
app = FastAPI(
    title="Fitness and Nutrition Tracking API",
    description="A FastAPI backend application for tracking users, workouts, nutrition logs, weight logs, goals, and training programs.",
    version="1.0.0"
)

# CORS middleware setup
origins = [
    "http://localhost:3000",  # React frontend
    "http://127.0.0.1:3000"   # Alternative local frontend address
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include routers
app.include_router(auth_router)
app.include_router(users_router, prefix="/users")
app.include_router(workouts_router, prefix="/workouts")
app.include_router(nutrition_router, prefix="/nutrition")
app.include_router(weight_router, prefix="/weight")
app.include_router(training_programs_router, prefix="/training-programs")
app.include_router(recommendations_router, prefix="/recommended-calories")

# Root endpoint
@app.get("/", summary="Root Endpoint", tags=["General"])
def read_root():
    return {"message": config.get("welcome_message", "Welcome to the Fitness and Nutrition Tracking API")}