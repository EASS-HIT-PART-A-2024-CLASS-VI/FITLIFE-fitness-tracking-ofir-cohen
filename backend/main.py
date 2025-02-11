from fastapi import FastAPI, HTTPException, Query, Depends
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import yaml
import httpx
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import bcrypt
import os
import jwt
from datetime import datetime, timedelta, timezone, date
from app.database import get_db  
from app.models import UserDB, WorkoutDB, NutritionLogDB, WeightLogDB  

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


# SQLite Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./fitness_tracker.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# JWT and Password Hashing
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

#pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# Database Models
class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=True)
    height = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)

class WorkoutDB(Base):
    __tablename__ = "workouts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    exercise = Column(String, nullable=False)
    duration = Column(Integer, nullable=False)

class NutritionLogDB(Base):
    __tablename__ = "nutrition_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    food = Column(String, nullable=False)
    calories = Column(Integer, nullable=False)

class WeightLogDB(Base):
    __tablename__ = "weight_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    weight = Column(Float, nullable=False)
    date = Column(String, nullable=False)

    

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Utility functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Verify password using bcrypt
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def get_password_hash(password: str) -> str:
    # Hash password using bcrypt
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = db.query(UserDB).filter(UserDB.username == username).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Models for data validation
class User(BaseModel):
    username: str
    password: str
    name: str
    age: int
    gender: Optional[str] = Field(None, description="Gender of the user")
    height: Optional[float] = Field(None, description="Height in cm")
    weight: Optional[float] = Field(None, description="Weight in kg")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class Workout(BaseModel):
    user_id: int
    exercise: str
    duration: int

class NutritionLog(BaseModel):
    user_id: int
    food: str
    calories: int

class WeightLogRequest(BaseModel):
    user_id: int
    weight: float
    date: date


# General Endpoints
@app.get("/", summary="Root Endpoint", tags=["General"])
def read_root():
    return {"message": config.get("welcome_message", "Welcome to the Fitness and Nutrition Tracking API")}


# Authentication Endpoints
@app.post("/register", summary="Register User", tags=["Authentication"])
def register_user(user: User, db: Session = Depends(get_db)):
    if db.query(UserDB).filter(UserDB.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    hashed_password = get_password_hash(user.password)
    db_user = UserDB(
        username=user.username,
        password=hashed_password,
        name=user.name,
        age=user.age,
        gender=user.gender,
        height=user.height,
        weight=user.weight,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {
        "message": "User registered successfully",
        "user": {
            "id": db_user.id,
            "username": db_user.username,
            "name": db_user.name,
            "age": db_user.age,
            "gender": db_user.gender,
            "height": db_user.height,
            "weight": db_user.weight,
        },
    }


@app.post("/login", response_model=Token, summary="User Login", tags=["Authentication"])
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/me", summary="Get Current User", tags=["Authentication"])
def read_users_me(current_user: UserDB = Depends(get_current_user)):
    return {
        "id": current_user.id, 
        "username": current_user.username,
        "name": current_user.name,
        "age": current_user.age,
        "gender": current_user.gender,
        "height": current_user.height,
        "weight": current_user.weight
    }



@app.get("/users/{user_id}", summary="Get User", tags=["Users"])
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user": db_user}

# Workouts
@app.post("/workouts", summary="Add Workout", tags=["Workouts"])
def add_workout(workout: Workout, db: Session = Depends(get_db)) -> dict:
    db_workout = WorkoutDB(
        user_id=workout.user_id,
        exercise=workout.exercise,
        duration=workout.duration,
    )
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return {
        "message": "Workout added successfully",
        "workout": {
            "id": db_workout.id,
            "user_id": db_workout.user_id,
            "exercise": db_workout.exercise,
            "duration": db_workout.duration,
        },
    }

@app.get("/workouts/{user_id}", summary="Get Workouts", tags=["Workouts"])
def get_workouts(user_id: int, db: Session = Depends(get_db)) -> dict:
    workouts = db.query(WorkoutDB).filter(WorkoutDB.user_id == user_id).all()
    if not workouts:
        raise HTTPException(status_code=404, detail="No workouts found for this user")
    return {
        "user_id": user_id,
        "workouts": [
            {"id": w.id, "exercise": w.exercise, "duration": w.duration} for w in workouts
        ],
    }

# Nutrition Logs
@app.post("/nutrition", summary="Add Nutrition Log", tags=["Nutrition"])
def add_nutrition_log(log: NutritionLog, db: Session = Depends(get_db)) -> dict:
    db_log = NutritionLogDB(
        user_id=log.user_id,
        food=log.food,
        calories=log.calories,
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return {
        "message": "Nutrition log added successfully",
        "log": {
            "id": db_log.id,
            "user_id": db_log.user_id,
            "food": db_log.food,
            "calories": db_log.calories,
        },
    }

@app.get("/nutrition/{user_id}", summary="Get Nutrition Logs", tags=["Nutrition"])
def get_nutrition_logs(user_id: int, db: Session = Depends(get_db)) -> dict:
    logs = db.query(NutritionLogDB).filter(NutritionLogDB.user_id == user_id).all()
    if not logs:
        raise HTTPException(status_code=404, detail="No nutrition logs found for this user")
    return {
        "user_id": user_id,
        "logs": [
            {"id": log.id, "food": log.food, "calories": log.calories} for log in logs
        ],
    }


# Weight Logs
@app.post("/weight")
def add_weight_log(weight_log: WeightLogRequest, db: Session = Depends(get_db)):
    """ Adds a new weight entry to the database """
    user = db.query(UserDB).filter(UserDB.id == weight_log.user_id).first()  
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_weight_log = WeightLogDB(user_id=weight_log.user_id, weight=weight_log.weight, date=weight_log.date)
    db.add(new_weight_log)
    db.commit()
    db.refresh(new_weight_log)
    return {"message": "Weight log added successfully"}


@app.get("/weight/{user_id}")
def get_weight_logs(user_id: int, db: Session = Depends(get_db)):
    """ Retrieves all weight logs for a user """
    logs = db.query(WeightLogDB).filter(WeightLogDB.user_id == user_id).order_by(WeightLogDB.date).all()
    if not logs:
        raise HTTPException(status_code=404, detail="No weight logs found")
    return {"logs": logs}


# Utilities: Recommended Calories
@app.get("/recommended-calories", summary="Get Recommended Calories", tags=["Utilities"])
def recommended_calories(
    age: int = Query(..., description="User's age"),
    weight: float = Query(..., description="User's weight in kg"),
    height: float = Query(..., description="User's height in cm"),
    gender: str = Query(..., description="User's gender (male or female)"),
    activity_level: str = Query(..., description="Activity level (low, medium, high)"),
    target: Optional[str] = Query(None, description="User's fitness target (e.g., weight loss, muscle gain)")
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
        return {
            "recommended_calories": round(total_calories, 2),
            "target": target if target else "No specific target provided"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


# Define paths for PDFs
PDF_PATHS = {
    "muscle_building": "files/muscle_building.pdf",
    "fat_loss": "files/fat_loss.pdf",
    "general_fitness": "files/general_fitness.pdf",
    "home_workout": "files/home_workout.pdf"
}

# Training Programs Endpoints
@app.get("/training-programs", tags=["Training Programs"])
async def get_training_programs():
    """
    Get a list of available training programs.
    """
    return {"available_programs": list(PDF_PATHS.keys())}

@app.get("/training-programs/{goal}", tags=["Training Programs"])
def download_training_program(goal: str):
    """
    Download the specified training program as a PDF.
    """
    file_paths = {
        "muscle_building": "files/muscle_building.pdf",
        "fat_loss": "files/fat_loss.pdf",
        "general_fitness": "files/general_fitness.pdf",
        "home_workout": "files/home_workout.pdf",
    }
    file_path = file_paths.get(goal)
    if not file_path or not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Training program not found")
    
    # Explicitly set the `Content-Disposition` header without quotes
    headers = {
        "Content-Disposition": f"attachment; filename={goal}.pdf",
    }
    return FileResponse(file_path, media_type="application/pdf", headers=headers)
