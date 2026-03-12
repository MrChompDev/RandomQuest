import json
import random
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json

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
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        # Set CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Type', 'application/json')
        
        if parsed_path.path == '/api/health':
            self.send_response(200)
            self.end_headers()
            self.wfile.write(json.dumps({"status": "ok"}).encode())
            
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
                self.send_response(404)
                self.end_headers()
                self.wfile.write(json.dumps({"error": "No quests found"}).encode())
                return
            
            # Random selection
            selected_quest = random.choice(quests)
            
            response = {
                "quest": selected_quest,
                "timestamp": datetime.now().isoformat()
            }
            
            self.send_response(200)
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
            
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
            
            self.send_response(200)
            self.end_headers()
            self.wfile.write(json.dumps(categories).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        parsed_path = urlparse(self.path)
        
        # Set CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Type', 'application/json')
        
        if parsed_path.path == '/api/generate':
            # Read the request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                request_data = json.loads(post_data.decode('utf-8'))
            except:
                request_data = {}
            
            # Return a mock AI quest
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
            
            self.send_response(200)
            self.end_headers()
            self.wfile.write(json.dumps(mock_ai_quest).encode())
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == "__main__":
    server = HTTPServer(('localhost', 8000), QuestHandler)
    print("Starting server on http://localhost:8000")
    server.serve_forever()
