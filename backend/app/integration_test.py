import subprocess
import time
import requests
import pytest
import json
import sys
import traceback
import uuid

class HTTPException(Exception):
    pass

def generate_unique_username():
    """Generate a unique username using UUID"""
    return f"integration_user_{uuid.uuid4().hex[:8]}"

def test_integration():
    print("Starting Docker containers...")
    try:
        subprocess.run(["docker-compose", "up", "-d"], check=True)
        time.sleep(15)  # Wait for containers to fully start
    except Exception as e:
        print(f"Error starting Docker containers: {e}")
        traceback.print_exc()
        pytest.fail(f"Failed to start Docker containers: {e}")

    try:
        base_url = "http://127.0.0.1:8000"
        chatbot_url = "http://127.0.0.1:8001"

        # Generate a unique username for this test run
        unique_username = generate_unique_username()
        unique_email = f"{unique_username}@example.com"

        # Test Root Endpoint
        response = requests.get(f"{base_url}/", timeout=10)
        response.raise_for_status()
        assert "message" in response.json(), "No message in root endpoint response"
        print("Root endpoint is working!")

        # Test User Registration and Authentication Flow
        register_data = {
            "username": unique_username,
            "password": "testpassword123",
            "name": "Integration Test User",
            "age": 30,
            "gender": "Male",
            "height": 180.0,
            "weight": 75.0,
            "email": unique_email
        }
        
        # Detailed debug logging
        print("Registration Request Data:")
        print(json.dumps(register_data, indent=2))
        
        try:
            register_response = requests.post(f"{base_url}/register", json=register_data, timeout=10)
            
            # Comprehensive error handling
            if register_response.status_code != 200:
                print("Registration Failed:")
                print("Status Code:", register_response.status_code)
                print("Response Headers:", register_response.headers)
                print("Response Content:", register_response.text)
                
                # Try to parse and print the error details
                try:
                    error_details = register_response.json()
                    print("Parsed Error Details:", json.dumps(error_details, indent=2))
                except ValueError:
                    print("Could not parse error response as JSON")
                
                # Raise an exception with detailed error information
                raise HTTPException(
                    f"Registration failed with status {register_response.status_code}: {register_response.text}"
                )
            
            register_response.raise_for_status()
            register_data_response = register_response.json()
            
            print("Registration successful!")
            print("Registered user data:", register_data_response)
            
            # Verify registration response structure
            assert "message" in register_data_response
            assert "user" in register_data_response
            assert register_data_response["message"] == "User registered successfully"
        
        except requests.exceptions.HTTPError as e:
            print(f"HTTP Error during registration: {e}")
            print("Response content:", e.response.text)
            traceback.print_exc()
            pytest.fail(f"User registration failed: {e}")
        except Exception as e:
            print(f"Unexpected error during registration: {e}")
            traceback.print_exc()
            pytest.fail(f"User registration failed: {e}")

        # Test Login
        login_response = requests.post(
            f"{base_url}/login", 
            data={
                "username": unique_username, 
                "password": "testpassword123"
            },
            timeout=10
        )
        login_response.raise_for_status()
        login_data = login_response.json()
        assert "access_token" in login_data, "Access token not received"
        print("Login successful!")

        # Test Password Reset Flow
        reset_request_response = requests.post(
            f"{base_url}/password-reset-request", 
            json={
                "username": unique_username,
                "email": unique_email
            },
            timeout=10
        )
        reset_request_response.raise_for_status()
        print(f"Password reset request response: {reset_request_response.status_code}")

        # Password Reset Confirmation
        reset_confirm_response = requests.post(
            f"{base_url}/password-reset-confirm", 
            json={
                "username": unique_username,
                "new_password": "newpassword456"
            },
            timeout=10
        )
        reset_confirm_response.raise_for_status()
        reset_confirm_data = reset_confirm_response.json()
        assert reset_confirm_data.get("status") == "success", "Password reset status incorrect"
        print("Password reset confirmation successful!")

        # Verify New Password
        new_login_response = requests.post(
            f"{base_url}/login", 
            data={
                "username": unique_username, 
                "password": "newpassword456"
            },
            timeout=10
        )
        new_login_response.raise_for_status()
        print("Login with new password successful!")

        print("Full integration test completed successfully!")

    except Exception as e:
        print(f"Unexpected error during integration test: {e}")
        traceback.print_exc()
        pytest.fail(f"Integration test failed: {e}")
    finally:
        try:
            print("Stopping Docker containers...")
            subprocess.run(["docker-compose", "down"], check=True)
            print("Docker containers stopped.")
        except Exception as e:
            print(f"Error stopping Docker containers: {e}")
            traceback.print_exc()

if __name__ == "__main__":
    pytest.main([__file__])