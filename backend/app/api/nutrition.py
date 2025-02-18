from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
from app.database import get_db
from app.models import NutritionLogDB

router = APIRouter()

class NutritionLog(BaseModel):
    user_id: int
    food: str
    calories: int

@router.post("", summary="Add Nutrition Log")
def add_nutrition_log(log: NutritionLog, db: Session = Depends(get_db)) -> dict:
    db_log = NutritionLogDB(
        user_id=log.user_id,
        food=log.food,
        calories=log.calories,
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return {
        "message": "Nutrition log added successfully",
        "log": {
            "id": db_log.id,
            "user_id": db_log.user_id,
            "food": db_log.food,
            "calories": db_log.calories,
        },
    }


@router.get("/{user_id}", summary="Get Nutrition Logs")
def get_nutrition_logs(user_id: int, db: Session = Depends(get_db)) -> dict:
    logs = db.query(NutritionLogDB).filter(NutritionLogDB.user_id == user_id).all()
    if not logs:
        raise HTTPException(status_code=404, detail="No nutrition logs found for this user")
    return {
        "user_id": user_id,
        "logs": [
            {"id": log.id, "food": log.food, "calories": log.calories} for log in logs
        ],
    }