import warnings
from sqlalchemy.exc import SAWarning
# Suppress DeprecationWarning for SQLite3 date adapter and MovedIn20Warning
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", category=SAWarning)
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from unittest.mock import patch
from app.main import app
from app.database import Base, get_db
import time
import os
import requests
import pytest
from pydantic import BaseModel, Field
from typing import Optional
import sqlalchemy

# Update the User model to match the one in main.py
class User(BaseModel):
    username: str
    password: str
    name: str
    age: int
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    email: Optional[str] = None

DATABASE_URL = "sqlite:///./test_fitness_tracker.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def clear_test_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

# Updated chatbot tests with mocking
CHATBOT_URL = "http://localhost:8001/chatbot"

@pytest.fixture
def mock_chatbot_response():
    with patch('requests.post') as mock_post:
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = {
            "response": "Here are some good protein sources: chicken, fish, eggs, legumes, and tofu."
        }
        yield mock_post

def test_llm_chatbot_valid_query(mock_chatbot_response):
    """
    Test valid chatbot response with mocked API.
    """
    response = requests.post(
        CHATBOT_URL,
        json={"question": "What are some good protein sources?"}
    )
    assert response.status_code == 200
    assert "protein" in response.json()["response"].lower()
    mock_chatbot_response.assert_called_once()

@pytest.fixture
def mock_chatbot_error():
    with patch('requests.post') as mock_post:
        mock_post.return_value.status_code = 400
        mock_post.return_value.json.return_value = {
            "detail": "400: Query cannot be empty"
        }
        yield mock_post

def test_llm_chatbot_empty_query(mock_chatbot_error):
    """
    Test chatbot response for an empty query with mocked API.
    """
    response = requests.post(CHATBOT_URL, json={"question": ""})
    assert response.status_code == 400
    mock_chatbot_error.assert_called_once()

# Test Root Endpoint
def test_read_root():
    clear_test_database()  # Clear database before running the test
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

# Shared test user creation function
def create_test_user(
    username="johndoe", 
    password="securepassword", 
    name="John Doe", 
    age=30, 
    gender="Male", 
    height=180.0, 
    weight=75.0, 
    email=None
):
    if email is None:
        email = f"{username}@example.com"
    
    user_data = {
        "username": username,
        "password": password,
        "name": name,
        "age": age,
        "gender": gender,
        "height": height,
        "weight": weight,
        "email": email
    }
    
    # Ensure unique timestamp-based username for registration
    if username == "johndoe":
        user_data["username"] = f"johndoe_{int(time.time())}"
        user_data["email"] = f"johndoe_{int(time.time())}@example.com"
    
    return user_data

# Test Register Endpoint
def test_register_user():
    clear_test_database()  # Clear database before running the test
    user_data = create_test_user(
        username=f"testuser_{int(time.time())}", 
        email=f"testuser_{int(time.time())}@example.com"
    )
    response = client.post("/register", json=user_data)
    assert response.status_code == 200
    assert response.json()["message"] == "User registered successfully"

def test_login_user():
    clear_test_database()  # Clear database before running the test
    user_data = create_test_user()
    client.post("/register", json=user_data)
    login_data = {
        "username": user_data["username"], 
        "password": user_data["password"]
    }
    response = client.post("/login", data=login_data)
    assert response.status_code == 200
    assert "access_token" in response.json()

# Remaining tests follow the same pattern with create_test_user
def test_get_current_user():
    clear_test_database()
    user_data = create_test_user()
    client.post("/register", json=user_data)
    login_response = client.post("/login", data={
        "username": user_data["username"], 
        "password": user_data["password"]
    })
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["username"] == user_data["username"]

def test_add_workout():
    clear_test_database()
    user_data = create_test_user()
    client.post("/register", json=user_data)

    workout_data = {
        "user_id": 1,
        "exercise": "Running",
        "duration": 30,
        "date": "2025-02-11"
    }

    response = client.post("/workouts", json=workout_data)
    assert response.status_code == 200, f"Failed with response: {response.json()}"
    assert response.json()["message"] == "Workout added successfully"


def test_get_workouts():
    clear_test_database()
    user_data = create_test_user()
    client.post("/register", json=user_data)

    workout_data = {
        "user_id": 1,
        "exercise": "Running",
        "duration": 30,
        "date": "2025-02-11"
    }

    client.post("/workouts", json=workout_data)

    response = client.get(f"/workouts/1?date=2025-02-11")
    assert response.status_code == 200
    assert "workouts" in response.json()

def test_add_nutrition_log():
    clear_test_database()
    user_data = create_test_user()
    client.post("/register", json=user_data)
    nutrition_data = {"user_id": 1, "food": "Chicken Salad", "calories": 400}
    response = client.post("/nutrition", json=nutrition_data)
    assert response.status_code == 200
    assert response.json()["message"] == "Nutrition log added successfully"

def test_get_nutrition_logs():
    clear_test_database()
    user_data = create_test_user()
    client.post("/register", json=user_data)
    nutrition_data = {"user_id": 1, "food": "Chicken Salad", "calories": 400}
    client.post("/nutrition", json=nutrition_data)
    response = client.get("/nutrition/1")
    assert response.status_code == 200
    assert "logs" in response.json()
    
def test_add_weight_log():
    clear_test_database()
    user_data = create_test_user()
    client.post("/register", json=user_data)
    weight_log = {"user_id": 1, "weight": 75.0, "date": "2024-12-29"}
    response = client.post("/weight", json=weight_log)
    assert response.status_code == 200
    assert response.json()["message"] == "Weight log added successfully"

def test_get_weight_logs():
    clear_test_database()
    user_data = create_test_user()
    client.post("/register", json=user_data)
    weight_log = {"user_id": 1, "weight": 75.0, "date": "2024-12-29"}
    client.post("/weight", json=weight_log)
    response = client.get("/weight/1")
    assert response.status_code == 200
    assert "logs" in response.json()

# Test Recommended Calories
def test_recommended_calories():
    clear_test_database()  # Clear database before running the test
    params = {
        "age": 30,
        "weight": 75.5,
        "height": 180,
        "gender": "male",
        "activity_level": "medium",
        "target": "weight loss"
    }
    response = client.get("/recommended-calories", params=params)
    assert response.status_code == 200
    assert "recommended_calories" in response.json()

# Test Training Programs
def test_training_program_list():
    clear_test_database()  # Clear database before running the test
    response = client.get("/training-programs")
    assert response.status_code == 200
    data = response.json()
    assert "available_programs" in data
    assert "muscle_building" in data["available_programs"]

def test_training_program_download():
    clear_test_database()  # Clear database before running the test
    response = client.get("/training-programs/muscle_building")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert response.headers["content-disposition"] == "attachment; filename=muscle_building.pdf"

def test_password_reset_request():
    clear_test_database()
    user_data = create_test_user(
        username="resetuser", 
        password="oldpassword", 
        email="reset@example.com"
    )
    client.post("/register", json=user_data)
    
    response = client.post("/password-reset-request", json={
        "username": "resetuser",
        "email": "reset@example.com"
    })
    assert response.status_code == 200

def test_password_reset_confirm():
    clear_test_database()
    user_data = create_test_user(
        username="resetuser", 
        password="oldpassword", 
        email="reset@example.com"
    )
    client.post("/register", json=user_data)
    
    # First, request a reset token
    reset_response = client.post("/password-reset-request", json={
        "username": "resetuser",
        "email": "reset@example.com"
    })
    assert reset_response.status_code == 200
    
    # Then, confirm password reset
    reset_confirm_response = client.post("/password-reset-confirm", json={
        "username": "resetuser",
        "new_password": "newpassword123"
    })
    assert reset_confirm_response.status_code == 200
    assert reset_confirm_response.json()["status"] == "success"

def test_password_reset_short_password():
    clear_test_database()
    user_data = create_test_user(
        username="resetuser", 
        password="oldpassword", 
        email="reset@example.com"
    )
    client.post("/register", json=user_data)
    
    reset_response = client.post("/password-reset-request", json={
        "username": "resetuser",
        "email": "reset@example.com"
    })
    
    # Try to reset with a short password
    reset_confirm_response = client.post("/password-reset-confirm", json={
        "username": "resetuser",
        "new_password": "short"
    })
    assert reset_confirm_response.status_code == 400