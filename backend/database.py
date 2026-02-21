from motor.motor_asyncio import AsyncIOMotorClient
import os


MONGO_URL = os.getenv("MONGO_URL")


client = AsyncIOMotorClient(
	MONGO_URL,
	serverSelectionTimeoutMS=2000,
	connectTimeoutMS=2000,
	socketTimeoutMS=2000,
)


db = client["music_app"]
