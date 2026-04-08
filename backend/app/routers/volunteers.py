"""
Volunteers router — Registration and assignment management.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List

from ..database import get_db
from ..models import Volunteer, VolunteerAssignment, Animal
from ..schemas import (
    VolunteerCreate, VolunteerResponse, VolunteerWithWorkload,
    AssignmentCreate, AssignmentResponse
)

router = APIRouter(prefix="/api/volunteers", tags=["Volunteers"])


@router.get("", response_model=List[VolunteerWithWorkload])
def list_volunteers(db: Session = Depends(get_db)):
    """List all volunteers with their workload counts."""
    volunteers = db.query(Volunteer).order_by(Volunteer.name).all()
    result = []
    for v in volunteers:
        total = db.query(VolunteerAssignment).filter(
            VolunteerAssignment.volunteer_id == v.volunteer_id
        ).count()
        active = db.query(VolunteerAssignment).filter(
            VolunteerAssignment.volunteer_id == v.volunteer_id,
            VolunteerAssignment.status == "Active"
        ).count()
        vol_data = VolunteerWithWorkload(
            volunteer_id=v.volunteer_id,
            name=v.name,
            email=v.email,
            phone=v.phone,
            role=v.role,
            joined_date=v.joined_date,
            availability=v.availability,
            created_at=v.created_at,
            total_assignments=total,
            active_assignments=active
        )
        result.append(vol_data)
    return result


@router.post("", response_model=VolunteerResponse, status_code=201)
def create_volunteer(vol_data: VolunteerCreate, db: Session = Depends(get_db)):
    """Register a new volunteer."""
    existing = db.query(Volunteer).filter(Volunteer.email == vol_data.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Volunteer with this email already exists")

    volunteer = Volunteer(
        name=vol_data.name,
        email=vol_data.email,
        phone=vol_data.phone,
        role=vol_data.role.value,
        joined_date=vol_data.joined_date,
        availability=vol_data.availability.value
    )
    db.add(volunteer)
    db.commit()
    db.refresh(volunteer)
    return volunteer


@router.get("/{volunteer_id}/assignments", response_model=List[AssignmentResponse])
def get_assignments(volunteer_id: int, db: Session = Depends(get_db)):
    """Get all assignments for a specific volunteer."""
    volunteer = db.query(Volunteer).filter(Volunteer.volunteer_id == volunteer_id).first()
    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    assignments = (
        db.query(VolunteerAssignment)
        .options(joinedload(VolunteerAssignment.animal))
        .filter(VolunteerAssignment.volunteer_id == volunteer_id)
        .order_by(VolunteerAssignment.assigned_date.desc())
        .all()
    )
    return assignments


@router.post("/assign", response_model=AssignmentResponse, status_code=201)
def create_assignment(data: AssignmentCreate, db: Session = Depends(get_db)):
    """Assign a volunteer to an animal."""
    # Validate volunteer exists
    volunteer = db.query(Volunteer).filter(Volunteer.volunteer_id == data.volunteer_id).first()
    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    # Validate animal exists
    animal = db.query(Animal).filter(Animal.animal_id == data.animal_id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    # Check for duplicate assignment
    existing = (
        db.query(VolunteerAssignment)
        .filter(
            VolunteerAssignment.volunteer_id == data.volunteer_id,
            VolunteerAssignment.animal_id == data.animal_id,
            VolunteerAssignment.assigned_date == data.assigned_date
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail="This assignment already exists")

    assignment = VolunteerAssignment(
        volunteer_id=data.volunteer_id,
        animal_id=data.animal_id,
        task_description=data.task_description,
        assigned_date=data.assigned_date,
        status=data.status.value
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    # Reload with relationships
    assignment = (
        db.query(VolunteerAssignment)
        .options(
            joinedload(VolunteerAssignment.volunteer),
            joinedload(VolunteerAssignment.animal)
        )
        .filter(VolunteerAssignment.assignment_id == assignment.assignment_id)
        .first()
    )
    return assignment


@router.patch("/assignments/{assignment_id}/complete", response_model=AssignmentResponse)
def complete_assignment(assignment_id: int, db: Session = Depends(get_db)):
    """Mark an assignment as completed."""
    assignment = db.query(VolunteerAssignment).filter(
        VolunteerAssignment.assignment_id == assignment_id
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    assignment.status = "Completed"
    db.commit()
    db.refresh(assignment)
    return assignment
