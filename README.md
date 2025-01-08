# **FitLife - Fitness Tracking App by Ofir Cohen**

A professional fitness and nutrition tracking system designed to help users monitor their progress, achieve their fitness goals, and maintain a healthy lifestyle. Featuring calorie tracking, personalized training recommendations, and persistent data storage.

---

## **Overview**

The **FitLife** application is a comprehensive full-stack application built using **FastAPI** for the backend and **React** for the frontend. It offers a wide range of features, including user data management, fitness progress tracking, training program recommendations, and visualizations. The system provides personalized calorie recommendations based on user metrics and fitness goals.

To ensure scalability and maintainability, the backend is fully containerized with **Docker**, while the frontend is developed with modern **React** components and features.

---

## **Key Features**
- **Persistent User Management**: Create and manage user profiles with long-term data storage using SQLite.
- **Workout Tracking**: Log and retrieve detailed workout records for users.
- **Nutrition Logs**: Track daily calorie intake with nutrition logs.
- **Weight Logs**: Record and monitor weight data over time for better progress tracking.
- **Calorie Recommendation**: Calculate and recommend personalized daily calorie intake.
- **Downloadable Training Programs**: Allow users to download specific training plans based on their fitness goals (e.g., muscle building, weight loss, general fitness, or home workouts).
- **Interactive Frontend**: User-friendly React interface for visualizing data and interacting with the application.
- **RESTful API**: Interactive API documentation with Swagger UI available at `/docs`.

---

## **Project Structure**

```
ofircohen-fitness-tracker/
├── backend/
│   ├── Dockerfile                       # Docker configuration for the backend
│   ├── config.yaml                      # Application configuration
│   ├── docker-compose.yml               # Docker Compose for container orchestration
│   ├── fitness_tracker.db               # SQLite database for persistent storage
│   ├── main.py                          # FastAPI backend with endpoints
│   ├── requirements.txt                 # Python dependencies
│   ├── app/
│   │   ├── unit_tests.py                # Pytest unit tests
│   │   ├── integration_test.py          # Pytest integration tests
├── frontend/
│   ├── public/
│   │   ├── index.html                   # HTML entry point
│   ├── src/
│   │   ├── components/                  # React components
│   │   ├── App.js                       # Main application logic
│   │   ├── App.css                      # Application styles
│   │   ├── index.js                     # React entry point
└── README.md                            # Project documentation
```

---

## **Endpoints**

### **General**
- **`GET /`**: Returns a welcome message.

### **Users**
- **`POST /users`**: Create a new user profile.
- **`GET /users/{user_id}`**: Retrieve user details by ID.

### **Workouts**
- **`POST /workouts`**: Log a workout for a user.  
- **`GET /workouts/{user_id}`**: Retrieve all workouts for a specific user.

### **Nutrition Logs**
- **`POST /nutrition`**: Log a nutrition entry for a user.
- **`GET /nutrition/{user_id}`**: Retrieve all nutrition logs for a specific user.

### **Weight Logs**
- **`POST /weight`**: Log weight data for a user.  
- **`GET /weight/{user_id}`**: Retrieve weight logs for a specific user.

### **Training Programs**
- **`GET /training-programs`**: Get a list of available training programs.
- **`GET /training-programs/{goal}`**: Download a specific training program based on the user's goal (e.g., muscle building, weight loss).

---

## **Technologies Used**

### **Backend**
- **Python 3.9+**: Core backend development language.
- **FastAPI**: A modern web framework for building APIs quickly and efficiently.
- **Pydantic**: For data validation and configuration management.
- **SQLAlchemy**: ORM for managing database interactions.
- **SQLite**: Lightweight database for persistent data storage.

### **Frontend**
- **React**: A JavaScript library for building user interfaces.
- **Axios**: For interacting with the backend API.
- **Chart.js**: For creating fitness progress visualizations.
- **React Router**: For navigation and routing.

### **Containerization**
- **Docker**: Simplifies deployment with containerized environments.
- **Docker Compose**: Orchestrates multi-container services.

---

## **How to Run the Project**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo-link.git
   cd ofircohen-fitness-tracker
   ```

2. **Build and start the containers:**
   ```bash
   docker-compose up --build
   ```

3. **Access the backend:**
   - **API Base URL:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
   - **Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

4. **Access the frontend:**
   - **Frontend URL:** [http://localhost:3000](http://localhost:3000)

---

## **Testing**

### **Unit Tests**
- Test individual endpoints and internal logic without external dependencies:
  ```bash
  pytest app/unit_tests.py
  ```

### **Integration Tests**
- Test the system as a whole, including interactions with external services:
  ```bash
  pytest app/integration_test.py
  ```

---

## **Future Work**

1. **Frontend Enhancements**:
   - Add more interactive components for an improved user experience.
   - Include dark mode toggle and accessibility features.
2. **User Authentication**:
   - Implement secure user authentication with JWT.
3. **Data Visualization**:
   - Expand charts and visualizations to include trends and insights.

---

## **Contact**

For questions, suggestions, or feedback, please reach out:

- **Name**: Ofir Cohen  
- **Email**: ofircohen599@gmail.com  
- **GitHub**: [ofiz](https://github.com/ofiz)
