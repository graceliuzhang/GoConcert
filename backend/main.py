from fastapi import FastAPI, HTTPException
from database import db
import httpx
import os
from datetime import datetime

app = FastAPI()
TICKETMASTER_API_KEY = os.getenv("TICKETMASTER_API_KEY")

@app.get("/")
async def root():
    return {"message": "Backend running"}

@app.get("/events")
async def fetch_events(city: str = "Raleigh", size: int = 20):

    if not TICKETMASTER_API_KEY:
        raise HTTPException(status_code=500, detail="Missing TICKETMASTER_API_KEY")

    url = "https://app.ticketmaster.com/discovery/v2/events.json"

    params = {
        "apikey": TICKETMASTER_API_KEY,
        "city": city,
        "size": size
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Ticketmaster request failed")

    data = response.json()
    events = data.get("_embedded", {}).get("events", [])

    # Save events to MongoDB as best-effort cache (do not fail request if DB is unavailable)
    if events:
        try:
            for event in events:
                await db["events"].update_one(
                    {"id": event["id"]},
                    {"$set": {**event, "cached_at": datetime.utcnow().isoformat()}},
                    upsert=True
                )
        except Exception as exc:
            print(f"Mongo cache write skipped: {exc}")

    normalized_events = []
    for event in events:
        venue_info = (
            event.get("_embedded", {})
            .get("venues", [{}])[0]
        )
        date_info = event.get("dates", {}).get("start", {}).get("localDate", "TBD")
        time_info = event.get("dates", {}).get("start", {}).get("localTime", "")
        city_name = venue_info.get("city", {}).get("name", "")
        state_name = venue_info.get("state", {}).get("stateCode") or venue_info.get("country", {}).get("name", "")

        meta_parts = [date_info]
        if time_info:
            meta_parts.append(time_info)
        if city_name:
            location = city_name if not state_name else f"{city_name}, {state_name}"
            meta_parts.append(location)

        normalized_events.append(
            {
                "id": event.get("id"),
                "title": event.get("name", "Untitled Event"),
                "venue": venue_info.get("name", "Venue TBA"),
                "meta": " · ".join(meta_parts),
                "url": event.get("url"),
                "image": next((img.get("url") for img in event.get("images", []) if img.get("url")), None),
                "raw": {
                    "ticketmaster_id": event.get("id"),
                    "genre": (event.get("classifications", [{}])[0].get("genre", {}).get("name")),
                }
            }
        )

    return {
        "city": city,
        "count": len(normalized_events),
        "events": normalized_events
    }
