from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import yaml
import httpx
from bs4 import BeautifulSoup

# Load configuration from YAML file
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

# In-memory storage to simulate a database
users = {}
workouts = {}
nutrition_logs = {}
weight_logs = {}

# Models for data validation
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
    recommended_program: Optional[str] = None

# General Endpoints
@app.get("/", summary="Root Endpoint", tags=["General"])
def read_root():
    return {"message": config.get("welcome_message", "Welcome to the Fitness and Nutrition Tracking API")}

# User Management
@app.post("/users", summary="Create User", tags=["Users"])
def create_user(user_id: int, user: User):
    if user_id in users:
        raise HTTPException(status_code=400, detail="User already exists")
    users[user_id] = user
    return {"user_id": user_id, "user": user}

# Workouts
@app.post("/workouts", summary="Add Workout", tags=["Workouts"])
def add_workout(workout: Workout):
    workouts.setdefault(workout.user_id, []).append(workout)
    return {"message": "Workout added successfully", "workout": workout}

@app.get("/workouts/{user_id}", summary="Get Workouts", tags=["Workouts"])
def get_workouts(user_id: int):
    if user_id not in workouts:
        raise HTTPException(status_code=404, detail="No workouts found for this user")
    return {"user_id": user_id, "workouts": workouts[user_id]}

# Nutrition Logs
@app.post("/nutrition", summary="Add Nutrition Log", tags=["Nutrition"])
def add_nutrition_log(log: NutritionLog):
    nutrition_logs.setdefault(log.user_id, []).append(log)
    return {"message": "Nutrition log added successfully", "log": log}

# Weight Logs
@app.post("/weight", summary="Add Weight Log", tags=["Weight"])
def add_weight_log(weight_log: WeightLog):
    weight_logs.setdefault(weight_log.user_id, []).append(weight_log)
    return {"message": "Weight log added successfully", "log": weight_log}

@app.get("/weight/{user_id}", summary="Get Weight Logs", tags=["Weight"])
def get_weight_logs(user_id: int):
    if user_id not in weight_logs:
        raise HTTPException(status_code=404, detail="No weight logs found for this user")
    return {"user_id": user_id, "weight_logs": weight_logs[user_id]}

# Goals
@app.post("/goals", summary="Add Fitness Goal", tags=["Goals"])
def add_goal(goal: Goal):
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
    try:
        activity_level_mapping = {"low": 1.2, "medium": 1.55, "high": 1.9}
        if activity_level.lower() not in activity_level_mapping:
            raise HTTPException(status_code=400, detail="Invalid activity level.")
        if gender.lower() not in ["male", "female"]:
            raise HTTPException(status_code=400, detail="Invalid gender.")
        bmr = (
            (10 * weight + 6.25 * height - 5 * age + 5)
            if gender.lower() == "male"
            else (10 * weight + 6.25 * height - 5 * age - 161)
        )
        total_calories = bmr * activity_level_mapping[activity_level.lower()]
        return {"recommended_calories": round(total_calories, 2)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Scrape Training Programs
@app.get("/scrape-training-program", summary="Get Training Program", tags=["Training"])
async def scrape_training_program(goal: str = Query(..., description="User's goal (e.g., weight loss, muscle gain, general fitness)")):
    """
    Dynamically scrape training programs from OneBody website based on user goal.
    """
    try:
        url = "https://www.onebody.co.il/category/training/plan/"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            html_content = response.text

        soup = BeautifulSoup(html_content, "html.parser")
        programs = []

        training_cards = soup.find_all("div", class_="post")
        if not training_cards:
            raise HTTPException(status_code=404, detail="No training programs found on the website.")

        for card in training_cards:
            title = card.find("h2", class_="entry-title")
            link = card.find("a")
            description = card.find("div", class_="entry-content")

            # Handle missing elements
            if not title or not link or not description:
                continue

            if goal.lower() in title.text.strip().lower() or goal.lower() in description.text.strip().lower():
                programs.append({
                    "title": title.text.strip(),
                    "link": link["href"].strip(),
                    "description": description.text.strip()
                })

        if not programs:
            raise HTTPException(status_code=404, detail="No training programs match the specified goal.")

        return {"goal": goal, "training_programs": programs}

    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"HTTP request failed: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")
