from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import yaml

# Load configuration from YAML file
with open("config.yaml", "r") as file:
    config = yaml.safe_load(file)

# Initialize FastAPI app
app = FastAPI(
    title="Fitness and Nutrition Tracking API",
    description="A FastAPI backend application for tracking users, workouts, nutrition logs, weight logs, goals, and training programs.",
    version="1.0.0"
)

# In-memory storage to simulate a database
users = {}
workouts = {}
nutrition_logs = {}
weight_logs = {}

# Models for data validation
class User(BaseModel):
    """
    Model for user data.
    """
    name: str
    age: int
    gender: Optional[str] = Field(None, description="Gender of the user")
    height: Optional[float] = Field(None, description="Height in cm")
    weight: Optional[float] = Field(None, description="Weight in kg")
    additional_info: Optional[Dict[str, Any]] = None

class Workout(BaseModel):
    """
    Model for workout data.
    """
    user_id: int
    exercise: str
    duration: int

class NutritionLog(BaseModel):
    """
    Model for nutrition log data.
    """
    user_id: int
    food: str
    calories: int

class WeightLog(BaseModel):
    """
    Model for weight log data.
    """
    user_id: int
    weight: float
    date: str

class Goal(BaseModel):
    """
    Model for user goals with optional recommended program.
    """
    user_id: int
    goal_type: str
    target: float
    deadline: str
    recommended_program: Optional[str] = None

# General Endpoints
@app.get("/", summary="Root Endpoint", tags=["General"])
def read_root():
    """
    Root endpoint that displays a welcome message.
    """
    return {"message": config.get("welcome_message", "Welcome to the FastAPI Dockerized Backend")}

# User Management
@app.post("/users", summary="Create User", tags=["Users"])
def create_user(user_id: int, user: User):
    """
    Create a new user in the system.
    """
    if user_id in users:
        raise HTTPException(status_code=400, detail="User already exists")
    users[user_id] = user
    return {"user_id": user_id, "user": user}

# Workouts
@app.post("/workouts", summary="Add Workout", tags=["Workouts"])
def add_workout(workout: Workout):
    """
    Add a workout entry for a user.
    """
    workouts.setdefault(workout.user_id, []).append(workout)
    return {"message": "Workout added successfully", "workout": workout}

@app.get("/workouts/{user_id}", summary="Get Workouts", tags=["Workouts"])
def get_workouts(user_id: int):
    """
    Retrieve all workouts for a specific user.
    """
    if user_id not in workouts:
        raise HTTPException(status_code=404, detail="No workouts found for this user")
    return {"user_id": user_id, "workouts": workouts[user_id]}

# Nutrition Logs
@app.post("/nutrition", summary="Add Nutrition Log", tags=["Nutrition"])
def add_nutrition_log(log: NutritionLog):
    """
    Add a nutrition log entry for a user.
    """
    nutrition_logs.setdefault(log.user_id, []).append(log)
    return {"message": "Nutrition log added successfully", "log": log}

# Weight Logs
@app.post("/weight", summary="Add Weight Log", tags=["Weight"])
def add_weight_log(weight_log: WeightLog):
    """
    Add a weight log entry for a user.
    """
    weight_logs.setdefault(weight_log.user_id, []).append(weight_log)
    return {"message": "Weight log added successfully", "log": weight_log}

@app.get("/weight/{user_id}", summary="Get Weight Logs", tags=["Weight"])
def get_weight_logs(user_id: int):
    """
    Retrieve all weight logs for a specific user.
    """
    if user_id not in weight_logs:
        raise HTTPException(status_code=404, detail="No weight logs found for this user")
    return {"user_id": user_id, "weight_logs": weight_logs[user_id]}

# Goals
@app.post("/goals", summary="Add Fitness Goal", tags=["Goals"])
def add_goal(goal: Goal):
    """
    Add a new goal for a user and suggest a training program if available.
    """
    recommended_programs = {
        "weight loss": "https://madmuscles.com/weight-loss-plan",
        "muscle gain": "https://madmuscles.com/muscle-gain-plan",
        "general fitness": "https://madmuscles.com/general-fitness-plan",
    }
    goal.recommended_program = recommended_programs.get(goal.goal_type, "No program available")

    user_goals = users.setdefault(goal.user_id, {}).setdefault("goals", [])
    user_goals.append(goal)
    return {"message": "Goal added successfully", "goal": goal}

# Utilities: Recommended Calories
@app.get("/recommended-calories", summary="Get Recommended Calories", tags=["Utilities"])
def recommended_calories(
    age: int = Query(..., description="User's age"),
    weight: float = Query(..., description="User's weight in kg"),
    height: float = Query(..., description="User's height in cm"),
    gender: str = Query(..., description="User's gender (male or female)"),
    activity_level: str = Query(..., description="Activity level (low, medium, high)"),
):
    """
    Calculate the recommended daily calorie intake based on user data using
    the Mifflin-St Jeor Equation.
    """
    try:
        # Validate activity level
        activity_level_mapping = {"low": 1.2, "medium": 1.55, "high": 1.9}
        if activity_level.lower() not in activity_level_mapping:
            raise HTTPException(status_code=400, detail="Invalid activity level. Choose from 'low', 'medium', or 'high'.")

        # Validate gender
        if gender.lower() not in ["male", "female"]:
            raise HTTPException(status_code=400, detail="Invalid gender. Choose 'male' or 'female'.")

        # Calculate BMR (Basal Metabolic Rate)
        if gender.lower() == "male":
            bmr = 10 * weight + 6.25 * height - 5 * age + 5
        else:
            bmr = 10 * weight + 6.25 * height - 5 * age - 161

        # Calculate total daily calorie needs
        activity_multiplier = activity_level_mapping[activity_level.lower()]
        total_calories = bmr * activity_multiplier

        return {
            "age": age,
            "weight": weight,
            "height": height,
            "gender": gender,
            "activity_level": activity_level,
            "recommended_calories": round(total_calories, 2),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Training Program Endpoint
@app.get("/training-program", summary="Get Training Program", tags=["Recommendations"])
def get_training_program(goal: str = Query(..., description="User's goal (e.g., weight loss, muscle gain)")):
    """
    Recommend a training program based on user goals.
    """
    try:
        recommended_programs = {
            "weight loss": "https://madmuscles.com/weight-loss-plan",
            "muscle gain": "https://madmuscles.com/muscle-gain-plan",
            "general fitness": "https://madmuscles.com/general-fitness-plan",
        }

        if goal not in recommended_programs:
            raise HTTPException(status_code=404, detail="No training program found for this goal")

        return {"goal": goal, "program_url": recommended_programs[goal]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
