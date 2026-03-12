import json
import random
import requests
import os
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

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

class QuestHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def _send_json_response(self, status_code, data):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self._set_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/health':
            self._send_json_response(200, {"status": "ok"})
            
        elif parsed_path.path == '/api/quest':
            query_params = parse_qs(parsed_path.query)
            category = query_params.get('category', [None])[0]
            level = query_params.get('level', [None])[0]
            
            quests = load_quests()
            
            # Filter by category if specified
            if category:
                quests = [q for q in quests if q["category"] == category]
            
            # Filter by level if specified
            if level is not None:
                level = int(level)
                quests = [q for q in quests if q["min_level"] <= level]
            
            if not quests:
                self._send_json_response(404, {"error": "No quests found"})
                return
            
            # Random selection
            selected_quest = random.choice(quests)
            
            response = {
                "quest": selected_quest,
                "timestamp": datetime.now().isoformat()
            }
            
            self._send_json_response(200, response)
            
        elif parsed_path.path == '/api/categories':
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
            
            self._send_json_response(200, categories)
        else:
            self._send_json_response(404, {"error": "Not found"})

    def do_POST(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/generate':
            # Read the request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                request_data = json.loads(post_data.decode('utf-8'))
            except:
                request_data = {}
            
            # Try to generate AI quest with OpenRouter
            api_key = os.getenv("OPENROUTER_API_KEY") or os.getenv("ANTHROPIC_API_KEY")
            
            if api_key:
                try:
                    # Construct the prompt
                    prompt = f"""You are a quest generator for an app called Random Quest. Generate a single, fun, achievable real-world quest for someone to do right now. The quest must be doable by one person, take 5-30 minutes, and require going outside or interacting with the world.

Category: {request_data.get('category', 'explore')} | Level: {request_data.get('level', 4)}/10 | Location hint: {request_data.get('location_hint', 'anywhere')}

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
                            "category": request_data.get("category", "explore"),
                            "difficulty": quest_data["difficulty"],
                            "xp": quest_data["xp"] + 25,  # AI quest bonus
                            "min_level": min(request_data.get("level", 4), 3),
                            "tags": quest_data["tags"],
                            "ai_generated": True
                        }
                        
                        print(f"AI Quest Generated: {ai_quest['title']}")
                        self._send_json_response(200, ai_quest)
                        return
                    else:
                        print(f"OpenRouter API Error: {response.status_code} - {response.text}")
                        
                except Exception as e:
                    print(f"AI Generation Error: {str(e)}")
            
            # Fallback to mock AI quest
            mock_ai_quest = {
                "id": f"ai_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "title": "Find a hidden pattern",
                "description": "Discover a repeating pattern in your environment that you've never noticed before.",
                "category": request_data.get("category", "explore"),
                "difficulty": 3,
                "xp": 175,
                "min_level": 4,
                "tags": ["observation", "pattern", "discovery"],
                "ai_generated": True
            }
            
            print("Using fallback AI quest")
            self._send_json_response(200, mock_ai_quest)
        else:
            self._send_json_response(404, {"error": "Not found"})

if __name__ == "__main__":
    print("Starting Random Quest Server with OpenRouter support on http://localhost:8000")
    print("Set OPENROUTER_API_KEY environment variable for AI quest generation")
    server = HTTPServer(('localhost', 8000), QuestHandler)
    server.serve_forever()
