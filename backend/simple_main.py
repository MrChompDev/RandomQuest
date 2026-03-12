from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import random
from datetime import datetime
from typing import List, Dict, Any, Optional

app = FastAPI(title="Random Quest API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Load quests from JSON file
def load_quests() -> List[Dict[str, Any]]:
    try:
        with open("data/quests.json", "r") as f:
            data = json.load(f)
            return data["quests"]
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.get("/api/quest")
async def get_quest(
    category: Optional[str] = None,
    level: Optional[int] = None
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
        return {"error": "No quests found matching criteria"}
    
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
    
    return {
        "quest": selected_quest,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/categories")
async def get_categories():
    """
    Get all available quest categories.
    """
    categories = [
        {
            "id": "explore",
            "name": "Explore",
            "icon": "🧭",
            "description": "Discover something new in your immediate environment",
            "color": "bg-blue-100"
        },
        {
            "id": "nature",
            "name": "Nature", 
            "icon": "🌿",
            "description": "Engage with the natural world",
            "color": "bg-green-100"
        },
        {
            "id": "social",
            "name": "Social",
            "icon": "🤝", 
            "description": "Human connection quests",
            "color": "bg-yellow-100"
        },
        {
            "id": "challenge",
            "name": "Challenge",
            "icon": "🧠",
            "description": "Mini mental or physical challenges", 
            "color": "bg-purple-100"
        },
        {
            "id": "capture",
            "name": "Capture",
            "icon": "📸",
            "description": "Document the world",
            "color": "bg-pink-100"
        }
    ]
    
    return categories

@app.post("/api/generate")
async def generate_ai_quest(request: dict):
    """
    Generate a unique AI-powered quest (placeholder for now).
    """
    # Return a mock AI quest for now
    mock_ai_quest = {
        "id": f"ai_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
        "title": "Find a hidden pattern",
        "description": "Discover a repeating pattern in your environment that you've never noticed before.",
        "category": request.get("category", "explore"),
        "difficulty": 3,
        "xp": 175,
        "min_level": 4,
        "tags": ["observation", "pattern", "discovery"],
        "ai_generated": True
    }
    
    return mock_ai_quest

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
