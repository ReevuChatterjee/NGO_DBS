"""
Donations router — Record and query donations.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List

from ..database import get_db
from ..models import Donation
from ..schemas import DonationCreate, DonationResponse, DonationSummary

router = APIRouter(prefix="/api/donations", tags=["Donations"])


@router.get("", response_model=List[DonationResponse])
def list_donations(
    donation_type: Optional[str] = Query(None),
    payment_mode: Optional[str] = Query(None),
    purpose: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """List all donations with optional filters."""
    query = db.query(Donation)
    if donation_type:
        query = query.filter(Donation.donation_type == donation_type)
    if payment_mode:
        query = query.filter(Donation.payment_mode == payment_mode)
    if purpose:
        query = query.filter(Donation.purpose == purpose)
    return query.order_by(Donation.donation_date.desc()).all()


@router.post("", response_model=DonationResponse, status_code=201)
def create_donation(donation_data: DonationCreate, db: Session = Depends(get_db)):
    """Record a new donation."""
    donation = Donation(
        donor_name=donation_data.donor_name,
        donor_email=donation_data.donor_email,
        amount=donation_data.amount,
        donation_date=donation_data.donation_date,
        donation_type=donation_data.donation_type.value,
        purpose=donation_data.purpose,
        payment_mode=donation_data.payment_mode.value
    )
    db.add(donation)
    db.commit()
    db.refresh(donation)
    return donation


@router.get("/summary")
def donation_summary(db: Session = Depends(get_db)):
    """Get aggregated donation statistics by purpose and type."""
    # By purpose
    by_purpose = (
        db.query(
            func.coalesce(Donation.purpose, "General").label("purpose"),
            func.sum(Donation.amount).label("total_raised"),
            func.count().label("num_donations"),
            func.avg(Donation.amount).label("avg_donation")
        )
        .group_by(Donation.purpose)
        .all()
    )

    # By type
    by_type = (
        db.query(
            Donation.donation_type,
            func.sum(Donation.amount).label("total"),
            func.count().label("count")
        )
        .group_by(Donation.donation_type)
        .all()
    )

    # By payment mode
    by_payment = (
        db.query(
            Donation.payment_mode,
            func.sum(Donation.amount).label("total"),
            func.count().label("count")
        )
        .group_by(Donation.payment_mode)
        .all()
    )

    # Grand total
    total = db.query(func.sum(Donation.amount)).scalar() or 0

    return {
        "total_raised": float(total),
        "by_purpose": [
            {
                "purpose": row.purpose,
                "total_raised": float(row.total_raised or 0),
                "num_donations": row.num_donations,
                "avg_donation": round(float(row.avg_donation or 0), 2)
            }
            for row in by_purpose
        ],
        "by_type": [
            {
                "donation_type": row.donation_type,
                "total": float(row.total or 0),
                "count": row.count
            }
            for row in by_type
        ],
        "by_payment_mode": [
            {
                "payment_mode": row.payment_mode,
                "total": float(row.total or 0),
                "count": row.count
            }
            for row in by_payment
        ]
    }
