from fastapi import APIRouter, HTTPException, Query
from typing import Optional

router = APIRouter()

@router.get("", summary="Get Recommended Calories", tags=["Utilities"])
def recommended_calories(
    age: int = Query(..., description="User's age"),
    weight: float = Query(..., description="User's weight in kg"),
    height: float = Query(..., description="User's height in cm"),
    gender: str = Query(..., description="User's gender (male or female)"),
    activity_level: str = Query(..., description="Activity level (low, medium, high)"),
    target: Optional[str] = Query(None, description="User's fitness target (e.g., weight loss, muscle gain)")
):
    try:
        activity_level_mapping = {"low": 1.2, "medium": 1.55, "high": 1.9}
        if activity_level.lower() not in activity_level_mapping:
            raise HTTPException(status_code=400, detail="Invalid activity level.")
        if gender.lower() not in ["male", "female"]:
            raise HTTPException(status_code=400, detail="Invalid gender.")
        
        # Calculate BMR (Basal Metabolic Rate)
        bmr = (
            (10 * weight + 6.25 * height - 5 * age + 5)
            if gender.lower() == "male"
            else (10 * weight + 6.25 * height - 5 * age - 161)
        )
        total_calories = bmr * activity_level_mapping[activity_level.lower()]
        
        # Adjust calorie intake based on the target fitness goal
        if target:
            target = target.lower()
            if target == "muscle gain":
                total_calories += 150  # Increase for muscle gain
            elif target == "weight loss":
                total_calories -= 200  # Decrease for weight loss
            # Maintenance stays the same

        return {
            "recommended_calories": round(total_calories, 2),
            "target": target if target else "No specific target provided"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")