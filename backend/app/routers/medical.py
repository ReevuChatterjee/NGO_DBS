"""
Medical Records router — Add and view medical records per animal.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import MedicalRecord, Animal
from ..schemas import MedicalRecordCreate, MedicalRecordResponse

router = APIRouter(prefix="/api/medical", tags=["Medical Records"])


@router.get("", response_model=List[MedicalRecordResponse])
def list_all_records(db: Session = Depends(get_db)):
    """List all medical records."""
    return (
        db.query(MedicalRecord)
        .order_by(MedicalRecord.treatment_date.desc())
        .all()
    )


@router.get("/{animal_id}", response_model=List[MedicalRecordResponse])
def get_animal_records(animal_id: int, db: Session = Depends(get_db)):
    """Get medical history for a specific animal."""
    animal = db.query(Animal).filter(Animal.animal_id == animal_id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    return (
        db.query(MedicalRecord)
        .filter(MedicalRecord.animal_id == animal_id)
        .order_by(MedicalRecord.treatment_date.desc())
        .all()
    )


@router.post("", response_model=MedicalRecordResponse, status_code=201)
def create_record(record_data: MedicalRecordCreate, db: Session = Depends(get_db)):
    """Add a new medical record for an animal."""
    animal = db.query(Animal).filter(Animal.animal_id == record_data.animal_id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    record = MedicalRecord(
        animal_id=record_data.animal_id,
        treatment=record_data.treatment,
        diagnosis=record_data.diagnosis,
        medication=record_data.medication,
        vet_name=record_data.vet_name,
        treatment_date=record_data.treatment_date,
        follow_up_date=record_data.follow_up_date,
        record_type=record_data.record_type.value
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record
