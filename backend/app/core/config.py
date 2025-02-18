import yaml
import os

# Configuration class for the application
class Config:
    # Default configuration values
    APP_TITLE = "Fitness and Nutrition Tracking API"
    APP_DESCRIPTION = "A FastAPI backend application for tracking users, workouts, nutrition logs, weight logs, goals, and training programs."
    APP_VERSION = "1.0.0"
    
    # Database configuration
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./fitness_tracker.db")
    
    # Security settings
    SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    
    # CORS settings
    CORS_ORIGINS = [
        "http://localhost:3000",  # React frontend
        "http://127.0.0.1:3000"   # Alternative local frontend address
    ]
    
    # PDF file paths
    PDF_PATHS = {
        "muscle_building": "files/muscle_building.pdf",
        "weight_loss": "files/weight_loss.pdf",
        "general_fitness": "files/general_fitness.pdf",
        "home_workout": "files/home_workout.pdf"
    }
    
    def __init__(self):
        # Load configuration from YAML file
        try:
            with open("config.yaml", "r") as file:
                yaml_config = yaml.safe_load(file)
                if yaml_config:
                    # Update class attributes with values from config file
                    for key, value in yaml_config.items():
                        if hasattr(self, key.upper()):
                            setattr(self, key.upper(), value)
        except FileNotFoundError:
            # If config file not found, use default welcome message
            pass

# Create a config instance
config = Config()