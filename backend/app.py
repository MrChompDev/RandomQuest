from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import json
import random
import requests
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load quests from JSON file
def load_quests():
    try:
        with open("data/quests.json", "r") as f:
            data = json.load(f)
            return data["quests"]
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []

@app.route('/')
def home():
    """Serve a simple API documentation page"""
    return render_template_string("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Random Quest API</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .method { color: #4B7BF5; font-weight: bold; }
        </style>
    </head>
    <body>
        <h1>Random Quest API</h1>
        <p>Your screen gives you a quest. The world is the game.</p>
        
        <div class="endpoint">
            <span class="method">GET</span> /api/health
            <p>Health check endpoint</p>
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span> /api/quest
            <p>Get a random quest. Add ?category=explore&level=4 to filter</p>
        </div>
        
        <div class="endpoint">
            <span class="method">POST</span> /api/generate
            <p>Generate AI quest with OpenRouter</p>
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span> /api/categories
            <p>Get all quest categories</p>
        </div>
    </body>
    </html>
    """)

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "ok", "timestamp": datetime.now().isoformat()})

@app.route('/api/quest')
def get_quest():
    """Get a random quest, optionally filtered by category and level"""
    try:
        category = request.args.get('category')
        level = request.args.get('level', type=int)
        
        quests = load_quests()
        
        # Filter by category if specified
        if category:
            quests = [q for q in quests if q["category"] == category]
        
        # Filter by level if specified
        if level is not None:
            quests = [q for q in quests if q["min_level"] <= level]
        
        if not quests:
            return jsonify({"error": "No quests found matching criteria"}), 404
        
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
        
        response = {
            "quest": selected_quest,
            "timestamp": datetime.now().isoformat()
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({"error": f"Failed to get quest: {str(e)}"}), 500

@app.route('/api/categories')
def get_categories():
    """Get all available quest categories"""
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
    
    return jsonify(categories)

@app.route('/api/generate', methods=['POST'])
def generate_ai_quest():
    """Generate a unique AI-powered quest using OpenRouter"""
    try:
        request_data = request.get_json()
        
        category = request_data.get('category', 'explore')
        level = request_data.get('level', 4)
        location_hint = request_data.get('location_hint', 'anywhere')
        
        # Try to generate AI quest with OpenRouter
        api_key = os.getenv("OpenRouter_API_KEY") or os.getenv("ANTHROPIC_API_KEY")
        
        if api_key:
            try:
                # Construct the prompt
                prompt = f"""You are a quest generator for an app called Random Quest. Generate a single, fun, achievable real-world quest for someone to do right now. The quest must be doable by one person, take 5-30 minutes, and require going outside or interacting with the world.

Category: {category} | Level: {level}/10 | Location hint: {location_hint}

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
                
                if response.status_code == 200:
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
                    
                    # Return AI quest
                    ai_quest = {
                        "id": f"ai_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                        "title": quest_data["title"],
                        "description": quest_data["description"],
                        "category": category,
                        "difficulty": quest_data["difficulty"],
                        "xp": quest_data["xp"] + 25,  # AI quest bonus
                        "min_level": min(level, 3),  # AI quests available earlier
                        "tags": quest_data["tags"],
                        "ai_generated": True
                    }
                    
                    print(f"AI Quest Generated: {ai_quest['title']}")
                    return jsonify(ai_quest)
                else:
                    print(f"OpenRouter API Error: {response.status_code} - {response.text}")
                    
            except Exception as e:
                print(f"AI Generation Error: {str(e)}")
        
        # Fallback to mock AI quest
        mock_ai_quest = {
            "id": f"ai_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "title": "Find a hidden pattern",
            "description": "Discover a repeating pattern in your environment that you've never noticed before.",
            "category": category,
            "difficulty": 3,
            "xp": 175,
            "min_level": 4,
            "tags": ["observation", "pattern", "discovery"],
            "ai_generated": True
        }
        
        print("Using fallback AI quest")
        return jsonify(mock_ai_quest)
        
    except Exception as e:
        return jsonify({"error": f"Failed to generate quest: {str(e)}"}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    print("Starting Random Quest Flask Server with OpenRouter support")
    print("API Documentation available at: http://localhost:8000")
    print("Set OpenRouter_API_KEY environment variable for AI quest generation")
    print("Quest endpoints ready at: http://localhost:8000/api")
    app.run(host="0.0.0.0", port=8000, debug=True)
