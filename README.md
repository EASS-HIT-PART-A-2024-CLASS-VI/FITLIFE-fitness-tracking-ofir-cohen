<<<<<<< HEAD
# **ofircohen-fitness-tracker**

A robust  system designed to manage fitness and nutrition tracking for users, providing RESTful APIs for managing workouts, nutrition logs, weight logs, and fitness goals. This backend includes features like personalized calorie recommendations and training program suggestions, making it a solid foundation for future extensions.

---

## **Overview**

The **project** is a  system built using **FastAPI**. It provides APIs to manage user data, track fitness progress, and recommend fitness programs based on user-defined goals. The system also includes calorie recommendations calculated using the **Mifflin-St Jeor Equation**.

To simplify deployment and scalability, the backend is fully containerized using **Docker**.

---

## **Key Features**
- **User Management**: Create and manage user profiles.
- **Workout Tracking**: Log and retrieve workout data.
- **Nutrition Logs**: Track calorie intake through daily nutrition entries.
- **Weight Logs**: Record and monitor user weight over time.
- **Fitness Goals**: Define user goals and receive recommended training programs.
- **Calorie Recommendation**: Calculate personalized daily calorie requirements based on user data.
- **RESTful API**: Swagger UI available at `/docs`.

---
=======
**ofircohen-fitness-tracker**
A backend system for fitness and nutrition tracking.

Overview
The ofircohen-fitness-tracker project is a backend system designed to support fitness and nutrition tracking for users. Built using FastAPI, it provides robust RESTful APIs for managing workouts, nutrition logs, weight logs, and user goals. The backend also includes functionality to calculate personalized daily calorie recommendations based on user input. The entire backend is containerized using Docker for ease of deployment and scalability.

This backend serves as the foundation for a potential full-stack application, with plans to integrate a frontend and additional features in future development.

Table of Contents
Technologies Used
Project Features
Project Structure
Endpoints (Backend)
How to Run the Project
Future Work
Contact Info
Technologies Used
Backend:
Python 3.9+ – Backend development.
FastAPI – A modern, fast web framework for building APIs.
Pydantic – For data validation and settings management.
httpx – For making asynchronous HTTP requests.
CORS Middleware – To allow frontend-backend communication.
Containerization:
Docker – Fully containerized backend for simplified deployment.
Docker Compose – Orchestrates the backend service.
Project Features
Backend:
RESTful APIs for managing:
Users (basic profile details like age, weight, height, etc.).
Workouts (e.g., exercise type and duration).
Nutrition logs (e.g., food items and calorie count).
Weight logs (e.g., weight tracking over time).
Goals (e.g., fitness goals with recommended training programs).
Dynamic calculation of personalized calorie recommendations using the Mifflin-St Jeor Equation.
Project Structure
Backend
graphql
Copy code
ofircohen-fitness-tracker\
├── backend\
│   ├── __pycache__\                     # Compiled Python files for caching
│   ├── app\
│   │   ├── __pycache__\                 # Cached unit test files
│   │   ├── integration_test.py          # Integration test file
│   │   ├── integration_test.py.save     # Backup of integration test file
│   │   ├── unit_tests.py                # Unit test file
│   ├── Dockerfile                       # Backend container configuration
│   ├── config.yaml                      # Application configuration
│   ├── docker-compose.yml               # Multi-container management
│   ├── main.py                          # FastAPI backend with endpoints
│   ├── requirements.txt                 # Python dependencies
└── README.md                            # Project documentation
Endpoints (Backend)
1. General
GET /
Description: Root endpoint that returns a welcome message.
2. Users
POST /users
Description: Create a new user with personal details.
3. Workouts
POST /workouts
Description: Add a workout entry for a user.
GET /workouts/{user_id}
Description: Retrieve all workouts for a specific user.
4. Nutrition Logs
POST /nutrition
Description: Add a nutrition log entry for a user.
5. Weight Logs
POST /weight
Description: Add a weight log entry for a user.
GET /weight/{user_id}
Description: Retrieve all weight logs for a specific user.
6. Goals
POST /goals
Description: Add a fitness goal for a user and recommend a training program.
7. Utilities
GET /recommended-calories
Description: Calculate recommended daily calorie intake based on user data.
GET /training-program
Description: Recommend a training program based on a fitness goal.
How to Run the Project
Prerequisites
Install Docker and Docker Compose.
Steps
Clone the Repository:

bash
Copy code
git clone https://github.com/your-repo-link.git
cd ofircohen-fitness-tracker
Build and Run Containers:

bash
Copy code
docker compose up --build
The backend will be available at: http://127.0.0.1:8000
API documentation (Swagger UI) is available at: http://127.0.0.1:8000/docs
Test the Backend:

Use the Swagger UI to interact with the API.
Test endpoints like /recommended-calories and /training-program.
Future Work
Frontend Development:
Build a frontend using React or Streamlit to interact with the backend.
Integration with External APIs:
Incorporate calorie and food database APIs for richer features.
Authentication and Authorization:
Add user authentication (e.g., JWT tokens) for secure access.
Analytics and Visualization:
Provide users with visual insights into their progress and goals.
Mobile App:
Develop a mobile app using React Native or Flutter for cross-platform accessibility.
Contact Info
For any questions or suggestions, please contact:
Ofir Cohen
Email: your_email@example.com
GitHub: Your GitHub Profile
>>>>>>> 41b28b5407fd48d7cb1147ad7bf549fc19817ced

## **Project Structure**

ofircohen-fitness-tracker/ ├── backend/ │ ├── pycache/ # Python cached files │ ├── app/ │ │ ├── pycache/ # Cached files for tests │ │ ├── integration_test.py # Integration test file │ │ ├── integration_test.py.save # Backup of integration test │ │ ├── unit_tests.py # Unit test file │ ├── Dockerfile # Docker configuration for the backend │ ├── config.yaml # Application configuration │ ├── docker-compose.yml # Docker Compose for container orchestration │ ├── main.py # FastAPI backend with endpoints │ ├── requirements.txt # Python dependencies └── README.md # Project documentation



---

## **Endpoints**

### **General**
- **`GET /`**: Returns a welcome message.

### **Users**
- **`POST /users`**: Create a new user profile.

### **Workouts**
- **`POST /workouts`**: Log a workout for a user.  
- **`GET /workouts/{user_id}`**: Retrieve all workouts for a specific user.

### **Nutrition Logs**
- **`POST /nutrition`**: Log a nutrition entry for a user.

### **Weight Logs**
- **`POST /weight`**: Log weight data for a user.  
- **`GET /weight/{user_id}`**: Retrieve weight logs for a specific user.

### **Goals**
- **`POST /goals`**: Add a fitness goal for a user and get recommended training programs.

### **Utilities**
- **`GET /recommended-calories`**: Calculate recommended daily calorie intake.  
- **`GET /training-program`**: Recommend a training program based on user goals.

---

## **Technologies Used**

### **Backend**
- **Python 3.9+**: The core language for backend development.
- **FastAPI**: A modern and fast web framework for building APIs.
- **Pydantic**: For data validation and configuration management.
- **httpx**: For asynchronous HTTP requests.
- **CORS Middleware**: To enable frontend-backend communication.

### **Containerization**
- **Docker**: Simplifies application deployment with containerization.
- **Docker Compose**: Orchestrates multi-container services.

---

## **How to Run the Project**

### **Prerequisites**
- Install **Docker** and **Docker Compose**.

### **Steps**
1. Clone the repository:
   
   git clone https://github.com/your-repo-link.git
   cd ofircohen-fitness-tracker

Build and start the containers:

docker-compose up --build
Access the backend:
API Base URL: http://127.0.0.1:8000
Swagger UI: http://127.0.0.1:8000/docs

**Future Work**
Frontend Development: Build a frontend application using React or Streamlit.
Authentication: Implement secure user authentication with JWT.
Data Visualization: Add charts and graphs for user progress tracking.
Integration with APIs: Use external APIs for richer features like food databases.
Mobile App: Develop a cross-platform app using React Native or Flutter.

**Contact**
If you have questions or suggestions, feel free to reach out:

Name: Ofir Cohen
Email: your_email@example.com
GitHub: Your GitHub Profile """