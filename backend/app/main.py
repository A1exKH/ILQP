from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from app.database import connect_to_mongo, close_mongo_connection
from app.routers import decks, attempts, analytics

app = FastAPI(title="ILQP API", version="1.0.0")

# Restrict CORS to your Vercel production frontend and local dev environments
origins = [
    "https://ilqp.vercel.app",
    "http://localhost:5173",  # For local Vite development
    "http://localhost:3000",  # Alternative local port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup and Shutdown event handlers
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Include Routers
app.include_router(decks.router, prefix="/api/decks", tags=["Decks"])
app.include_router(attempts.router, prefix="/api/attempts", tags=["Attempts"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Interactive Learning & Quiz Platform API!"}