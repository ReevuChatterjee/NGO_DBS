"""
Animals router — CRUD operations for animal management.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from datetime import date

from ..database import get_db
from ..models import Animal, MedicalRecord
from ..schemas import (
    AnimalCreate, AnimalUpdate, AnimalResponse,
    MedicalRecordResponse
)

router = APIRouter(prefix="/api/animals", tags=["Animals"])


@router.get("", response_model=List[AnimalResponse])
def list_animals(
    status: Optional[str] = Query(None, description="Filter by status"),
    species: Optional[str] = Query(None, description="Filter by species"),
    search: Optional[str] = Query(None, description="Search by name"),
    db: Session = Depends(get_db)
):
    """List all animals with optional filters."""
    query = db.query(Animal)
    if status:
        query = query.filter(Animal.status == status)
    if species:
        query = query.filter(Animal.species == species)
    if search:
        query = query.filter(Animal.name.ilike(f"%{search}%"))
    return query.order_by(Animal.date_rescued.desc()).all()


@router.get("/{animal_id}", response_model=AnimalResponse)
def get_animal(animal_id: int, db: Session = Depends(get_db)):
    """Get a single animal by ID."""
    animal = db.query(Animal).filter(Animal.animal_id == animal_id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")
    return animal


@router.post("", response_model=AnimalResponse, status_code=201)
def create_animal(animal_data: AnimalCreate, db: Session = Depends(get_db)):
    """Register a newly rescued animal."""
    animal = Animal(
        name=animal_data.name,
        species=animal_data.species.value,
        breed=animal_data.breed,
        age=animal_data.age,
        gender=animal_data.gender.value if animal_data.gender else "Unknown",
        health_status=animal_data.health_status,
        rescue_location=animal_data.rescue_location,
        date_rescued=animal_data.date_rescued,
        image_url=animal_data.image_url,
        status=animal_data.status.value
    )
    db.add(animal)
    db.commit()
    db.refresh(animal)
    return animal


@router.put("/{animal_id}", response_model=AnimalResponse)
def update_animal(animal_id: int, animal_data: AnimalUpdate, db: Session = Depends(get_db)):
    """Update an existing animal's details."""
    animal = db.query(Animal).filter(Animal.animal_id == animal_id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    update_data = animal_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:
            # Handle enum values
            if hasattr(value, 'value'):
                value = value.value
            setattr(animal, key, value)

    db.commit()
    db.refresh(animal)
    return animal


@router.delete("/{animal_id}", status_code=204)
def delete_animal(animal_id: int, db: Session = Depends(get_db)):
    """Delete an animal record."""
    animal = db.query(Animal).filter(Animal.animal_id == animal_id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    try:
        db.delete(animal)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Cannot delete animal with active adoption requests"
        )


@router.get("/{animal_id}/medical", response_model=List[MedicalRecordResponse])
def get_medical_history(animal_id: int, db: Session = Depends(get_db)):
    """Get full medical history for a specific animal."""
    animal = db.query(Animal).filter(Animal.animal_id == animal_id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    records = (
        db.query(MedicalRecord)
        .filter(MedicalRecord.animal_id == animal_id)
        .order_by(MedicalRecord.treatment_date.desc())
        .all()
    )
    return records
