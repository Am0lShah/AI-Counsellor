from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from config import settings
from routes import auth, onboarding, dashboard, universities, ai_counsellor, todos

# Create FastAPI app
app = FastAPI(
    title="AI Counsellor API",
    description="Backend API for AI-powered study-abroad planning system",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000", "https://claritycounsellor.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(onboarding.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(universities.router, prefix="/api")
app.include_router(ai_counsellor.router, prefix="/api")
app.include_router(todos.router, prefix="/api")


@app.on_event("startup")
def startup_event():
    """Initialize database on startup."""
    init_db()
    print("✅ Database initialized")


@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "AI Counsellor API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
