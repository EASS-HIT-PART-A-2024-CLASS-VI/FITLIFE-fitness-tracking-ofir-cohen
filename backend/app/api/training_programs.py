from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os

router = APIRouter()

# Define paths for PDFs
PDF_PATHS = {
    "muscle_building": "files/muscle_building.pdf",
    "weight_loss": "files/weight_loss.pdf",
    "general_fitness": "files/general_fitness.pdf",
    "home_workout": "files/home_workout.pdf"
}

@router.get("", tags=["Training Programs"])
async def get_training_programs():
    """
    Get a list of available training programs.
    """
    return {"available_programs": list(PDF_PATHS.keys())}

@router.get("/{goal}", tags=["Training Programs"])
def download_training_program(goal: str):
    """
    Download the specified training program as a PDF.
    """
    file_path = PDF_PATHS.get(goal)
    if not file_path or not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Training program not found")
    
    # Explicitly set the `Content-Disposition` header without quotes
    headers = {
        "Content-Disposition": f"attachment; filename={goal}.pdf",
    }
    return FileResponse(file_path, media_type="application/pdf", headers=headers)