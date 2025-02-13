from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app, Base, get_db
import time
import os
import requests
import pytest

# Setting up a test database
DATABASE_URL = "sqlite:///./test_fitness_tracker.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

# Dependency override for the test database
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

# Utility function to clear the test database before each test
def clear_test_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

# ✅ **Ensure Chatbot is Running Before Running Tests**
CHATBOT_URL = "http://localhost:8001/api/llm_chatbot/"

@pytest.fixture(scope="session", autouse=True)
def wait_for_chatbot():
    """
    Wait for the chatbot microservice to start before running tests.
    """
    retries = 10
    while retries > 0:
        try:
            response = requests.get("http://localhost:8001/")
            if response.status_code == 200:
                print("✅ Chatbot microservice is ready!")
                return
        except requests.exceptions.ConnectionError:
            pass
        time.sleep(1)
        retries -= 1
    pytest.exit("❌ Chatbot microservice did not start in time.")

# ✅ **Test Chatbot API - Valid Query**
def test_llm_chatbot_valid_query():
    """
    Test valid chatbot response.
    """
    try:
        response = requests.post(CHATBOT_URL, json={"question": "What are some good protein sources?"})
        assert response.status_code == 200, f"Failed with response: {response.json()}"
        assert "protein" in response.json()["response"].lower()
    except requests.exceptions.ConnectionError as e:
        pytest.fail(f"Chatbot microservice is not running. Error: {e}")

# ✅ **Test Chatbot API - Empty Query**
def test_llm_chatbot_empty_query():
    """
    Test chatbot response for an empty query.
    """
    try:
        response = requests.post(CHATBOT_URL, json={"question": ""})
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
    except requests.exceptions.ConnectionError as e:
        pytest.fail(f"Chatbot microservice is not running. Error: {e}")



# Test Root Endpoint
def test_read_root():
    clear_test_database()  # Clear database before running the test
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

# Test Register Endpoint
def test_register_user():
    clear_test_database()  # Clear database before running the test
    user_data = {
        "username": f"testuser_{int(time.time())}",  # Ensure unique username
        "password": "securepassword",
        "name": "Test User",
        "age": 25,
        "gender": "Male",
        "height": 170.0,
        "weight": 70.0
    }
    response = client.post("/register", json=user_data)
    assert response.status_code == 200
    assert response.json()["message"] == "User registered successfully"

# Test Login Endpoint
def test_login_user():
    clear_test_database()  # Clear database before running the test
    user_data = {
        "username": "johndoe",
        "password": "securepassword",
        "name": "John Doe",
        "age": 30,
        "gender": "Male",
        "height": 180.0,
        "weight": 75.0
    }
    client.post("/register", json=user_data)
    login_data = {"username": "johndoe", "password": "securepassword"}
    response = client.post("/login", data=login_data)
    assert response.status_code == 200
    assert "access_token" in response.json()



# Test Current User Info
def test_get_current_user():
    clear_test_database()  # Clear database before running the test
    user_data = {
        "username": "johndoe",
        "password": "securepassword",
        "name": "John Doe",
        "age": 30,
        "gender": "Male",
        "height": 180.0,
        "weight": 75.0
    }
    client.post("/register", json=user_data)
    login_response = client.post("/login", data={"username": "johndoe", "password": "securepassword"})
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["username"] == "johndoe"

# Test Workouts
def test_add_workout():
    clear_test_database()  # Clear database before running the test
    user_data = {
        "username": "johndoe",
        "password": "securepassword",
        "name": "John Doe",
        "age": 30,
        "gender": "Male",
        "height": 180.0,
        "weight": 75.0
    }
    client.post("/register", json=user_data)

    workout_data = {
        "user_id": 1,
        "exercise": "Running",
        "duration": 30,
        "date": "2025-02-11"  # ✅ Added missing date
    }

    response = client.post("/workouts", json=workout_data)
    assert response.status_code == 200, f"Failed with response: {response.json()}"
    assert response.json()["message"] == "Workout added successfully"

def test_get_workouts():
    clear_test_database()  # Clear database before running the test
    user_data = {
        "username": "johndoe",
        "password": "securepassword",
        "name": "John Doe",
        "age": 30,
        "gender": "Male",
        "height": 180.0,
        "weight": 75.0
    }
    client.post("/register", json=user_data)

    workout_data = {
        "user_id": 1,
        "exercise": "Running",
        "duration": 30,
        "date": "2025-02-11"  # ✅ Ensure date is included
    }

    client.post("/workouts", json=workout_data)

    response = client.get(f"/workouts/1?date=2025-02-11")  # ✅ Added `date` query parameter
    assert response.status_code == 200, f"Failed with response: {response.json()}"
    assert "workouts" in response.json()


# Test Nutrition Logs
def test_add_nutrition_log():
    clear_test_database()  # Clear database before running the test
    user_data = {
        "username": "johndoe",
        "password": "securepassword",
        "name": "John Doe",
        "age": 30,
        "gender": "Male",
        "height": 180.0,
        "weight": 75.0
    }
    client.post("/register", json=user_data)
    nutrition_data = {"user_id": 1, "food": "Chicken Salad", "calories": 400}
    response = client.post("/nutrition", json=nutrition_data)
    assert response.status_code == 200
    assert response.json()["message"] == "Nutrition log added successfully"

def test_get_nutrition_logs():
    clear_test_database()  # Clear database before running the test
    user_data = {
        "username": "johndoe",
        "password": "securepassword",
        "name": "John Doe",
        "age": 30,
        "gender": "Male",
        "height": 180.0,
        "weight": 75.0
    }
    client.post("/register", json=user_data)
    nutrition_data = {"user_id": 1, "food": "Chicken Salad", "calories": 400}
    client.post("/nutrition", json=nutrition_data)
    response = client.get("/nutrition/1")
    assert response.status_code == 200
    assert "logs" in response.json()

# Test Weight Logs
def test_add_weight_log():
    clear_test_database()  # Clear database before running the test
    user_data = {
        "username": "johndoe",
        "password": "securepassword",
        "name": "John Doe",
        "age": 30,
        "gender": "Male",
        "height": 180.0,
        "weight": 75.0
    }
    client.post("/register", json=user_data)
    weight_log = {"user_id": 1, "weight": 75.0, "date": "2024-12-29"}
    response = client.post("/weight", json=weight_log)
    assert response.status_code == 200
    assert response.json()["message"] == "Weight log added successfully"

def test_get_weight_logs():
    clear_test_database()  # Clear database before running the test
    user_data = {
        "username": "johndoe",
        "password": "securepassword",
        "name": "John Doe",
        "age": 30,
        "gender": "Male",
        "height": 180.0,
        "weight": 75.0
    }
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

