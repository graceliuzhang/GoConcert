from motor.motor_asyncio import AsyncIOMotorClient
import os
from pymongo.errors import ServerSelectionTimeoutError


MONGO_URL = os.getenv("MONGO_URL")

if not MONGO_URL:
    raise ValueError("MONGO_URL environment variable is not set!")

client = AsyncIOMotorClient(
    MONGO_URL,
    serverSelectionTimeoutMS=5000,
    connectTimeoutMS=5000,
    socketTimeoutMS=5000,
)

db = client["goconcert_db"]

# Test connection on startup
async def test_connection():
    try:
        await client.admin.command('ping')
        print("✓ MongoDB connection successful!")
        return True
    except Exception as e:
        print(f"✗ MongoDB connection failed: {e}")
        return False
