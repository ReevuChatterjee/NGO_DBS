"""
SQLAlchemy ORM Models for Animal Welfare NGO.
8 tables: Users, Animals, Adopters, Adoptions, Donations,
          Volunteers, Medical_Records, Volunteer_Assignments
"""
from sqlalchemy import (
    Column, Integer, String, Text, Date, DateTime, Float,
    ForeignKey, UniqueConstraint, CheckConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(20), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    __table_args__ = (
        CheckConstraint("role IN ('Admin', 'Staff', 'Volunteer')", name="ck_user_role"),
    )


class Animal(Base):
    __tablename__ = "animals"

    animal_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    species = Column(String(20), nullable=False)
    breed = Column(String(100))
    age = Column(Float)
    gender = Column(String(10))
    health_status = Column(String(255), nullable=False)
    rescue_location = Column(String(255), nullable=False)
    date_rescued = Column(Date, nullable=False)
    image_url = Column(String(500))
    status = Column(String(20), default="Rescued")
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    medical_records = relationship("MedicalRecord", back_populates="animal", cascade="all, delete-orphan")
    adoptions = relationship("Adoption", back_populates="animal")
    volunteer_assignments = relationship("VolunteerAssignment", back_populates="animal", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint("species IN ('Dog', 'Cat', 'Bird', 'Rabbit', 'Other')", name="ck_animal_species"),
        CheckConstraint("gender IN ('Male', 'Female', 'Unknown')", name="ck_animal_gender"),
        CheckConstraint("status IN ('Rescued', 'Under Treatment', 'Available', 'Adopted')", name="ck_animal_status"),
        CheckConstraint("age >= 0", name="ck_animal_age"),
    )


class Adopter(Base):
    __tablename__ = "adopters"

    adopter_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    phone = Column(String(15), nullable=False)
    address = Column(Text, nullable=False)
    id_proof = Column(String(100))
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    adoptions = relationship("Adoption", back_populates="adopter")


class Adoption(Base):
    __tablename__ = "adoptions"

    adoption_id = Column(Integer, primary_key=True, autoincrement=True)
    animal_id = Column(Integer, ForeignKey("animals.animal_id"), nullable=False)
    adopter_id = Column(Integer, ForeignKey("adopters.adopter_id"), nullable=False)
    request_date = Column(Date, nullable=False)
    adoption_date = Column(Date)
    status = Column(String(20), default="Pending")
    reviewed_by = Column(String(100))
    notes = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    animal = relationship("Animal", back_populates="adoptions")
    adopter = relationship("Adopter", back_populates="adoptions")

    __table_args__ = (
        CheckConstraint("status IN ('Pending', 'Approved', 'Rejected')", name="ck_adoption_status"),
    )


class Donation(Base):
    __tablename__ = "donations"

    donation_id = Column(Integer, primary_key=True, autoincrement=True)
    donor_name = Column(String(100), nullable=False)
    donor_email = Column(String(150))
    amount = Column(Float, nullable=False)
    donation_date = Column(Date, nullable=False)
    donation_type = Column(String(20), nullable=False)
    purpose = Column(String(255))
    payment_mode = Column(String(20), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    __table_args__ = (
        CheckConstraint("amount > 0", name="ck_donation_amount"),
        CheckConstraint("donation_type IN ('One-Time', 'Recurring')", name="ck_donation_type"),
        CheckConstraint("payment_mode IN ('Cash', 'UPI', 'Card', 'Bank Transfer')", name="ck_payment_mode"),
    )


class Volunteer(Base):
    __tablename__ = "volunteers"

    volunteer_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    phone = Column(String(15), nullable=False)
    role = Column(String(20), nullable=False)
    joined_date = Column(Date, nullable=False)
    availability = Column(String(20), default="Both")
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    assignments = relationship("VolunteerAssignment", back_populates="volunteer", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint("role IN ('Animal Care', 'Rescue Ops', 'Medical Support', 'Admin')", name="ck_volunteer_role"),
        CheckConstraint("availability IN ('Weekdays', 'Weekends', 'Both')", name="ck_volunteer_availability"),
    )


class MedicalRecord(Base):
    __tablename__ = "medical_records"

    record_id = Column(Integer, primary_key=True, autoincrement=True)
    animal_id = Column(Integer, ForeignKey("animals.animal_id", ondelete="CASCADE"), nullable=False)
    treatment = Column(Text, nullable=False)
    diagnosis = Column(String(255))
    medication = Column(String(255))
    vet_name = Column(String(100), nullable=False)
    treatment_date = Column(Date, nullable=False)
    follow_up_date = Column(Date)
    record_type = Column(String(20), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    animal = relationship("Animal", back_populates="medical_records")

    __table_args__ = (
        CheckConstraint("record_type IN ('Treatment', 'Vaccination', 'Checkup', 'Surgery')", name="ck_record_type"),
    )


class VolunteerAssignment(Base):
    __tablename__ = "volunteer_assignments"

    assignment_id = Column(Integer, primary_key=True, autoincrement=True)
    volunteer_id = Column(Integer, ForeignKey("volunteers.volunteer_id", ondelete="CASCADE"), nullable=False)
    animal_id = Column(Integer, ForeignKey("animals.animal_id", ondelete="CASCADE"), nullable=False)
    task_description = Column(Text, nullable=False)
    assigned_date = Column(Date, nullable=False)
    status = Column(String(20), default="Active")
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    volunteer = relationship("Volunteer", back_populates="assignments")
    animal = relationship("Animal", back_populates="volunteer_assignments")

    __table_args__ = (
        UniqueConstraint("volunteer_id", "animal_id", "assigned_date", name="uq_volunteer_animal_date"),
        CheckConstraint("status IN ('Active', 'Completed')", name="ck_assignment_status"),
    )
