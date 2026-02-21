from asyncio import events

from fastapi import APIRouter, HTTPException, Depends
from database import db
from dependencies.auth_dependencies import get_current_user
import httpx
import os
from datetime import datetime
from core.fallback_store import fallback_saved_events
from core.security import create_access_token

router = APIRouter()

TICKETMASTER_API_KEY = os.getenv("TICKETMASTER_API_KEY")


# --------------------------------------------------
# 1️⃣ Public: Fetch Events from Ticketmaster
# --------------------------------------------------

@router.get("/")
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
        raise HTTPException(
            status_code=response.status_code,
            detail="Ticketmaster request failed"
        )

    data = response.json()
    events = data.get("_embedded", {}).get("events", [])

    # Best-effort MongoDB cache
    if events:
        try:
            for event in events:

                venue_info = (
                    event.get("_embedded", {})
                    .get("venues", [{}])[0]
                )

                location_info = venue_info.get("location", {})

                latitude = location_info.get("latitude")
                longitude = location_info.get("longitude")

                try:
                    latitude = float(latitude) if latitude else None
                    longitude = float(longitude) if longitude else None
                except ValueError:
                    latitude = None
                    longitude = None

                await db.events.update_one(
                    {"ticketmaster_id": event.get("id")},
                    {
                        "$set": {
                            "ticketmaster_id": event.get("id"),
                            "raw": event,
                            "cached_at": datetime.utcnow(),
                            "latitude": latitude,
                            "longitude": longitude,
                            "location": {
                                "type": "Point",
                                "coordinates": [longitude, latitude]
                            } if latitude and longitude else None
                        }
                    },
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
        state_name = (
            venue_info.get("state", {}).get("stateCode")
            or venue_info.get("country", {}).get("name", "")
        )

        meta_parts = [date_info]
        if time_info:
            meta_parts.append(time_info)
        if city_name:
            location = city_name if not state_name else f"{city_name}, {state_name}"
            meta_parts.append(location)

        normalized_events.append(
            {
                "ticketmaster_id": event.get("id"),
                "title": event.get("name", "Untitled Event"),
                "venue": venue_info.get("name", "Venue TBA"),
                "meta": " · ".join(meta_parts),
                "url": event.get("url"),
                "image": next(
                    (img.get("url") for img in event.get("images", []) if img.get("url")),
                    None
                ),
                "genre": (
                    event.get("classifications", [{}])[0]
                    .get("genre", {})
                    .get("name")
                )
            }
        )

    return {
        "city": city,
        "count": len(normalized_events),
        "events": normalized_events
    }


# --------------------------------------------------
# 2️⃣ Protected: Save Event for Logged-in User
# --------------------------------------------------

@router.post("/save")
async def save_event(
    event: dict,
    current_user=Depends(get_current_user)
):
    try:
        await db.saved_events.insert_one({
            "user_id": current_user["_id"],
            "ticketmaster_id": event.get("ticketmaster_id"),
            "event_data": event,
            "saved_at": datetime.utcnow()
        })
    except Exception:
        user_key = str(current_user["_id"])
        existing = fallback_saved_events.get(user_key, [])
        existing = [
            item for item in existing
            if item.get("ticketmaster_id") != event.get("ticketmaster_id")
        ]
        existing.append(
            {
                "_id": create_access_token({"sub": user_key}),
                "user_id": user_key,
                "ticketmaster_id": event.get("ticketmaster_id"),
                "event_data": event,
                "saved_at": datetime.utcnow().isoformat(),
            }
        )
        fallback_saved_events[user_key] = existing

    return {"message": "Event saved"}


# --------------------------------------------------
# 3️⃣ Protected: Get Saved Events for User
# --------------------------------------------------

@router.get("/saved")
async def get_saved_events(
    current_user=Depends(get_current_user)
):
    try:
        events = await db.saved_events.find(
            {"user_id": current_user["_id"]}
        ).to_list(100)

        for event in events:
            event["_id"] = str(event["_id"])
            event["user_id"] = str(event["user_id"])
    except Exception:
        user_key = str(current_user["_id"])
        events = fallback_saved_events.get(user_key, [])

    return {
        "count": len(events),
        "events": events
    }


# --------------------------------------------------
# 4️⃣ Protected: Remove Saved Event
# --------------------------------------------------

@router.delete("/saved/{ticketmaster_id}")
async def delete_saved_event(
    ticketmaster_id: str,
    current_user=Depends(get_current_user)
):
    try:
        await db.saved_events.delete_one({
            "user_id": current_user["_id"],
            "ticketmaster_id": ticketmaster_id
        })
    except Exception:
        user_key = str(current_user["_id"])
        fallback_saved_events[user_key] = [
            item for item in fallback_saved_events.get(user_key, [])
            if item.get("ticketmaster_id") != ticketmaster_id
        ]

    return {"message": "Event removed"}