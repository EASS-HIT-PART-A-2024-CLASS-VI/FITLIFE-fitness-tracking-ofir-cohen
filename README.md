# **FitLife - Fitness Tracking App by Ofir Cohen**

A professional fitness and nutrition tracking system designed to help users monitor their progress, achieve their fitness goals, and maintain a healthy lifestyle. Featuring calorie tracking, personalized training recommendations, and persistent data storage.

---

## **Overview**

The **FitLife** application is a comprehensive full-stack backend system built using **FastAPI**. It offers a wide range of features, including user data management, fitness progress tracking, and training program recommendations, dynamically sourced from external websites. The system also provides personalized calorie recommendations based on user metrics and fitness goals.

To ensure scalability and maintainability, the backend is fully containerized with **Docker**.

---

## **Key Features**
- **Persistent User Management**: Create and manage user profiles with long-term data storage using SQLite.
- **Workout Tracking**: Log and retrieve detailed workout records for users.
- **Nutrition Logs**: Track daily calorie intake with nutrition logs.
- **Weight Logs**: Record and monitor weight data over time for better progress tracking.
- **Calorie Recommendation**: Calculate and recommend personalized daily calorie intake.
- **Training Program Scraping**: Dynamically scrape training programs from reliable external sources based on user goals.
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

### **Utilities**
- **`GET /recommended-calories`**: Calculate personalized daily calorie intake and set a target for users.  
- **`GET /scrape-training-program`**: Dynamically scrape training programs based on user goals.

---

## **Technologies Used**

### **Backend**
- **Python 3.9+**: Core backend development language.
- **FastAPI**: A modern web framework for building APIs quickly and efficiently.
- **Pydantic**: For data validation and configuration management.
- **SQLAlchemy**: ORM for managing database interactions.
- **SQLite**: Lightweight database for persistent data storage.
- **httpx**: For asynchronous HTTP requests.
- **BeautifulSoup**: For web scraping.

### **Containerization**
- **Docker**: Simplifies deployment with containerized environments.
- **Docker Compose**: Orchestrates multi-container services.

---

## **How to Run the Project**

### **Prerequisites**
- Install **Docker** and **Docker Compose**.
- Install **Python 3.9+** (if running locally without Docker).

### **Steps**
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

4. **Run the Application Locally (Optional):**
   ```bash
   uvicorn main:app --reload
   ```

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

1. **Frontend Development**:
   - Build an interactive user interface using React or Streamlit.
2. **User Authentication**:
   - Implement secure user authentication with JWT.
3. **Data Visualization**:
   - Add graphs and charts for fitness progress tracking.
4. **Enhanced Scraping**:
   - Add error handling for dynamic changes in website structures.
5. **Mobile App Development**:
   - Create a cross-platform mobile app using Flutter or React Native.

---

## **Contact**

For questions, suggestions, or feedback, please reach out:

- **Name**: Ofir Cohen  
- **Email**: ofircohen599@gmail.com  
- **GitHub**: [ofiz](https://github.com/ofiz)
