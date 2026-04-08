"""
Pydantic schemas for request/response validation.
Separate Create, Update, and Response schemas for each entity.
"""
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import date, datetime
from enum import Enum


# ============================================================
# Enums
# ============================================================

class SpeciesEnum(str, Enum):
    Dog = "Dog"
    Cat = "Cat"
    Bird = "Bird"
    Rabbit = "Rabbit"
    Other = "Other"

class AnimalStatusEnum(str, Enum):
    Rescued = "Rescued"
    UnderTreatment = "Under Treatment"
    Available = "Available"
    Adopted = "Adopted"

class GenderEnum(str, Enum):
    Male = "Male"
    Female = "Female"
    Unknown = "Unknown"

class AdoptionStatusEnum(str, Enum):
    Pending = "Pending"
    Approved = "Approved"
    Rejected = "Rejected"

class DonationTypeEnum(str, Enum):
    OneTime = "One-Time"
    Recurring = "Recurring"

class PaymentModeEnum(str, Enum):
    Cash = "Cash"
    UPI = "UPI"
    Card = "Card"
    BankTransfer = "Bank Transfer"

class VolunteerRoleEnum(str, Enum):
    AnimalCare = "Animal Care"
    RescueOps = "Rescue Ops"
    MedicalSupport = "Medical Support"
    Admin = "Admin"

class AvailabilityEnum(str, Enum):
    Weekdays = "Weekdays"
    Weekends = "Weekends"
    Both = "Both"

class RecordTypeEnum(str, Enum):
    Treatment = "Treatment"
    Vaccination = "Vaccination"
    Checkup = "Checkup"
    Surgery = "Surgery"

class AssignmentStatusEnum(str, Enum):
    Active = "Active"
    Completed = "Completed"

class UserRoleEnum(str, Enum):
    Admin = "Admin"
    Staff = "Staff"
    Volunteer = "Volunteer"


# ============================================================
# User / Auth Schemas
# ============================================================

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=1, max_length=100)
    role: UserRoleEnum = UserRoleEnum.Staff

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    user_id: int
    username: str
    full_name: str
    role: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ============================================================
# Animal Schemas
# ============================================================

class AnimalCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    species: SpeciesEnum
    breed: Optional[str] = None
    age: Optional[float] = Field(None, ge=0)
    gender: Optional[GenderEnum] = GenderEnum.Unknown
    health_status: str = Field(..., min_length=1)
    rescue_location: str = Field(..., min_length=1)
    date_rescued: date = Field(default_factory=date.today)
    image_url: Optional[str] = None
    status: AnimalStatusEnum = AnimalStatusEnum.Rescued

class AnimalUpdate(BaseModel):
    name: Optional[str] = None
    species: Optional[SpeciesEnum] = None
    breed: Optional[str] = None
    age: Optional[float] = Field(None, ge=0)
    gender: Optional[GenderEnum] = None
    health_status: Optional[str] = None
    rescue_location: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[AnimalStatusEnum] = None

class AnimalResponse(BaseModel):
    animal_id: int
    name: str
    species: str
    breed: Optional[str] = None
    age: Optional[float] = None
    gender: Optional[str] = None
    health_status: str
    rescue_location: str
    date_rescued: date
    image_url: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============================================================
# Adopter Schemas
# ============================================================

class AdopterCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=15)
    address: str = Field(..., min_length=1)
    id_proof: Optional[str] = None

class AdopterResponse(BaseModel):
    adopter_id: int
    name: str
    email: str
    phone: str
    address: str
    id_proof: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============================================================
# Adoption Schemas
# ============================================================

class AdoptionCreate(BaseModel):
    animal_id: int
    adopter_name: str = Field(..., min_length=1, max_length=100)
    adopter_email: EmailStr
    adopter_phone: str = Field(..., min_length=10, max_length=15)
    adopter_address: str = Field(..., min_length=1)
    adopter_id_proof: Optional[str] = None
    notes: Optional[str] = None

class AdoptionApprove(BaseModel):
    reviewed_by: str = Field(..., min_length=1)
    notes: Optional[str] = None

class AdoptionReject(BaseModel):
    reviewed_by: str = Field(..., min_length=1)
    notes: Optional[str] = None

class AdoptionResponse(BaseModel):
    adoption_id: int
    animal_id: int
    adopter_id: int
    request_date: date
    adoption_date: Optional[date] = None
    status: str
    reviewed_by: Optional[str] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    animal: Optional[AnimalResponse] = None
    adopter: Optional[AdopterResponse] = None

    class Config:
        from_attributes = True


# ============================================================
# Donation Schemas
# ============================================================

class DonationCreate(BaseModel):
    donor_name: str = Field(..., min_length=1, max_length=100)
    donor_email: Optional[EmailStr] = None
    amount: float = Field(..., gt=0)
    donation_date: date = Field(default_factory=date.today)
    donation_type: DonationTypeEnum
    purpose: Optional[str] = None
    payment_mode: PaymentModeEnum

class DonationResponse(BaseModel):
    donation_id: int
    donor_name: str
    donor_email: Optional[str] = None
    amount: float
    donation_date: date
    donation_type: str
    purpose: Optional[str] = None
    payment_mode: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class DonationSummary(BaseModel):
    purpose: str
    total_raised: float
    num_donations: int
    avg_donation: float


# ============================================================
# Volunteer Schemas
# ============================================================

class VolunteerCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=15)
    role: VolunteerRoleEnum
    joined_date: date = Field(default_factory=date.today)
    availability: AvailabilityEnum = AvailabilityEnum.Both

class VolunteerResponse(BaseModel):
    volunteer_id: int
    name: str
    email: str
    phone: str
    role: str
    joined_date: date
    availability: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class VolunteerWithWorkload(VolunteerResponse):
    total_assignments: int = 0
    active_assignments: int = 0


# ============================================================
# Medical Record Schemas
# ============================================================

class MedicalRecordCreate(BaseModel):
    animal_id: int
    treatment: str = Field(..., min_length=1)
    diagnosis: Optional[str] = None
    medication: Optional[str] = None
    vet_name: str = Field(..., min_length=1, max_length=100)
    treatment_date: date = Field(default_factory=date.today)
    follow_up_date: Optional[date] = None
    record_type: RecordTypeEnum

class MedicalRecordResponse(BaseModel):
    record_id: int
    animal_id: int
    treatment: str
    diagnosis: Optional[str] = None
    medication: Optional[str] = None
    vet_name: str
    treatment_date: date
    follow_up_date: Optional[date] = None
    record_type: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============================================================
# Volunteer Assignment Schemas
# ============================================================

class AssignmentCreate(BaseModel):
    volunteer_id: int
    animal_id: int
    task_description: str = Field(..., min_length=1)
    assigned_date: date = Field(default_factory=date.today)
    status: AssignmentStatusEnum = AssignmentStatusEnum.Active

class AssignmentResponse(BaseModel):
    assignment_id: int
    volunteer_id: int
    animal_id: int
    task_description: str
    assigned_date: date
    status: str
    created_at: Optional[datetime] = None
    volunteer: Optional[VolunteerResponse] = None
    animal: Optional[AnimalResponse] = None

    class Config:
        from_attributes = True


# ============================================================
# Dashboard Schemas
# ============================================================

class DashboardStats(BaseModel):
    total_animals: int
    animals_available: int
    animals_adopted: int
    animals_under_treatment: int
    animals_rescued: int
    pending_adoptions: int
    total_donations: float
    total_volunteers: int
    species_breakdown: dict
    recent_animals: List[AnimalResponse]
    monthly_donations: List[dict]
