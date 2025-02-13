import subprocess
import time
import requests
import pytest
import json

def test_integration():
    print("Starting Docker containers...")
    subprocess.run(["docker-compose", "up", "-d"], check=True)
    time.sleep(15)  # Wait for containers to fully start

    try:
        base_url = "http://127.0.0.1:8000"
        chatbot_url = "http://127.0.0.1:8001"

        # Test root endpoint
        response = requests.get(f"{base_url}/")
        assert response.status_code == 200
        assert "message" in response.json()
        print("Root endpoint is working!")

        # Test LLM chatbot endpoint with debug logging
        print("Testing LLM chatbot...")
        test_question = {"question": "What are some good protein sources?"}
        print(f"Sending request to: {chatbot_url}/chatbot/llm_chatbot")
        print(f"Request payload: {json.dumps(test_question, indent=2)}")
        
        chatbot_response = requests.post(
            f"{chatbot_url}/chatbot/llm_chatbot",
            json=test_question
        )
        
        print(f"Response status code: {chatbot_response.status_code}")
        print(f"Response headers: {dict(chatbot_response.headers)}")
        print(f"Response body: {chatbot_response.text}")
        
        assert chatbot_response.status_code == 200, f"Chatbot failed with status {chatbot_response.status_code}: {chatbot_response.text}"
        response_data = chatbot_response.json()
        assert "response" in response_data, f"Unexpected response format: {response_data}"
        print("LLM chatbot is working!")

        # Rest of your tests...
        # [Previous test code remains the same]

    except Exception as e:
        print(f"Test failed with error: {str(e)}")
        raise
    finally:
        print("Stopping Docker containers...")
        subprocess.run(["docker-compose", "down"], check=True)
        print("Integration test completed.")

if __name__ == "__main__":
    pytest.main([__file__])