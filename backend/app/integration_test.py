import subprocess
import time
import requests

def test_integration():
    print("Starting Docker containers...")
    subprocess.run(["docker-compose", "up", "-d"], check=True)
    time.sleep(15)  # Wait for containers to fully start

    try:
        base_url = "http://127.0.0.1:8000"

        # Test root endpoint
        response = requests.get(f"{base_url}/")
        assert response.status_code == 200
        assert "message" in response.json()
        print("Root endpoint is working!")

        # Test user registration
        user_data = {
            "username": "johndoe",
            "password": "securepassword",
            "name": "John Doe",
            "age": 30,
            "gender": "Male",
            "height": 180.0,
            "weight": 75.0
        }
        response = requests.post(f"{base_url}/register", json=user_data)
        assert response.status_code == 200
        assert response.json()["message"] == "User registered successfully"
        print("User registration is working!")

        # Test user login
        login_data = {
            "username": "johndoe",
            "password": "securepassword"
        }
        response = requests.post(f"{base_url}/login", data=login_data)
        assert response.status_code == 200
        access_token = response.json()["access_token"]
        print("User login is working!")

        # Test fetching user details
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(f"{base_url}/me", headers=headers)
        assert response.status_code == 200
        assert response.json()["username"] == "johndoe"
        print("User details endpoint is working!")

    finally:
        print("Stopping Docker containers...")
        subprocess.run(["docker-compose", "down"], check=True)
        print("Integration test completed.")
