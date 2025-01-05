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
    finally:
        # Clean up
        subprocess.run(["docker-compose", "down"])
        print("Integration test executed successfully.")
