# Random Quest

Your screen gives you a quest. The world is the game.

Random Quest is a playful web app that generates short, real-world challenges. You pick a category (or go random), flip a card to reveal the quest, then log completion to earn XP, levels, streaks, and a growing quest history.

## How the app works

1. Choose a category (or none) on the home screen.
2. Tap Get Quest to fetch a curated quest from the backend.
3. Flip the card to reveal details and tags.
4. Tap I did it, add an optional note, and complete the quest.
5. The app awards XP, checks for level ups, and applies a daily streak bonus.
6. Progress is saved locally in the browser and shown in Profile and Log views.

## Features

- Random quest generation with category and level filtering
- AI-generated quests (available at Level 4+)
- XP, levels, and titles (10 levels)
- Daily streak bonus (+50 XP for the first quest of the day)
- Quest log with timestamps and optional notes
- Profile view with category breakdown and achievements
- No account required (progress stored in localStorage)

## Tech stack

- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- Backend: Flask + CORS
- AI: OpenRouter (model: anthropic/claude-3-sonnet)
- Fonts: Space Grotesk (display), Manrope (body), JetBrains Mono (code)

## Project structure

- frontend/ Next.js app
- backend/ Flask API server
- backend/data/quests.json Curated quest list

## Quick start

### Prerequisites

- Node.js 18+
- Python 3.11+

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The API runs on http://localhost:8000 and exposes endpoints under /api.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

By default the frontend calls http://localhost:8000/api. To point to a different backend, set:

- NEXT_PUBLIC_API_URL (example: http://localhost:8000/api)

## Environment variables

Backend (AI quests):

- OpenRouter_API_KEY
- ANTHROPIC_API_KEY (fallback, if OpenRouter_API_KEY is not set)

Example (PowerShell):

```powershell
$env:OpenRouter_API_KEY = "your-key-here"
```

Example (macOS/Linux):

```bash
export OpenRouter_API_KEY="your-key-here"
```

## API

Base URL: /api

- GET /health
  - Returns status and server timestamp.
- GET /quest
  - Optional query params: category, level
  - Returns a single quest with a weighted random pick based on difficulty and level.
- POST /generate
  - Body: { "category": "explore", "level": 4, "location_hint": "downtown" }
  - Returns a generated quest with a +25 XP bonus.
- GET /categories
  - Returns the list of available categories.

## Leveling and XP

XP thresholds and titles:

| Level | Title         | XP Required |
|------:|---------------|------------:|
| 1     | Wanderer      | 0           |
| 2     | Explorer      | 300         |
| 3     | Adventurer    | 800         |
| 4     | Pathfinder    | 1,800       |
| 5     | Trailblazer   | 3,500       |
| 6     | Legend        | 6,000       |
| 7     | Mythic        | 10,000      |
| 8     | Transcendent  | 15,000      |
| 9     | Cosmic        | 22,000      |
| 10    | Eternal       | 30,000      |

XP notes:

- Quest XP is defined per quest (curated or AI).
- Daily streak bonus: +50 XP for the first quest completed each day.
- AI quests add an additional +25 XP bonus on generation.

## Data and storage

- Curated quests live in backend/data/quests.json
- Player progress (XP, level, streak, completed quests, notes) is stored in localStorage
- Clearing browser storage resets progress

## Deployment

- Frontend can be deployed to Vercel (set NEXT_PUBLIC_API_URL)
- Backend can be deployed anywhere that runs Flask (set OpenRouter_API_KEY)

## License

MIT
