from fastapi import APIRouter, HTTPException, Depends
from database import db
from dependencies.auth_dependencies import get_current_user
from schemas.group_schema import GroupCreate, GroupResponse
from datetime import datetime
from bson import ObjectId

router = APIRouter()


# --------------------------------------------------
# 1️⃣ Create a Group
# --------------------------------------------------

@router.post("/", response_model=dict)
async def create_group(
    group: GroupCreate,
    current_user=Depends(get_current_user)
):
    """Create a new group for an event"""
    try:
        print(f"📝 Creating group: {group.name} for event {group.event_id}")
        print(f"👤 Creator user ID type: {type(current_user['_id'])}, value: {current_user['_id']}")
        
        group_doc = {
            "event_id": group.event_id,
            "name": group.name,
            "description": group.description,
            "max_members": group.max_members,
            "creator_id": current_user["_id"],
            "member_ids": [current_user["_id"]],  # Creator is first member
            "event_title": group.event_title,
            "event_venue": group.event_venue,
            "event_meta": group.event_meta,
            "created_at": datetime.utcnow()
        }
        
        result = await db.groups.insert_one(group_doc)
        print(f"✓ Group created successfully with ID: {result.inserted_id}")
        
        return {
            "message": "Group created successfully",
            "group_id": str(result.inserted_id)
        }
    except Exception as e:
        print(f"✗ Error creating group: {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create group: {str(e)}")


# --------------------------------------------------
# 2️⃣ Get Groups for an Event
# --------------------------------------------------

@router.get("/event/{event_id}")
async def get_event_groups(event_id: str):
    """Get all groups for a specific event"""
    try:
        print(f"🔍 Fetching groups for event: {event_id}")
        groups = await db.groups.find({"event_id": event_id}).to_list(100)
        print(f"📊 Found {len(groups)} groups for event {event_id}")
        
        result = []
        for group in groups:
            result.append({
                "id": str(group["_id"]),
                "event_id": group["event_id"],
                "name": group["name"],
                "description": group.get("description"),
                "max_members": group["max_members"],
                "current_members": len(group.get("member_ids", [])),
                "creator_id": str(group["creator_id"]),
                "member_ids": [str(mid) for mid in group.get("member_ids", [])],
                "event_title": group.get("event_title"),
                "event_venue": group.get("event_venue"),
                "event_meta": group.get("event_meta"),
                "created_at": group["created_at"].isoformat(),
                "is_full": len(group.get("member_ids", [])) >= group["max_members"]
            })
        
        return {"count": len(result), "groups": result}
    except Exception as e:
        print(f"✗ Error fetching groups: {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch groups")


# --------------------------------------------------
# 3️⃣ Join a Group
# --------------------------------------------------

@router.post("/{group_id}/join")
async def join_group(
    group_id: str,
    current_user=Depends(get_current_user)
):
    """Join an existing group"""
    try:
        # Find the group
        group = await db.groups.find_one({"_id": ObjectId(group_id)})
        
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")
        
        member_ids = group.get("member_ids", [])
        
        # Check if already a member
        if current_user["_id"] in member_ids:
            return {"message": "Already a member of this group"}
        
        # Check if group is full
        if len(member_ids) >= group["max_members"]:
            raise HTTPException(status_code=400, detail="Group is full")
        
        # Add user to group
        await db.groups.update_one(
            {"_id": ObjectId(group_id)},
            {"$push": {"member_ids": current_user["_id"]}}
        )
        
        return {"message": "Successfully joined group"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error joining group: {e}")
        raise HTTPException(status_code=500, detail="Failed to join group")


# --------------------------------------------------
# 4️⃣ Leave a Group
# --------------------------------------------------

@router.post("/{group_id}/leave")
async def leave_group(
    group_id: str,
    current_user=Depends(get_current_user)
):
    """Leave a group"""
    try:
        group = await db.groups.find_one({"_id": ObjectId(group_id)})
        
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")
        
        member_ids = group.get("member_ids", [])
        
        if current_user["_id"] not in member_ids:
            raise HTTPException(status_code=400, detail="Not a member of this group")
        
        # Remove user from group
        await db.groups.update_one(
            {"_id": ObjectId(group_id)},
            {"$pull": {"member_ids": current_user["_id"]}}
        )
        
        # If group is empty, delete it
        updated_group = await db.groups.find_one({"_id": ObjectId(group_id)})
        if not updated_group or len(updated_group.get("member_ids", [])) == 0:
            await db.groups.delete_one({"_id": ObjectId(group_id)})
            return {"message": "Left group (group deleted as it's now empty)"}
        
        return {"message": "Successfully left group"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error leaving group: {e}")
        raise HTTPException(status_code=500, detail="Failed to leave group")


# --------------------------------------------------
# 5️⃣ Get User's Groups
# --------------------------------------------------

@router.get("/my-groups")
async def get_my_groups(current_user=Depends(get_current_user)):
    """Get all groups the current user is a member of"""
    try:
        groups = await db.groups.find(
            {"member_ids": current_user["_id"]}
        ).to_list(100)
        
        result = []
        for group in groups:
            result.append({
                "id": str(group["_id"]),
                "event_id": group["event_id"],
                "name": group["name"],
                "description": group.get("description"),
                "max_members": group["max_members"],
                "current_members": len(group.get("member_ids", [])),
                "creator_id": str(group["creator_id"]),
                "is_creator": str(group["creator_id"]) == str(current_user["_id"]),
                "member_ids": [str(mid) for mid in group.get("member_ids", [])],
                "event_title": group.get("event_title"),
                "event_venue": group.get("event_venue"),
                "event_meta": group.get("event_meta"),
                "created_at": group["created_at"].isoformat(),
                "is_full": len(group.get("member_ids", [])) >= group["max_members"]
            })
        
        return {"count": len(result), "groups": result}
    except Exception as e:
        print(f"Error fetching user groups: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch groups")
