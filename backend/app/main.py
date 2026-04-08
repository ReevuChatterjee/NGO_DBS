"""
Animal Welfare NGO Management System — FastAPI Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .database import engine, Base
from .models import (
    User, Animal, Adopter, Adoption,
    Donation, Volunteer, MedicalRecord, VolunteerAssignment
)
from .routers import auth, animals, adoptions, donations, volunteers, medical, dashboard

load_dotenv()

app = FastAPI(
    title="Animal Welfare NGO Management System",
    description="Full-stack management system for animal rescue, adoption, donations, and volunteer coordination.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS — allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(animals.router)
app.include_router(adoptions.router)
app.include_router(donations.router)
app.include_router(volunteers.router)
app.include_router(medical.router)
app.include_router(dashboard.router)


@app.on_event("startup")
def startup_event():
    """Create all tables on startup."""
    Base.metadata.create_all(bind=engine)


@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "app": "Animal Welfare NGO Management System",
        "version": "1.0.0"
    }


@app.get("/api/health", tags=["Health"])
def api_health():
    return {"status": "ok"}
