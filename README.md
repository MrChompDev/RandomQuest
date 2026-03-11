# 🗺️ Random Quest

> **Your screen gives you a quest. The world is the game.**

A playful web app that bridges screen time and real-world experience. Open the app, get a randomly generated IRL quest, go do it, earn XP, level up. The game loop is the real world.

Built for the [CodeTV Web Dev Challenge S3E1 — Playful Apps](https://codetv.dev/hackathon/wdc-s3e1-playful-apps), sponsored by Google.

---

## ✨ Features

- 🎲 **Random quest generation** — 50+ hand-curated quests across 5 categories
- 🤖 **AI-powered quests** — Claude generates unique quests on demand
- ⭐ **XP & levelling system** — earn XP, level up from Wanderer to Trailblazer
- 📜 **Quest log** — track every adventure you've completed
- 📱 **Mobile-first** — designed for one-handed use on the go
- ⚡ **Zero sign-up** — runs entirely off localStorage, works offline once loaded

---

## 🗂️ Quest Categories

| Category | Description |
|----------|-------------|
| 🧭 Explore | Discover something new in your immediate environment |
| 🌿 Nature | Engage with the natural world |
| 🤝 Social | Human connection challenges |
| 🧠 Challenge | Mini mental or physical tasks |
| 📸 Capture | Document the world around you |

---

## 🛠️ Tech Stack

### Frontend (`/frontend`)
- **Next.js 14** (App Router) — TypeScript
- **Tailwind CSS** — styling
- **Framer Motion** — quest card animations, XP bar, level-up burst
- **localStorage** — XP, level, completed quest log (no account needed)

### Backend (`/backend`)
- **Python 3.11 + FastAPI** — REST API
- **Claude API** (`claude-sonnet-4`) — AI quest generation
- **Pydantic** — request/response validation
- **quests.json** — curated quest pool

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- An [Anthropic API key](https://console.anthropic.com/) (for AI quests)

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL to your backend URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Set ANTHROPIC_API_KEY in .env
uvicorn main:app --reload
```

API runs at [http://localhost:8000](http://localhost:8000) — docs at `/docs`

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/quest` | `GET` | Returns a random quest. Params: `category`, `level` |
| `/generate` | `POST` | AI-generated quest via Claude. Body: `{ category, level, location_hint }` |
| `/categories` | `GET` | Returns all categories with icons and descriptions |
| `/health` | `GET` | Health check |

---

## 📁 Project Structure

```
random-quest/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Home — category picker + Get Quest CTA
│   │   │   ├── quest/page.tsx    # Active quest display
│   │   │   ├── log/page.tsx      # Completed quest history
│   │   │   └── profile/page.tsx  # Level, XP, stats
│   │   ├── components/
│   │   │   ├── QuestCard.tsx     # Animated flip card
│   │   │   ├── XPBar.tsx         # Animated XP progress bar
│   │   │   ├── CategoryPicker.tsx
│   │   │   └── LevelUpModal.tsx
│   │   ├── hooks/
│   │   │   └── usePlayer.ts      # localStorage read/write
│   │   ├── lib/
│   │   │   └── api.ts            # fetch() wrappers
│   │   └── types/
│   │       └── quest.ts          # TypeScript interfaces
│   └── package.json
│
└── backend/
    ├── main.py                   # FastAPI entry point
    ├── routes/
    │   ├── quests.py             # GET /quest
    │   └── generate.py           # POST /generate (Claude)
    ├── models.py                 # Pydantic schemas
    ├── data/
    │   └── quests.json           # Quest pool
    └── requirements.txt
```

---

## 🌍 Deployment

| Service | Platform |
|---------|----------|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Railway](https://railway.app) |

### Environment Variables

**Frontend (`.env.local`)**
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

**Backend (`.env`)**
```
ANTHROPIC_API_KEY=sk-ant-...
```

---

## 🎮 Level System

| Level | Title | XP Required | Unlocks |
|-------|-------|-------------|---------|
| 1 | Wanderer | 0 | Easy quests |
| 2 | Explorer | 300 | Medium quests |
| 3 | Adventurer | 800 | Hard quests |
| 4 | Pathfinder | 1,800 | AI-generated quests |
| 5 | Trailblazer | 3,500 | Legendary quests |

---

## 🏆 Built For

**[CodeTV Web Dev Challenge S3E1 — Build a Playful App](https://codetv.dev/hackathon/wdc-s3e1-playful-apps)**  
Sponsored by Google · Deadline: March 23, 2025

> *"Build an app to help people reconnect with the world outside their screens."*

---

## 📄 License

MIT — go build something and go outside.
