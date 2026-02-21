from fastapi import APIRouter, Depends
from dependencies.auth_dependencies import get_current_user

router = APIRouter()

@router.get("/me")
async def get_me(current_user=Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "email": current_user["email"]
    }