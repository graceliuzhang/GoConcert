from fastapi import FastAPI
from routes import auth, events, users, groups

app = FastAPI()

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(events.router, prefix="/events", tags=["events"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(groups.router, prefix="/groups", tags=["groups"])

@app.get("/")
async def root():
    return {"message": "Backend running"}