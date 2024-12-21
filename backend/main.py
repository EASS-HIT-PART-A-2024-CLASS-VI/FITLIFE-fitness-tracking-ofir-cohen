from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import yaml

# Load configuration from YAML file
with open("config.yaml", "r") as file:
    config = yaml.safe_load(file)

# Initialize FastAPI app
app = FastAPI(
    title="Fitness and Nutrition Tracking API",
    description="A FastAPI backend application for tracking users, workouts, nutrition logs, weight logs, and goals.",
    version="1.0.0"
)

# In-memory storage to simulate a database
users = {}
workouts = {}
nutrition_logs = {}
weight_logs = {}

# Pydantic Models
class User(BaseModel):
    name: str
    age: int
    gender: Optional[str] = Field(None, description="Gender of the user")
    height: Optional[float] = Field(None, description="Height in cm")
    weight: Optional[float] = Field(None, description="Weight in kg")
    additional_info: Optional[Dict[str, Any]] = None

class Workout(BaseModel):
    user_id: int
    exercise: str
    duration: int

class NutritionLog(BaseModel):
    user_id: int
    food: str
    calories: int

class WeightLog(BaseModel):
    user_id: int
    weight: float
    date: str

class Goal(BaseModel):
    user_id: int
    goal_type: str
    target: float
    deadline: str

# Endpoints
@app.get("/", summary="Root Endpoint", tags=["General"])
def read_root():
    return {"message": config.get("welcome_message", "Welcome to the FastAPI Dockerized Backend")}

@app.post("/users", summary="Create User", tags=["Users"])
def create_user(user_id: int, user: User):
    if user_id in users:
        raise HTTPException(status_code=400, detail="User already exists")
    users[user_id] = user
    return {"user_id": user_id, "user": user}

@app.post("/workouts", summary="Add Workout", tags=["Workouts"])
def add_workout(workout: Workout):
    workouts.setdefault(workout.user_id, []).append(workout)
    return {"message": "Workout added successfully", "workout": workout}

@app.get("/workouts/{user_id}", summary="Get Workouts", tags=["Workouts"])
def get_workouts(user_id: int):
    if user_id not in workouts:
        raise HTTPException(status_code=404, detail="No workouts found for this user")
    return {"user_id": user_id, "workouts": workouts[user_id]}

@app.post("/nutrition", summary="Add Nutrition Log", tags=["Nutrition"])
def add_nutrition_log(log: NutritionLog):
    nutrition_logs.setdefault(log.user_id, []).append(log)
    return {"message": "Nutrition log added successfully", "log": log}

@app.post("/weight", summary="Add Weight Log", tags=["Weight"])
def add_weight_log(weight_log: WeightLog):
    weight_logs.setdefault(weight_log.user_id, []).append(weight_log)
    return {"message": "Weight log added successfully", "log": weight_log}

@app.get("/weight/{user_id}", summary="Get Weight Logs", tags=["Weight"])
def get_weight_logs(user_id: int):
    if user_id not in weight_logs:
        raise HTTPException(status_code=404, detail="No weight logs found for this user")
    return {"user_id": user_id, "weight_logs": weight_logs[user_id]}

@app.post("/goals", summary="Add Fitness Goal", tags=["Goals"])
def add_goal(goal: Goal):
    user_goals = users.setdefault(goal.user_id, {}).setdefault("goals", [])
    user_goals.append(goal)
    return {"message": "Goal added successfully", "goal": goal}

@app.get("/goals/{user_id}", summary="Get Fitness Goals", tags=["Goals"])
def get_goals(user_id: int):
    user_goals = users.get(user_id, {}).get("goals")
    if not user_goals:
        raise HTTPException(status_code=404, detail="No goals found for this user")
    return {"user_id": user_id, "goals": user_goals}

