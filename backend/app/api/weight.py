from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import date
from app.database import get_db
from app.models import WeightLogDB, UserDB

router = APIRouter()

class WeightLogRequest(BaseModel):
    user_id: int
    weight: float
    date: date

@router.post("")
def add_weight_log(weight_log: WeightLogRequest, db: Session = Depends(get_db)):
    """ Adds a new weight entry to the database """
    user = db.query(UserDB).filter(UserDB.id == weight_log.user_id).first()  
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_weight_log = WeightLogDB(user_id=weight_log.user_id, weight=weight_log.weight, date=weight_log.date)
    db.add(new_weight_log)
    db.commit()
    db.refresh(new_weight_log)
    return {"message": "Weight log added successfully"}

@router.get("/{user_id}")
def get_weight_logs(user_id: int, db: Session = Depends(get_db)):
    """ Retrieves all weight logs for a user """
    logs = db.query(WeightLogDB).filter(WeightLogDB.user_id == user_id).order_by(WeightLogDB.date).all()
    if not logs:
        raise HTTPException(status_code=404, detail="No weight logs found")
    return {"logs": logs}