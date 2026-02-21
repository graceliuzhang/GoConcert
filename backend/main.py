from fastapi import FastAPI
from database import db


app = FastAPI()


@app.get("/")
async def root():
    return {"message": "API running"}


@app.get("/test-db")
async def test_db():
    result = await db["events"].insert_one({"name": "Test Event"})
    return {"inserted_id": str(result.inserted_id)}


