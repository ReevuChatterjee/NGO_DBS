"""
Dashboard router — Aggregated statistics for the dashboard.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case, extract

from ..database import get_db
from ..models import Animal, Adoption, Donation, Volunteer
from ..schemas import AnimalResponse

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get all dashboard statistics in a single API call."""

    # Animal counts
    total_animals = db.query(func.count(Animal.animal_id)).scalar() or 0
    animals_available = db.query(func.count(Animal.animal_id)).filter(Animal.status == "Available").scalar() or 0
    animals_adopted = db.query(func.count(Animal.animal_id)).filter(Animal.status == "Adopted").scalar() or 0
    animals_under_treatment = db.query(func.count(Animal.animal_id)).filter(Animal.status == "Under Treatment").scalar() or 0
    animals_rescued = db.query(func.count(Animal.animal_id)).filter(Animal.status == "Rescued").scalar() or 0

    # Adoption stats
    pending_adoptions = db.query(func.count(Adoption.adoption_id)).filter(Adoption.status == "Pending").scalar() or 0

    # Donations
    total_donations = db.query(func.sum(Donation.amount)).scalar() or 0

    # Volunteers
    total_volunteers = db.query(func.count(Volunteer.volunteer_id)).scalar() or 0

    # Species breakdown
    species_raw = (
        db.query(Animal.species, func.count(Animal.animal_id))
        .group_by(Animal.species)
        .all()
    )
    species_breakdown = {row[0]: row[1] for row in species_raw}

    # Recent animals (last 5)
    recent = (
        db.query(Animal)
        .order_by(Animal.date_rescued.desc())
        .limit(5)
        .all()
    )

    # Monthly donation totals (last 6 months)
    monthly_donations_raw = (
        db.query(
            func.strftime('%Y-%m', Donation.donation_date).label('month'),
            func.sum(Donation.amount).label('total'),
            func.count().label('count')
        )
        .group_by(func.strftime('%Y-%m', Donation.donation_date))
        .order_by(func.strftime('%Y-%m', Donation.donation_date).desc())
        .limit(6)
        .all()
    )
    monthly_donations = [
        {"month": row.month, "total": float(row.total or 0), "count": row.count}
        for row in monthly_donations_raw
    ]

    return {
        "total_animals": total_animals,
        "animals_available": animals_available,
        "animals_adopted": animals_adopted,
        "animals_under_treatment": animals_under_treatment,
        "animals_rescued": animals_rescued,
        "pending_adoptions": pending_adoptions,
        "total_donations": float(total_donations),
        "total_volunteers": total_volunteers,
        "species_breakdown": species_breakdown,
        "recent_animals": [
            AnimalResponse.model_validate(a) for a in recent
        ],
        "monthly_donations": list(reversed(monthly_donations))
    }
