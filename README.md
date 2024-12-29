# **FITLIFE- fitness tracking app by Ofir Cohen **

A robust system designed to manage fitness and nutrition tracking for users, with features like training program recommendations and calorie tracking.

---

## **Overview**

The project is a fullstack application built using **FastAPI**. It provides APIs to manage user data, track fitness progress, and recommend fitness programs dynamically by scraping external websites or based on predefined logic. The system also calculates personalized calorie recommendations.

To ensure smooth deployment and scalability, the backend is fully containerized using **Docker**.

---

## **Key Features**
- **User Management**: Create and manage user profiles.
- **Workout Tracking**: Log and retrieve workout data.
- **Nutrition Logs**: Track calorie intake through daily nutrition entries.
- **Weight Logs**: Record and monitor user weight over time.
- **Calorie Recommendation**: Calculate personalized daily calorie requirements and set user targets.
- **Training Program Scraping**: Dynamically scrape training programs from reliable external sources based on user goals.
- **RESTful API**: Interactive Swagger UI available at `/docs`.

---

## **Project Structure**

```
ofircohen-fitness-tracker/
├── backend/
│   ├── Dockerfile                       # Docker configuration for the backend
│   ├── config.yaml                      # Application configuration
│   ├── docker-compose.yml               # Docker Compose for container orchestration
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

### **Workouts**
- **`POST /workouts`**: Log a workout for a user.  
- **`GET /workouts/{user_id}`**: Retrieve all workouts for a specific user.

### **Nutrition Logs**
- **`POST /nutrition`**: Log a nutrition entry for a user.

### **Weight Logs**
- **`POST /weight`**: Log weight data for a user.  
- **`GET /weight/{user_id}`**: Retrieve weight logs for a specific user.

### **Utilities**
- **`GET /recommended-calories`**: Calculate recommended daily calorie intake and set a target for users.  
- **`GET /scrape-training-program`**: Dynamically scrape training programs based on user goals.

---

## **Technologies Used**

### **Backend**
- **Python 3.9+**: The core language for backend development.
- **FastAPI**: A modern and fast web framework for building APIs.
- **Pydantic**: For data validation and configuration management.
- **httpx**: For asynchronous HTTP requests.
- **BeautifulSoup**: For web scraping.
- **CORS Middleware**: To enable frontend-backend communication.

### **Containerization**
- **Docker**: Simplifies application deployment with containerization.
- **Docker Compose**: Orchestrates multi-container services.

---

## **How to Run the Project**

### **Prerequisites**
- Install **Docker** and **Docker Compose**.

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

---

## **Testing**

### **Pytest for Backend Tests**
The backend includes **unit tests** and **integration tests** written using **Pytest**. Here's how to run them:

#### **Unit Tests**
- The unit tests ensure the functionality of individual endpoints without external dependencies.
- Run the following command to execute unit tests:
  ```bash
  pytest app/unit_tests.py
  ```

#### **Integration Tests**
- The integration tests check the complete system functionality, including external dependencies like Docker.
- Run the following command to execute integration tests:
  ```bash
  pytest app/integration_test.py
  ```

### **Output**
- Look for the test results in the terminal. Ensure all tests pass successfully before deploying the system.

---

## **Future Work**

1. **Frontend Development:** Build a frontend application using React or Streamlit.
2. **Authentication:** Implement secure user authentication with JWT.
3. **Data Visualization:** Add charts and graphs for user progress tracking.
4. **Enhanced Scraping Logic:** Integrate error handling for changes in website structure.
5. **Mobile App Development:** Create a cross-platform mobile app using React Native or Flutter.

---

## **Contact**

If you have questions or suggestions, feel free to reach out:

- **Name**: Ofir Cohen  
- **Email**: ofircohen599@gmail.com  
- **GitHub**: [ofiz](https://github.com/ofiz)
