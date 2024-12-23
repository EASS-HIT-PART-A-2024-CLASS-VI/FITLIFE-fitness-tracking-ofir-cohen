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