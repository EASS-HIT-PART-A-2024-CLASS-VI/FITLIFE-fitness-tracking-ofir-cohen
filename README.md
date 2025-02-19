# 💪 FitLife - Fitness Tracking App

<div align="center">
 <img src="https://github.com/user-attachments/assets/a1b01939-021f-4df6-851a-221fb8026d9c" alt="logo" style="width: 150px;">

 A comprehensive fitness and nutrition tracking system to help users achieve their health goals.

 [![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
 [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
 [![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
 [![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
</div>

The **FitLife** application is a full-stack fitness tracking platform built with FastAPI and React. It offers personalized workout tracking, nutrition logging, weight monitoring, and AI-powered fitness advice. The backend is containerized with Docker for easy deployment, while the frontend provides an intuitive interface for visualizing fitness progress.

---

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with password hashing
- **Workout Tracking**: Log and visualize exercise routines with duration tracking
- **Nutrition Logs**: Track daily food intake with calorie counting and visual charts
- **Weight Monitoring**: Record weight changes over time with interactive graphs
- **Personalized Calorie Recommendations**: Get customized calorie targets based on physical attributes
- **Downloadable Training Programs**: Access specialized workout plans (muscle building, weight loss, etc.)
- **AI Fitness Bot**: Get answers to fitness and nutrition questions powered by LLM technology

---

## 🗂️ Project Architecture

<div align="center">
  <img src="frontend/src/assets/architecture_diagram.svg" alt="Architecture Diagram" width="300%" style="max-width: 900px;">
</div>

```

fitlife-app/
├── backend/               # FastAPI backend services
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Core functionality
│   │   ├── models.py      # Database models
│   │   └── database.py    # Database connection
│   ├── LLM_CHATBOT/       # Fitness Bot microservice
│   ├── files/             # Training program PDFs
│   └── Dockerfile
├── frontend/              # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── assets/        # Images and static files
│   │   └── App.js         # Main application
│   └── Dockerfile
└── docker-compose.yml     # Container orchestration

```

---

## 🛠️ Setting Up the Project

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/EASS-HIT-PART-A-2024-CLASS-VI/FITLIFE-fitness-tracking-ofir-cohen.git
cd FITLIFE-fitness-tracking-ofir-cohen
```

## 2️⃣ Environment Configuration
For the LLM Chatbot functionality, you'll need to configure environment variables:

1. Create a `.env.example` file in the `backend/LLM_CHATBOT/` directory with:

```
VARIABLE_1=your_value_here
VARIABLE_2=your_value_here
```


Copy the example file and replace with actual values:

  ```bash

cp backend/LLM_CHATBOT/.env.example backend/LLM_CHATBOT/.env
   ```

Update the values in your .env file:

```
VARIABLE_1=actual_value
VARIABLE_2=actual_value
```

### 3️⃣ Start the Application
  ```bash


docker-compose up --build
```


## 📚 Backend API

### 🔐 Authentication
- **POST /register**: Register a new user
- **POST /login**: Authenticate and receive JWT
- **GET /me**: Get current user details

### 💪 Workouts
- **POST /workouts**: Log a workout
- **GET /workouts/{user_id}**: Retrieve workouts by date

### 🥗 Nutrition
- **POST /nutrition**: Add food and calories
- **GET /nutrition/{user_id}**: Get nutrition history

### ⚖️ Weight
- **POST /weight**: Log weight measurement
- **GET /weight/{user_id}**: Retrieve weight history

### 📊 Recommendations
- **GET /recommended-calories**: Get personalized calorie targets

### 📑 Training Programs
- **GET /training-programs**: List available programs
- **GET /training-programs/{goal}**: Download specific program PDF

### 🤖 Fitness Bot
- **POST /chatbot**: Ask fitness and nutrition questions

## 🖥️ Frontend

The React frontend provides an intuitive interface for accessing all FitLife features:

### **Login/Registration**
Secure user authentication with JWT tokens and password protection

### **Dashboard**
Overview of fitness metrics with progress summaries and activity stats

### **Workout Tracker**
Log and visualize exercise routines with duration tracking and history views

### **Nutrition Tracker**
Food logging with calorie visualization and nutritional breakdown charts

### **Weight Tracker**
Weight progress charts with time filtering (7/30/90 days and custom ranges)

### **Calorie Recommendations**
Personalized calorie targets based on height, weight, activity level and goals

### **Training Programs**
Download specialized workout plans for different fitness objectives

### **Fitness Bot**
AI-powered fitness assistant for nutrition and exercise guidance

## 🧪 Testing

### **Backend Tests**
#### Unit Tests
- Test individual endpoints and internal logic without external dependencies:
  ```bash
  pytest app/unit_tests.py
  ```

#### Integration Tests
- Test the system as a whole, including interactions with external services:
  ```bash
  pytest app/integration_test.py
  ```
# Frontend tests
  ```bash
   cd frontend
   npm test
  ```


## 🔧 Technologies Used

### **Backend**
- **FastAPI:** Modern, high-performance web framework
- **SQLite:** Lightweight database for data persistence
- **SQLAlchemy:** SQL toolkit and ORM
- **Pydantic:** Data validation and settings management
- **JWT:** Secure authentication
- **Docker:** Containerization for deployment

### **Frontend**  
- **React:** JavaScript library for building user interfaces
- **Chart.js:** Interactive data visualization
- **Axios:** HTTP client for API requests
- **Bootstrap:** Responsive UI components

---

## 👨‍💻 Author

- **Name:** Ofir Cohen  
- **Email:** ofircohen599@gmail.com
- **GitHub:** [ofiz](https://github.com/ofiz)
