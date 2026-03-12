from pydantic import BaseModel
from typing import List, Optional

class Quest(BaseModel):
    id: str
    title: str
    description: str
    category: str
    difficulty: int
    xp: int
    min_level: int
    tags: List[str]
    ai_generated: bool

    class Config:
        orm_mode = True

class QuestResponse(BaseModel):
    quest: Quest
    timestamp: str

    class Config:
        orm_mode = True

class GenerateRequest(BaseModel):
    category: str
    location_hint: Optional[str] = None
    level: int

class Category(BaseModel):
    id: str
    name: str
    icon: str
    description: str
    color: str

    class Config:
        orm_mode = True
