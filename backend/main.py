from fastapi import FastAPI
from routes import auth, events, users, groups
from database import test_connection

app = FastAPI()

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(events.router, prefix="/events", tags=["events"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(groups.router, prefix="/groups", tags=["groups"])

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("=" * 50)
    print("🚀 Starting GoConcert Backend...")
    print("=" * 50)
    connected = await test_connection()
    if not connected:
        print("⚠️  WARNING: MongoDB connection failed! Using fallback storage.")
    print("=" * 50)

@app.get("/")
async def root():
    return {"message": "Backend running"}

@app.get("/health")
async def health_check():
    """Check if MongoDB is connected"""
    from database import client
    try:
        await client.admin.command('ping')
        return {"status": "healthy", "mongodb": "connected"}
    except Exception as e:
        return {"status": "degraded", "mongodb": "disconnected", "error": str(e)}