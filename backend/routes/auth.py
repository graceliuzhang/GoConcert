from fastapi import APIRouter, HTTPException
from database import db
from core.security import hash_password, verify_password, create_access_token
from schemas.user_schema import RegisterModel, LoginModel
from datetime import datetime
from core.fallback_store import (
    fallback_sessions,
    fallback_users_by_email,
    fallback_users_by_id,
)

router = APIRouter()

@router.post("/register")
async def register(user: RegisterModel):
    hashed = hash_password(user.password)

    try:
        existing = await db.users.find_one({"email": user.email})
        if existing:
            raise HTTPException(status_code=400, detail="User exists")

        result = await db.users.insert_one({
            "email": user.email,
            "display_name": user.display_name,
            "hashed_password": hashed
        })

        token = create_access_token({"sub": str(result.inserted_id)})

        await db.sessions.insert_one(
            {
                "token": token,
                "user_id": result.inserted_id,
                "created_at": datetime.utcnow(),
            }
        )

        return {"access_token": token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception:
        if user.email in fallback_users_by_email:
            raise HTTPException(status_code=400, detail="User exists")

        user_id = create_access_token({"sub": user.email})
        fallback_user = {
            "_id": user_id,
            "email": user.email,
            "display_name": user.display_name,
            "hashed_password": hashed,
        }
        fallback_users_by_email[user.email] = fallback_user
        fallback_users_by_id[user_id] = fallback_user

        token = create_access_token({"sub": user_id})
        fallback_sessions[token] = user_id

        return {"access_token": token, "token_type": "bearer"}


@router.post("/login")
async def login(user: LoginModel):
    try:
        existing = await db.users.find_one({"email": user.email})
        if not existing:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        if not verify_password(user.password, existing.get("hashed_password", "")):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        token = create_access_token({"sub": str(existing["_id"])})

        await db.sessions.insert_one(
            {
                "token": token,
                "user_id": existing["_id"],
                "created_at": datetime.utcnow(),
            }
        )

        return {"access_token": token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception:
        existing = fallback_users_by_email.get(user.email)
        if not existing:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        if not verify_password(user.password, existing.get("hashed_password", "")):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        token = create_access_token({"sub": str(existing["_id"])})
        fallback_sessions[token] = existing["_id"]

        return {"access_token": token, "token_type": "bearer"}