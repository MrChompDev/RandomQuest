from fastapi import APIRouter
from models import Category

router = APIRouter()

@router.get("/categories", response_model=list[Category])
async def get_categories():
    """
    Get all available quest categories.
    """
    categories = [
        Category(
            id="explore",
            name="Explore",
            icon="🧭",
            description="Discover something new in your immediate environment",
            color="bg-blue-100"
        ),
        Category(
            id="nature",
            name="Nature", 
            icon="🌿",
            description="Engage with the natural world",
            color="bg-green-100"
        ),
        Category(
            id="social",
            name="Social",
            icon="🤝", 
            description="Human connection quests",
            color="bg-yellow-100"
        ),
        Category(
            id="challenge",
            name="Challenge",
            icon="🧠",
            description="Mini mental or physical challenges", 
            color="bg-purple-100"
        ),
        Category(
            id="capture",
            name="Capture",
            icon="📸",
            description="Document the world",
            color="bg-pink-100"
        )
    ]
    
    return categories
