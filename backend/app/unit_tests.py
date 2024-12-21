from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_create_user():
    user_data = {
        "name": "John Doe",
        "age": 30,
        "gender": "Male",
        "height": 180.0,
        "weight": 75.5
    }
    response = client.post("/users?user_id=1", json=user_data)
    assert response.status_code == 200
    assert response.json()["user"]["name"] == "John Doe"

def test_add_workout():
    workout_data = {"user_id": 1, "exercise": "Running", "duration": 30}
    response = client.post("/workouts", json=workout_data)
    assert response.status_code == 200
    assert response.json()["message"] == "Workout added successfully"

def test_get_workouts():
    response = client.get("/workouts/1")
    assert response.status_code == 200
    assert "workouts" in response.json()

def test_add_nutrition_log():
    nutrition_data = {"user_id": 1, "food": "Chicken Salad", "calories": 400}
    response = client.post("/nutrition", json=nutrition_data)
    assert response.status_code == 200
    assert response.json()["message"] == "Nutrition log added successfully"

