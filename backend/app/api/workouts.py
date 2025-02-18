from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import date
from typing import List, Dict, Any
from app.database import get_db
from app.models import WorkoutDB

router = APIRouter()

class Workout(BaseModel):
    user_id: int
    exercise: str
    duration: int
    date: date

@router.post("", summary="Add Workout")
def add_workout(workout: Workout, db: Session = Depends(get_db)): 
    """ Save workout to database """
    try:
        if not workout.date:
            raise HTTPException(status_code=400, detail="Date is required")

        db_workout = WorkoutDB(
            user_id=workout.user_id,
            exercise=workout.exercise,
            duration=workout.duration,
            date=workout.date  # Ensure we save the workout with the correct date
        )
        db.add(db_workout)
        db.commit()
        db.refresh(db_workout)

        return {
            "message": "Workout added successfully",
            "workout": {
                "id": db_workout.id,
                "user_id": db_workout.user_id,
                "exercise": db_workout.exercise,
                "duration": db_workout.duration,
                "date": db_workout.date
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@router.get("/{user_id}", summary="Get Workouts")
def get_workouts(user_id: int, date: str = Query(..., description="Date in YYYY-MM-DD format"), db: Session = Depends(get_db)):
    """ Get workouts for a specific user and date """
    try:
        if not date:
            raise HTTPException(status_code=400, detail="Date is required")

        workouts = db.query(WorkoutDB).filter(
            WorkoutDB.user_id == user_id,
            WorkoutDB.date == date
        ).all()

        if workouts is None:
            return {"workouts": []}  # Always return an array

        return {
            "user_id": user_id,
            "workouts": [
                {"id": w.id, "exercise": w.exercise, "duration": w.duration, "date": w.date} for w in workouts
            ],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")