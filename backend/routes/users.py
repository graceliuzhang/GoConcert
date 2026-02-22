from fastapi import APIRouter, Depends
from dependencies.auth_dependencies import get_current_user

router = APIRouter()

@router.get("/me")
async def get_me(current_user=Depends(get_current_user)):
    email = current_user.get("email")
    display_name = current_user.get("display_name") or (email.split("@", 1)[0] if email else "")
    return {
        "id": str(current_user["_id"]),
        "email": email,
        "display_name": display_name,
    }