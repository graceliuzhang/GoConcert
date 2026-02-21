from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from database import db
from core.fallback_store import fallback_sessions, fallback_users_by_id

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        session = await db.sessions.find_one({"token": token})
        if not session:
            raise HTTPException(status_code=401)

        user = await db.users.find_one({"_id": session["user_id"]})
        if not user:
            raise HTTPException(status_code=401)

        return user
    except HTTPException:
        raise
    except Exception:
        user_id = fallback_sessions.get(token)
        if not user_id:
            raise HTTPException(status_code=401)

        user = fallback_users_by_id.get(user_id)
        if not user:
            raise HTTPException(status_code=401)

        return user