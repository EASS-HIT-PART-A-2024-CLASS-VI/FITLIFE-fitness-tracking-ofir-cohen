import subprocess
import time
import requests

def test_integration():
    # Start the application using Docker Compose
    subprocess.run(["docker-compose", "up", "-d"])
    time.sleep(10)  # Increase wait time for containers to start

    try:
        # Test the root endpoint
        response = requests.get("http://127.0.0.1:8000/")
        assert response.status_code == 200
        print("Root endpoint is working!")

        # Test the list of training programs
        response = requests.get("http://127.0.0.1:8000/training-programs")
        assert response.status_code == 200
        assert "available_programs" in response.json()

        # Test downloading a specific training program
        response = requests.get("http://127.0.0.1:8000/training-programs/muscle_building")
        assert response.status_code == 200
        assert response.headers["content-type"] == "application/pdf"

    finally:
        # Clean up
        subprocess.run(["docker-compose", "down"])
        print("Integration test executed successfully.")
