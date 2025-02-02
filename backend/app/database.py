from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base  # Ensure this uses 'app.models'

DATABASE_URL = "sqlite:///./fitness_tracker.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Initialize the database
Base.metadata.create_all(bind=engine)

# Dependency for database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
