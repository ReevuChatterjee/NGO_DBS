"""
Adoptions router — Adoption requests, approval/rejection workflow.
Also manages Adopters as a sub-resource.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from datetime import date

from ..database import get_db
from ..models import Adoption, Adopter, Animal
from ..schemas import (
    AdoptionCreate, AdoptionApprove, AdoptionReject,
    AdoptionResponse, AdopterCreate, AdopterResponse
)

router = APIRouter(prefix="/api", tags=["Adoptions"])


# ── Adopter endpoints ──────────────────────────────────────

@router.get("/adopters", response_model=List[AdopterResponse])
def list_adopters(db: Session = Depends(get_db)):
    """List all registered adopters."""
    return db.query(Adopter).order_by(Adopter.name).all()


@router.post("/adopters", response_model=AdopterResponse, status_code=201)
def create_adopter(adopter_data: AdopterCreate, db: Session = Depends(get_db)):
    """Register a new adopter."""
    existing = db.query(Adopter).filter(Adopter.email == adopter_data.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Adopter with this email already exists")

    adopter = Adopter(**adopter_data.model_dump())
    db.add(adopter)
    db.commit()
    db.refresh(adopter)
    return adopter


# ── Adoption endpoints ─────────────────────────────────────

@router.get("/adoptions", response_model=List[AdoptionResponse])
def list_adoptions(
    status: str = None,
    db: Session = Depends(get_db)
):
    """List all adoptions with animal and adopter details."""
    query = (
        db.query(Adoption)
        .options(joinedload(Adoption.animal), joinedload(Adoption.adopter))
    )
    if status:
        query = query.filter(Adoption.status == status)
    return query.order_by(Adoption.request_date.desc()).all()


@router.post("/adoptions", response_model=AdoptionResponse, status_code=201)
def create_adoption(adoption_data: AdoptionCreate, db: Session = Depends(get_db)):
    """Submit an adoption request. Creates adopter if not exists."""
    # Check animal exists and is available
    animal = db.query(Animal).filter(Animal.animal_id == adoption_data.animal_id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")
    if animal.status not in ("Available", "Rescued"):
        raise HTTPException(status_code=400, detail=f"Animal is not available for adoption (current status: {animal.status})")

    # Check for existing active adoption for this animal
    existing_adoption = (
        db.query(Adoption)
        .filter(
            Adoption.animal_id == adoption_data.animal_id,
            Adoption.status.in_(["Pending", "Approved"])
        )
        .first()
    )
    if existing_adoption:
        raise HTTPException(status_code=409, detail="Animal already has an active adoption request")

    # Find or create adopter
    adopter = db.query(Adopter).filter(Adopter.email == adoption_data.adopter_email).first()
    if not adopter:
        adopter = Adopter(
            name=adoption_data.adopter_name,
            email=adoption_data.adopter_email,
            phone=adoption_data.adopter_phone,
            address=adoption_data.adopter_address,
            id_proof=adoption_data.adopter_id_proof
        )
        db.add(adopter)
        db.flush()  # Get the ID without committing

    adoption = Adoption(
        animal_id=adoption_data.animal_id,
        adopter_id=adopter.adopter_id,
        request_date=date.today(),
        status="Pending",
        notes=adoption_data.notes
    )
    db.add(adoption)
    
    # User requested: when they apply, the animal should disappear from portal, so we mark it as 'Rescued' (Under Evaluation)
    animal = db.query(Animal).filter(Animal.animal_id == adoption_data.animal_id).first()
    if animal:
        animal.status = "Rescued"

    db.commit()
    db.refresh(adoption)

    # Reload with relationships
    adoption = (
        db.query(Adoption)
        .options(joinedload(Adoption.animal), joinedload(Adoption.adopter))
        .filter(Adoption.adoption_id == adoption.adoption_id)
        .first()
    )
    return adoption


@router.patch("/adoptions/{adoption_id}/approve", response_model=AdoptionResponse)
def approve_adoption(
    adoption_id: int,
    data: AdoptionApprove,
    db: Session = Depends(get_db)
):
    """Approve a pending adoption request. Uses transaction for atomicity."""
    adoption = db.query(Adoption).filter(Adoption.adoption_id == adoption_id).first()
    if not adoption:
        raise HTTPException(status_code=404, detail="Adoption not found")
    if adoption.status != "Pending":
        raise HTTPException(status_code=400, detail=f"Cannot approve: adoption is already {adoption.status}")

    try:
        # Update adoption
        adoption.status = "Approved"
        adoption.adoption_date = date.today()
        adoption.reviewed_by = data.reviewed_by
        if data.notes:
            adoption.notes = data.notes

        # Update animal status
        animal = db.query(Animal).filter(Animal.animal_id == adoption.animal_id).first()
        if animal:
            animal.status = "Adopted"

        # Reject other pending adoptions for the same animal
        other_adoptions = (
            db.query(Adoption)
            .filter(
                Adoption.animal_id == adoption.animal_id,
                Adoption.adoption_id != adoption_id,
                Adoption.status == "Pending"
            )
            .all()
        )
        for other in other_adoptions:
            other.status = "Rejected"
            other.reviewed_by = data.reviewed_by
            other.notes = "Auto-rejected: Animal adopted by another applicant."

        db.commit()
        db.refresh(adoption)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Transaction failed: {str(e)}")

    # Reload with relationships
    adoption = (
        db.query(Adoption)
        .options(joinedload(Adoption.animal), joinedload(Adoption.adopter))
        .filter(Adoption.adoption_id == adoption.adoption_id)
        .first()
    )
    return adoption


@router.patch("/adoptions/{adoption_id}/reject", response_model=AdoptionResponse)
def reject_adoption(
    adoption_id: int,
    data: AdoptionReject,
    db: Session = Depends(get_db)
):
    """Reject a pending adoption request."""
    adoption = db.query(Adoption).filter(Adoption.adoption_id == adoption_id).first()
    if not adoption:
        raise HTTPException(status_code=404, detail="Adoption not found")
    if adoption.status != "Pending":
        raise HTTPException(status_code=400, detail=f"Cannot reject: adoption is already {adoption.status}")

    adoption.status = "Rejected"
    adoption.reviewed_by = data.reviewed_by
    if data.notes:
        adoption.notes = data.notes

    # Set animal back to Available if no other pending adoptions
    remaining = (
        db.query(Adoption)
        .filter(
            Adoption.animal_id == adoption.animal_id,
            Adoption.adoption_id != adoption_id,
            Adoption.status.in_(["Pending", "Approved"])
        )
        .count()
    )
    if remaining == 0:
        animal = db.query(Animal).filter(Animal.animal_id == adoption.animal_id).first()
        if animal and animal.status != "Adopted":
            animal.status = "Available"

    db.commit()
    db.refresh(adoption)

    adoption = (
        db.query(Adoption)
        .options(joinedload(Adoption.animal), joinedload(Adoption.adopter))
        .filter(Adoption.adoption_id == adoption.adoption_id)
        .first()
    )
    return adoption
