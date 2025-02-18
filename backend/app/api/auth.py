from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from app.database import get_db
from app.models import UserDB, PasswordResetToken

# Constants from main.py
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Models for auth
class User(BaseModel):
    username: str
    password: str
    name: str
    age: int
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    email: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class PasswordResetRequest(BaseModel):
    username: str
    email: Optional[str] = None

class PasswordResetConfirm(BaseModel):
    username: str
    new_password: str

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# Utility functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Verify password using bcrypt
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def get_password_hash(password: str) -> str:
    # Hash password using bcrypt
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = db.query(UserDB).filter(UserDB.username == username).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def add_email_column(db: Session):
    try:
        # Use a more robust method to add column only if it doesn't exist
        from sqlalchemy import text
        db.execute(text('''
            ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
        '''))
        db.commit()
    except Exception as e:
        print(f"Error adding email column: {e}")
        db.rollback()

# Create router
router = APIRouter(tags=["Authentication"])

# Authentication Endpoints
@router.post("/register", summary="Register User")
def register_user(user: User, db: Session = Depends(get_db)):
    # First, try to add the email column (this is safe to call multiple times)
    add_email_column(db)

    if db.query(UserDB).filter(UserDB.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    
    hashed_password = get_password_hash(user.password)
    db_user = UserDB(
        username=user.username,
        password=hashed_password,
        name=user.name,
        age=user.age,
        gender=user.gender,
        height=user.height,
        weight=user.weight,
        email=user.email,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {
        "message": "User registered successfully",
        "user": {
            "id": db_user.id,
            "username": db_user.username,
            "name": db_user.name,
            "age": db_user.age,
            "gender": db_user.gender,
            "height": db_user.height,
            "weight": db_user.weight,
            "email": db_user.email,
        },
    }

@router.post("/login", response_model=Token, summary="User Login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", summary="Get Current User")
def read_users_me(current_user: UserDB = Depends(get_current_user)):
    return {
        "id": current_user.id, 
        "username": current_user.username,
        "name": current_user.name,
        "age": current_user.age,
        "gender": current_user.gender,
        "height": current_user.height,
        "weight": current_user.weight
    }

@router.post("/password-reset-request")
def request_password_reset(reset_request: PasswordResetRequest, db: Session = Depends(get_db)):
    # First, try to add the email column (this is safe to call multiple times)
    add_email_column(db)

    # Find user by username
    user = db.query(UserDB).filter(UserDB.username == reset_request.username).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

@router.post("/password-reset-confirm")
def reset_password(reset_data: PasswordResetConfirm, db: Session = Depends(get_db)):
    """
    Confirm password reset for a user
    """
    # Validate input
    if not reset_data.username or not reset_data.new_password:
        raise HTTPException(status_code=400, detail="Username and new password are required")

    # Find the user by username
    user = db.query(UserDB).filter(UserDB.username == reset_data.username).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Validate the password (e.g., minimum length, complexity)
    if len(reset_data.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")

    # Hash the new password
    hashed_password = get_password_hash(reset_data.new_password)
    
    # Update the user's password
    user.password = hashed_password
    
    # Commit the changes
    db.commit()

    return {
        "status": "success", 
        "message": "Password reset successful"
    }