
🗺️  RANDOM QUEST
Full System Design Document
CodeTV Web Dev Challenge — S3E1: Playful Apps

App Name
Random Quest
Tagline
Your screen gives you a quest. The world is the game.
Challenge
CodeTV WDC S3E1 — Build a Playful App
Sponsor
Google Jules
Solo Builder
MrChomp
Build Window
4 hours
Deadline
March 23, 2025 — Midnight
Deploy Target
Vercel (frontend) + Railway (backend)



1. Overview & Vision
Random Quest is a playful web app that bridges screen time and real-world experience. The user opens the app, receives a randomly generated IRL quest ("find a café you've never entered", "sit somewhere quiet for 5 minutes", "say good morning to a stranger"), completes it in the real world, logs their result, and earns XP to level up their adventurer profile.

The core tension the app resolves is elegant: you have to use your phone to be told to put your phone down. Every interaction with the UI is brief — get quest, go do it, come back, log it. The game loop is the real world.

1.1 Core Loop
STEP 1
Open app → Choose a quest category (or randomise)


STEP 2
Receive quest card with title, description, difficulty, and XP reward


STEP 3
Go do the quest in the real world


STEP 4
Return to the app → tap "I did it!" → optional short note / emoji reaction


STEP 5
Earn XP → level up → unlock harder quests


1.2 Design Principles
Screen-minimal — every UI interaction should take under 10 seconds
No account required — runs entirely off localStorage for zero-friction onboarding
Mobile-first — this is a phone app, designed for one-handed use on the go
Playful not preachy — the tone is adventurous, not wellness-lecture-y
Offline capable — once loaded, quests work without an internet connection

2. Technology Stack
Random Quest uses a polyglot architecture — TypeScript/React on the frontend for a rich interactive UI, and Python on the backend for quest logic, AI generation, and data serving. This split lets each language do what it does best.

2.1 Frontend — Next.js (TypeScript)
Framework
Next.js 14 (App Router)
Language
TypeScript (.tsx / .ts)
Styling
Tailwind CSS + custom CSS animations
Animations
Framer Motion — quest card flip, XP bar fill, level-up burst
State
React useState / useReducer (no external state lib needed)
Persistence
localStorage — XP, level, completed quest log
Geolocation
Browser navigator.geolocation API
HTTP Client
Native fetch() to Python backend
Deploy
Vercel


2.2 Backend — Python (FastAPI)
Framework
FastAPI
Language
Python 3.11+
Quest Data
quests.json — curated pool of 50+ quests
AI Generation
Ollama API () — generates dynamic quests on demand
Validation
Pydantic models for request/response schema
CORS
FastAPI CORS middleware — allows Next.js origin
Deploy
Railway (free tier, auto-deploys from GitHub)


2.3 Why This Split?
Python is used for the backend because:
FastAPI is extremely fast to scaffold — a working API in under 20 lines
Python's string manipulation and Claude API integration is cleaner than Node for AI prompting
Quest data manipulation (filtering, weighting, randomisation) is natural in Python
Demonstrates polyglot competence — a key signal for hackathon judges

TypeScript/Next.js handles the frontend because:
App Router gives file-based routing with zero config
TypeScript catches interface mismatches between frontend and backend early
Tailwind + Framer Motion gives polished, animated UI with minimal code

3. System Architecture
3.1 High-Level Diagram (Text)
┌─────────────────────────────────────────────┐
│            BROWSER (Mobile/Desktop)         │
│  Next.js 14 (TypeScript)  ←→  localStorage  │
│  Tailwind CSS + Framer Motion animations    │
│  Pages: /  /quest  /log  /profile           │
└──────────────────┬──────────────────────────┘
                   │ fetch() REST calls
┌──────────────────▼──────────────────────────┐
│         BACKEND (Railway)                   │
│  FastAPI (Python 3.11)                      │
│  GET /quest  →  random from quests.json     │
│  POST /generate  →  Claude API (AI quests)  │
└──────────────────┬──────────────────────────┘
                   │ Anthropic SDK
┌──────────────────▼──────────────────────────┐
│         Claude API (claude-sonnet-4)        │
│  Generates location/category-aware quests   │
└─────────────────────────────────────────────┘


3.2 Data Flow
User opens app → Next.js loads, reads localStorage for XP/level/log
User taps 'Get Quest' → fetch() → GET /quest?category=explore&level=3
Python backend picks from quests.json, applies level weighting, returns JSON
Quest card renders with Framer Motion flip animation
User goes outside, does quest, returns, taps 'I did it!'
XP added to localStorage, quest appended to log, celebration animation plays
If user taps 'Surprise me with AI' → POST /generate → FastAPI calls Claude → returns unique quest

4. File & Folder Structure
4.1 Frontend (Next.js)
src/app/page.tsx
Home — hero, category picker, Get Quest CTA
src/app/quest/page.tsx
Active quest display — card, timer, complete button
src/app/log/page.tsx
Quest log — completed quests history
src/app/profile/page.tsx
Player profile — level, XP bar, stats
src/components/QuestCard.tsx
Animated flip card component
src/components/XPBar.tsx
Animated XP progress bar
src/components/CategoryPicker.tsx
Icon grid for quest category selection
src/components/LevelUpModal.tsx
Celebration modal on level-up
src/hooks/usePlayer.ts
Custom hook — reads/writes localStorage
src/lib/api.ts
fetch() wrappers for backend calls
src/types/quest.ts
TypeScript interfaces — Quest, Player, Category
src/styles/globals.css
Tailwind base + custom CSS keyframe animations


4.2 Backend (Python/FastAPI)
main.py
FastAPI app entry point, CORS setup, route registration
routes/quests.py
GET /quest — filter + weighted random selection
routes/generate.py
POST /generate — Claude API call, prompt construction
models.py
Pydantic schemas — QuestResponse, GenerateRequest
data/quests.json
50+ hand-curated quests across 5 categories
requirements.txt
fastapi, uvicorn, anthropic, pydantic


5. API Design
5.1 Endpoints
Endpoint
Method
Description
/quest
GET
Returns a random quest. Params: category (optional), level (optional, 1–10)
/generate
POST
Uses Claude to generate a unique AI quest. Body: { category, location_hint, level }
/categories
GET
Returns list of quest categories with icons and descriptions
/health
GET
Health check — returns { status: ok }


5.2 Quest JSON Schema
{
  "id": "q_042",
  "title": "Talk to a stranger",
  "description": "Strike up a conversation with someone you don't know. Ask them one genuine question.",
  "category": "social",
  "difficulty": 3,
  "xp": 150,
  "min_level": 1,
  "tags": ["social", "brave", "connection"],
  "ai_generated": false
}


5.3 AI Quest Generation Prompt
The following system prompt is sent to Claude when a user requests an AI-generated quest:
You are a quest generator for an app called Random Quest. Generate a single, fun, achievable real-world quest for someone to do right now. The quest must be doable by one person, take 5-30 minutes, and require going outside or interacting with the world.

Category: {category} | Level: {level}/10 | Location hint: {location_hint}

Return ONLY valid JSON: { title, description, difficulty (1-5), xp (50-500), tags[] }


6. Quest Categories & Examples
🧭  Explore
Discover something new in your immediate environment. Cafés, streets, parks, buildings you've walked past without entering.
🌿  Nature
Engage with the natural world. Touch grass (literally). Find a bird. Sit under a tree. Breathe outdoor air for 5 uninterrupted minutes.
🤝  Social
Human connection quests. Compliment someone. Ask a stranger for a recommendation. Wave at a neighbour.
🧠  Challenge
Mini mental or physical challenges. Walk a new route home. Eat somewhere you've never tried. Order something you can't pronounce.
📸  Capture
Document the world. Find something beautiful and photograph it. Spot something funny. Collect a memory.


6.1 Sample Quests per Category
Explore: Find a café you've never entered and order something
Explore: Walk a street you always pass but never turn down
Nature: Sit somewhere with no roof above you for 5 minutes
Nature: Find three different types of plants within 200 metres
Social: Say good morning to someone you don't know
Social: Ask a local shopkeeper for their favourite thing nearby
Challenge: Take a completely different route than usual
Challenge: Eat lunch somewhere you've never been
Capture: Find something beautiful you'd normally walk past
Capture: Photograph a doorway that tells a story

7. XP & Level System
7.1 XP Rewards
Easy quest (1-2 stars)
50–100 XP
Medium quest (3 stars)
100–200 XP
Hard quest (4-5 stars)
200–500 XP
AI-generated quest
+25 XP bonus (rarer = more rewarding)
First quest of the day
+50 XP streak bonus


7.2 Level Thresholds
Level 1 — Wanderer
0 XP  |  All easy quests unlocked
Level 2 — Explorer
300 XP  |  Medium quests unlocked
Level 3 — Adventurer
800 XP  |  Hard quests unlocked
Level 4 — Pathfinder
1,800 XP  |  AI quests unlocked
Level 5 — Trailblazer
3,500 XP  |  Legendary quests unlocked
Level 6–10
Scaling thresholds — prestige titles


7.3 localStorage Schema
{
  "xp": 450,
  "level": 2,
  "completed": [
    { "id": "q_042", "completedAt": "2025-03-20T14:22:00Z", "note": "She recommended the arancini!" }
  ],
  "lastQuestDate": "2025-03-20",
  "streak": 3
}


8. UI Design Language
8.1 Colour Palette
Quest Blue (primary)
#4B7BF5 — CTA buttons, headings, XP bar fill
Adventure Gold (accent)
#F5A623 — XP rewards, level badges, star ratings
Deep Navy (dark bg)
#1A1A2E — dark mode bg, code blocks, quest card backs
Sky Mist (light bg)
#EEF2FF — card surfaces, input backgrounds
Success Green
#22C55E — completion state, 'I did it!' button
Body Text
#333333 — main readable copy


8.2 Typography
Display / Titles
Sora (Google Font) — playful but legible
Body text
Inter — clean, mobile-readable
Code / IDs
JetBrains Mono — quest IDs, debug info


8.3 Key Animations (Framer Motion)
Quest card entry — slides up from bottom with spring physics
Quest card flip — rotateY 180° to reveal quest details
XP bar fill — smooth width animation on completion
Level up — full-screen burst with particle confetti (CSS only)
Category picker — scale + shadow on hover/tap

8.4 Pages
/  (Home)
Hero headline, category grid, 'Get Quest' CTA, player XP summary strip at bottom
/quest
Full-screen quest card — title, description, difficulty stars, XP reward, 'I Did It!' and 'Skip' buttons
/log
Scrollable list of completed quests — date, title, optional note, XP earned
/profile
Level badge, XP bar, title (e.g. 'Explorer'), quest count, category breakdown chart


9. 4-Hour Sprint Plan
This is the execution order for the build. Scope is ruthlessly prioritised — core loop first, polish after.

TIME
PHASE
TASKS
0:00–0:20
Scaffold
npx create-next-app, install Tailwind + Framer Motion, set up folder structure, push to GitHub
0:20–0:45
Backend
FastAPI main.py, quests.json with 30 quests, GET /quest endpoint, deploy to Railway
0:45–1:15
Quest Card UI
QuestCard.tsx component, flip animation, category icons, difficulty stars, XP badge
1:15–1:45
Core Loop
Home page, Get Quest button wired to API, quest display, 'I did it!' completion flow
1:45–2:15
XP System
usePlayer hook, localStorage read/write, XP bar animation, level-up modal
2:15–2:45
Polish Pages
Quest log page, profile page, mobile responsive layout, colour polish
2:45–3:15
AI Quests
Claude API integration in FastAPI, POST /generate, 'Surprise me' button on frontend
3:15–3:40
Final Polish
Loading states, error handling, empty states, SEO meta, favicon, README
3:40–4:00
Ship
Vercel deploy, test on mobile, push final commit, submit form


⚠️  SCOPE RULE
If behind at any checkpoint, drop the AI quest feature first. The core loop (static quests + XP) is the submission. AI is a bonus.


10. Deployment
10.1 Frontend — Vercel
Connect GitHub repo to Vercel
Set NEXT_PUBLIC_API_URL env var to Railway backend URL
Auto-deploys on every push to main

10.2 Backend — Railway
Connect GitHub repo /backend folder to Railway
Set ANTHROPIC_API_KEY env var in Railway dashboard
Start command: uvicorn main:app --host 0.0.0.0 --port $PORT
Railway gives a public HTTPS URL on free tier

10.3 Environment Variables
NEXT_PUBLIC_API_URL
Frontend — URL of the Railway FastAPI backend
ANTHROPIC_API_KEY
Backend — Claude API key for AI quest generation


11. Submission Checklist
Working deployed URL (Vercel)
GitHub repo is public with README
Core loop works end-to-end on mobile
At least 30 quests in the pool
XP and level system persists across sessions
At least one AI-generated quest demonstrable
Submitted via Google Form before March 23 midnight
