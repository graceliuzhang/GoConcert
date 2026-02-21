from fastapi import FastAPI
from database import db
import httpx
import os

app = FastAPI()
TICKETMASTER_API_KEY = os.getenv("TICKETMASTER_API_KEY")

@app.get("/")
async def root():
    return {"message": "Backend running"}

@app.get("/events")
async def fetch_events(city: str = "Raleigh"):

    url = "https://app.ticketmaster.com/discovery/v2/events.json"

    params = {
        "apikey": TICKETMASTER_API_KEY,
        "city": city,
        "size": 5
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)

    data = response.json()
    events = data.get("_embedded", {}).get("events", [])

    # Save events to MongoDB, avoid duplicates
    if events:
        for event in events:
            await db["events"].update_one(
                {"id": event["id"]},
                {"$set": event},
                upsert=True
            )

    return {
        "saved_events_count": len(events)
    }
