from fastapi import APIRouter, HTTPException
from models import GenerateRequest, Quest
import json
import os
import requests
from datetime import datetime

router = APIRouter()

@router.post("/generate", response_model=Quest)
async def generate_ai_quest(request: GenerateRequest):
    """
    Generate a unique AI-powered quest using OpenRouter API.
    """
    try:
        api_key = os.getenv("OPENROUTER_API_KEY") or os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise HTTPException(status_code=503, detail="AI service not available - API key missing")
        
        # Construct the prompt
        prompt = f"""You are a quest generator for an app called Random Quest. Generate a single, fun, achievable real-world quest for someone to do right now. The quest must be doable by one person, take 5-30 minutes, and require going outside or interacting with the world.

Category: {request.category} | Level: {request.level}/10 | Location hint: {request.location_hint or 'anywhere'}

Return ONLY valid JSON: {{"title": "...", "description": "...", "difficulty": 1-5, "xp": 50-500, "tags": ["tag1", "tag2"]}}"""
        
        # Use OpenRouter API
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "anthropic/claude-3-sonnet",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 1000,
                "temperature": 0.8,
            }
        )
        
        if response.status_code != 200:
            print(f"OpenRouter API Error: {response.status_code} - {response.text}")
            raise HTTPException(status_code=500, detail="AI service error")
        
        response_data = response.json()
        content = response_data["choices"][0]["message"]["content"].strip()
        
        # Extract JSON from response
        if "```json" in content:
            json_str = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            json_str = content.split("```")[1].strip()
        else:
            json_str = content
            
        quest_data = json.loads(json_str)
        
        # Create quest object
        quest = Quest(
            id=f"ai_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            title=quest_data["title"],
            description=quest_data["description"],
            category=request.category,
            difficulty=quest_data["difficulty"],
            xp=quest_data["xp"] + 25,  # AI quest bonus
            min_level=min(request.level, 3),  # AI quests available earlier
            tags=quest_data["tags"],
            ai_generated=True
        )
        
        return quest
        
    except requests.RequestException as e:
        print(f"OpenRouter Request Error: {str(e)}")
        raise HTTPException(status_code=503, detail="AI service unavailable")
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {str(e)} - Content: {content if 'content' in locals() else 'N/A'}")
        raise HTTPException(status_code=500, detail="Invalid AI response format")
    except Exception as e:
        print(f"Unexpected Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate quest: {str(e)}")
