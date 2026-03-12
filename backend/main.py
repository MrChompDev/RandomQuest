from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.quests import router as quests_router
from routes.generate import router as generate_router
from routes.categories import router as categories_router

app = FastAPI(title="Random Quest API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-url.vercel.app"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Include routers
app.include_router(quests_router, prefix="/api")
app.include_router(generate_router, prefix="/api")
app.include_router(categories_router, prefix="/api")

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
