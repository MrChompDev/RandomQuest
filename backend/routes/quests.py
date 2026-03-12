from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from typing import Optional, List
import json
import random
from datetime import datetime
from models import Quest, QuestResponse

router = APIRouter()

# Load quests from JSON file
def load_quests():
    try:
        with open("data/quests.json", "r") as f:
            data = json.load(f)
            return data["quests"]
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Quests data not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid quests data format")

@router.get("/quest", response_model=QuestResponse)
async def get_quest(
    category: Optional[str] = Query(None, description="Filter by quest category"),
    level: Optional[int] = Query(None, ge=1, le=10, description="Filter by player level")
):
    """
    Get a random quest, optionally filtered by category and level.
    """
    quests = load_quests()
    
    # Filter by category if specified
    if category:
        quests = [q for q in quests if q["category"] == category]
    
    # Filter by level if specified
    if level is not None:
        quests = [q for q in quests if q["min_level"] <= level]
    
    if not quests:
        raise HTTPException(status_code=404, detail="No quests found matching criteria")
    
    # Weighted random selection based on difficulty
    weights = []
    for quest in quests:
        # Easier quests are more common for lower levels
        if level is not None:
            weight = max(1, 6 - quest["difficulty"] + (level // 3))
        else:
            weight = max(1, 6 - quest["difficulty"])
        weights.append(weight)
    
    selected_quest = random.choices(quests, weights=weights)[0]
    
    return QuestResponse(
        quest=Quest(**selected_quest),
        timestamp=datetime.now().isoformat()
    )

@router.get("/quests", response_model=List[Quest])
async def get_all_quests():
    """
    Get all available quests (for debugging/reference).
    """
    quests = load_quests()
    return [Quest(**quest) for quest in quests]
