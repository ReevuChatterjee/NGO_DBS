"""
Seed the database with sample data.
Run this script after starting the backend to populate with test data.
Usage: python seed_data.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import date
from app.database import SessionLocal, engine, Base
from app.models import (
    User, Animal, Adopter, Adoption,
    Donation, Volunteer, MedicalRecord, VolunteerAssignment
)
from app.auth import get_password_hash


def seed():
    # Create tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).count() > 0:
            print("Database already has data. Skipping seed.")
            return

        print("Seeding database...")

        # ── Users ──────────────────────────────────────────────
        users = [
            User(username="admin", password_hash=get_password_hash("admin123"),
                 full_name="System Administrator", role="Admin"),
            User(username="staff1", password_hash=get_password_hash("staff123"),
                 full_name="Rahul Verma", role="Staff"),
            User(username="volunteer1", password_hash=get_password_hash("vol123"),
                 full_name="Sneha Patel", role="Volunteer"),
        ]
        db.add_all(users)
        db.flush()
        print(f"  ✓ {len(users)} users created")

        # ── Animals ────────────────────────────────────────────
        animals = [
            Animal(name="Bruno", species="Dog", breed="German Shepherd", age=3.0, gender="Male",
                   health_status="Healthy", rescue_location="Indiranagar, Bangalore",
                   date_rescued=date(2025, 1, 15), status="Available"),
            Animal(name="Mimi", species="Cat", breed="Persian", age=2.5, gender="Female",
                   health_status="Healthy", rescue_location="Koramangala, Bangalore",
                   date_rescued=date(2025, 2, 10), status="Available"),
            Animal(name="Rocky", species="Dog", breed="Indie", age=4.0, gender="Male",
                   health_status="Under observation for skin allergy", rescue_location="MG Road, Bangalore",
                   date_rescued=date(2025, 2, 20), status="Under Treatment"),
            Animal(name="Cleo", species="Cat", breed="Siamese", age=1.5, gender="Female",
                   health_status="Recovering from malnutrition", rescue_location="HSR Layout, Bangalore",
                   date_rescued=date(2025, 3, 1), status="Under Treatment"),
            Animal(name="Kiwi", species="Bird", breed="Budgerigar", age=1.0, gender="Male",
                   health_status="Healthy", rescue_location="Jayanagar, Bangalore",
                   date_rescued=date(2025, 3, 5), status="Available"),
            Animal(name="Thumper", species="Rabbit", breed="Holland Lop", age=2.0, gender="Female",
                   health_status="Healthy", rescue_location="Whitefield, Bangalore",
                   date_rescued=date(2025, 3, 10), status="Available"),
            Animal(name="Max", species="Dog", breed="Golden Retriever", age=5.0, gender="Male",
                   health_status="Healthy - recovered from injury", rescue_location="Electronic City, Bangalore",
                   date_rescued=date(2024, 11, 20), status="Adopted"),
            Animal(name="Whiskers", species="Cat", breed="Maine Coon", age=3.0, gender="Male",
                   health_status="Healthy", rescue_location="Marathahalli, Bangalore",
                   date_rescued=date(2025, 1, 25), status="Available"),
            Animal(name="Daisy", species="Dog", breed="Beagle", age=2.0, gender="Female",
                   health_status="Healthy", rescue_location="JP Nagar, Bangalore",
                   date_rescued=date(2025, 3, 15), status="Available"),
            Animal(name="Polly", species="Bird", breed="Cockatiel", age=2.5, gender="Female",
                   health_status="Wing injury - healing", rescue_location="BTM Layout, Bangalore",
                   date_rescued=date(2025, 3, 20), status="Under Treatment"),
            Animal(name="Simba", species="Cat", breed="Indie", age=1.0, gender="Male",
                   health_status="Healthy", rescue_location="Yelahanka, Bangalore",
                   date_rescued=date(2025, 4, 1), status="Rescued"),
            Animal(name="Luna", species="Dog", breed="Labrador", age=1.5, gender="Female",
                   health_status="Healthy", rescue_location="Hebbal, Bangalore",
                   date_rescued=date(2025, 4, 2), status="Available"),
            Animal(name="Pepper", species="Cat", breed="Bengal", age=2.0, gender="Male",
                   health_status="Mild eye infection", rescue_location="Rajajinagar, Bangalore",
                   date_rescued=date(2025, 4, 3), status="Under Treatment"),
            Animal(name="Oreo", species="Rabbit", breed="Netherland Dwarf", age=1.0, gender="Male",
                   health_status="Healthy", rescue_location="Malleshwaram, Bangalore",
                   date_rescued=date(2025, 4, 4), status="Available"),
            Animal(name="Charlie", species="Dog", breed="Pomeranian", age=6.0, gender="Male",
                   health_status="Dental issues", rescue_location="Basavanagudi, Bangalore",
                   date_rescued=date(2025, 4, 5), status="Under Treatment"),
            Animal(name="Nemo", species="Other", breed="Turtle", age=5.0, gender="Unknown",
                   health_status="Healthy", rescue_location="Cubbon Park, Bangalore",
                   date_rescued=date(2025, 3, 25), status="Available"),
        ]
        db.add_all(animals)
        db.flush()
        print(f"  ✓ {len(animals)} animals created")

        # ── Adopters ───────────────────────────────────────────
        adopters = [
            Adopter(name="Arjun Mehta", email="arjun.mehta@email.com", phone="9876543210",
                    address="42, 3rd Cross, Indiranagar, Bangalore 560038", id_proof="Aadhaar - XXXX-XXXX-1234"),
            Adopter(name="Priya Krishnan", email="priya.k@email.com", phone="9876543211",
                    address="15, 1st Main, Koramangala 4th Block, Bangalore 560034", id_proof="Aadhaar - XXXX-XXXX-5678"),
            Adopter(name="Vikram Singh", email="vikram.s@email.com", phone="9876543212",
                    address="88, 2nd Floor, HSR Layout Sector 2, Bangalore 560102", id_proof="PAN - ABCDE1234F"),
            Adopter(name="Ananya Iyer", email="ananya.i@email.com", phone="9876543213",
                    address="7, Lake View Apts, JP Nagar 5th Phase, Bangalore 560078", id_proof="Aadhaar - XXXX-XXXX-9012"),
            Adopter(name="Rohan Gupta", email="rohan.g@email.com", phone="9876543214",
                    address="23, Palm Grove, Whitefield Main Road, Bangalore 560066", id_proof="DL - KA01-2023-XXXXX"),
            Adopter(name="Deepika Nair", email="deepika.n@email.com", phone="9876543215",
                    address="55, Green Park, Yelahanka New Town, Bangalore 560064", id_proof="Aadhaar - XXXX-XXXX-3456"),
            Adopter(name="Karthik Reddy", email="karthik.r@email.com", phone="9876543216",
                    address="101, Maple Street, Electronic City Phase 1, Bangalore 560100", id_proof="PAN - FGHIJ5678K"),
            Adopter(name="Meera Sharma", email="meera.s@email.com", phone="9876543217",
                    address="33, Rose Garden, Hebbal, Bangalore 560024", id_proof="Aadhaar - XXXX-XXXX-7890"),
        ]
        db.add_all(adopters)
        db.flush()
        print(f"  ✓ {len(adopters)} adopters created")

        # ── Adoptions ──────────────────────────────────────────
        adoptions = [
            Adoption(animal_id=7, adopter_id=1, request_date=date(2024, 12, 15),
                     adoption_date=date(2024, 12, 20), status="Approved",
                     reviewed_by="System Administrator", notes="Home visit completed successfully."),
            Adoption(animal_id=1, adopter_id=2, request_date=date(2025, 4, 1),
                     status="Pending", notes="Applicant has prior pet ownership experience."),
            Adoption(animal_id=2, adopter_id=3, request_date=date(2025, 4, 2),
                     status="Pending", notes="Lives in a cat-friendly apartment."),
            Adoption(animal_id=6, adopter_id=5, request_date=date(2025, 4, 3),
                     status="Pending", notes="First-time rabbit owner, needs orientation."),
            Adoption(animal_id=9, adopter_id=6, request_date=date(2025, 4, 4),
                     status="Pending"),
        ]
        db.add_all(adoptions)
        db.flush()
        print(f"  ✓ {len(adoptions)} adoptions created")

        # ── Donations ──────────────────────────────────────────
        donations = [
            Donation(donor_name="Rajesh Kumar", donor_email="rajesh.k@email.com", amount=5000.00,
                     donation_date=date(2025, 1, 10), donation_type="One-Time", purpose="Medical", payment_mode="UPI"),
            Donation(donor_name="Sunita Devi", donor_email="sunita.d@email.com", amount=2000.00,
                     donation_date=date(2025, 1, 15), donation_type="Recurring", purpose="Food", payment_mode="Bank Transfer"),
            Donation(donor_name="TechCorp Foundation", donor_email="csr@techcorp.com", amount=50000.00,
                     donation_date=date(2025, 2, 1), donation_type="One-Time", purpose="Shelter", payment_mode="Bank Transfer"),
            Donation(donor_name="Amit Joshi", donor_email="amit.j@email.com", amount=1000.00,
                     donation_date=date(2025, 2, 14), donation_type="One-Time", purpose="Medical", payment_mode="UPI"),
            Donation(donor_name="Priya Krishnan", donor_email="priya.k@email.com", amount=3000.00,
                     donation_date=date(2025, 2, 20), donation_type="Recurring", purpose="Food", payment_mode="Card"),
            Donation(donor_name="Nandini Rao", donor_email="nandini.r@email.com", amount=1500.00,
                     donation_date=date(2025, 3, 1), donation_type="One-Time", purpose="Medical", payment_mode="UPI"),
            Donation(donor_name="Anonymous", amount=10000.00,
                     donation_date=date(2025, 3, 5), donation_type="One-Time", purpose="Shelter", payment_mode="Cash"),
            Donation(donor_name="Vikram Singh", donor_email="vikram.s@email.com", amount=2500.00,
                     donation_date=date(2025, 3, 10), donation_type="Recurring", purpose="Food", payment_mode="Card"),
            Donation(donor_name="Green Earth Trust", donor_email="info@greenearth.org", amount=25000.00,
                     donation_date=date(2025, 3, 15), donation_type="One-Time", purpose="Shelter", payment_mode="Bank Transfer"),
            Donation(donor_name="Sneha Patel", donor_email="sneha.p@email.com", amount=500.00,
                     donation_date=date(2025, 3, 20), donation_type="One-Time", purpose="Medical", payment_mode="UPI"),
            Donation(donor_name="Arjun Mehta", donor_email="arjun.m@email.com", amount=7500.00,
                     donation_date=date(2025, 4, 1), donation_type="Recurring", purpose="Food", payment_mode="Bank Transfer"),
            Donation(donor_name="Deepika Nair", donor_email="deepika.n@email.com", amount=2000.00,
                     donation_date=date(2025, 4, 5), donation_type="One-Time", purpose="Medical", payment_mode="UPI"),
            Donation(donor_name="Karthik Reddy", donor_email="karthik.r@email.com", amount=3500.00,
                     donation_date=date(2025, 4, 6), donation_type="One-Time", purpose="Shelter", payment_mode="Card"),
        ]
        db.add_all(donations)
        db.flush()
        print(f"  ✓ {len(donations)} donations created")

        # ── Volunteers ─────────────────────────────────────────
        volunteers_data = [
            Volunteer(name="Sneha Patel", email="sneha.volunteer@email.com", phone="9988776601",
                      role="Animal Care", joined_date=date(2024, 6, 15), availability="Weekends"),
            Volunteer(name="Rahul Sharma", email="rahul.volunteer@email.com", phone="9988776602",
                      role="Rescue Ops", joined_date=date(2024, 8, 1), availability="Both"),
            Volunteer(name="Divya Menon", email="divya.volunteer@email.com", phone="9988776603",
                      role="Medical Support", joined_date=date(2024, 10, 20), availability="Weekdays"),
            Volunteer(name="Aakash Jain", email="aakash.volunteer@email.com", phone="9988776604",
                      role="Animal Care", joined_date=date(2025, 1, 10), availability="Weekends"),
            Volunteer(name="Kavitha Rangan", email="kavitha.volunteer@email.com", phone="9988776605",
                      role="Admin", joined_date=date(2024, 3, 1), availability="Weekdays"),
            Volunteer(name="Farhan Sheikh", email="farhan.volunteer@email.com", phone="9988776606",
                      role="Rescue Ops", joined_date=date(2025, 2, 15), availability="Both"),
        ]
        db.add_all(volunteers_data)
        db.flush()
        print(f"  ✓ {len(volunteers_data)} volunteers created")

        # ── Medical Records ────────────────────────────────────
        medical_records = [
            MedicalRecord(animal_id=1, treatment="General checkup and vaccinations", diagnosis="Healthy",
                          medication="Rabies vaccine, DHPP", vet_name="Dr. Sanjay Kumar",
                          treatment_date=date(2025, 1, 20), follow_up_date=date(2025, 7, 20), record_type="Vaccination"),
            MedicalRecord(animal_id=1, treatment="Routine health assessment", diagnosis="Healthy - fit for adoption",
                          vet_name="Dr. Sanjay Kumar", treatment_date=date(2025, 3, 15), record_type="Checkup"),
            MedicalRecord(animal_id=2, treatment="Deworming and vaccination", diagnosis="Mild worm infestation",
                          medication="Praziquantel, FVRCP vaccine", vet_name="Dr. Meera Nair",
                          treatment_date=date(2025, 2, 15), follow_up_date=date(2025, 3, 15), record_type="Treatment"),
            MedicalRecord(animal_id=3, treatment="Skin allergy treatment", diagnosis="Dermatitis - fungal",
                          medication="Ketoconazole shampoo, Cetirizine", vet_name="Dr. Sanjay Kumar",
                          treatment_date=date(2025, 2, 25), follow_up_date=date(2025, 3, 25), record_type="Treatment"),
            MedicalRecord(animal_id=4, treatment="Nutritional support and IV fluids", diagnosis="Severe malnutrition",
                          medication="Multivitamins, Iron supplements", vet_name="Dr. Priya Sharma",
                          treatment_date=date(2025, 3, 2), follow_up_date=date(2025, 3, 16), record_type="Treatment"),
            MedicalRecord(animal_id=7, treatment="Leg injury treatment", diagnosis="Fractured right foreleg",
                          medication="Meloxicam, Splint applied", vet_name="Dr. Priya Sharma",
                          treatment_date=date(2024, 11, 22), follow_up_date=date(2024, 12, 22), record_type="Surgery"),
            MedicalRecord(animal_id=10, treatment="Wing injury assessment", diagnosis="Partial wing fracture",
                          medication="Anti-inflammatory, Rest", vet_name="Dr. Meera Nair",
                          treatment_date=date(2025, 3, 21), follow_up_date=date(2025, 4, 21), record_type="Treatment"),
            MedicalRecord(animal_id=13, treatment="Eye infection treatment", diagnosis="Conjunctivitis",
                          medication="Tobramycin eye drops", vet_name="Dr. Sanjay Kumar",
                          treatment_date=date(2025, 4, 4), follow_up_date=date(2025, 4, 11), record_type="Treatment"),
            MedicalRecord(animal_id=15, treatment="Dental checkup", diagnosis="Periodontal disease stage 2",
                          medication="Dental cleaning scheduled", vet_name="Dr. Meera Nair",
                          treatment_date=date(2025, 4, 6), follow_up_date=date(2025, 4, 20), record_type="Checkup"),
        ]
        db.add_all(medical_records)
        db.flush()
        print(f"  ✓ {len(medical_records)} medical records created")

        # ── Volunteer Assignments ──────────────────────────────
        assignments = [
            VolunteerAssignment(volunteer_id=1, animal_id=1, task_description="Daily feeding and exercise for Bruno",
                                assigned_date=date(2025, 3, 1), status="Active"),
            VolunteerAssignment(volunteer_id=1, animal_id=2, task_description="Daily feeding for Mimi",
                                assigned_date=date(2025, 3, 1), status="Active"),
            VolunteerAssignment(volunteer_id=2, animal_id=3, task_description="Monitor Rocky's skin condition",
                                assigned_date=date(2025, 3, 1), status="Active"),
            VolunteerAssignment(volunteer_id=3, animal_id=4, task_description="Administer supplements to Cleo",
                                assigned_date=date(2025, 3, 5), status="Active"),
            VolunteerAssignment(volunteer_id=3, animal_id=10, task_description="Monitor Polly's wing recovery",
                                assigned_date=date(2025, 3, 22), status="Active"),
            VolunteerAssignment(volunteer_id=4, animal_id=9, task_description="Exercise and socialization for Daisy",
                                assigned_date=date(2025, 3, 20), status="Active"),
            VolunteerAssignment(volunteer_id=2, animal_id=7, task_description="Post-surgery physiotherapy for Max",
                                assigned_date=date(2024, 12, 1), status="Completed"),
            VolunteerAssignment(volunteer_id=6, animal_id=11, task_description="Initial assessment for Simba",
                                assigned_date=date(2025, 4, 1), status="Active"),
            VolunteerAssignment(volunteer_id=4, animal_id=12, task_description="Daily walks for Luna",
                                assigned_date=date(2025, 4, 3), status="Active"),
        ]
        db.add_all(assignments)
        db.flush()
        print(f"  ✓ {len(assignments)} volunteer assignments created")

        db.commit()
        print("\n✅ Database seeded successfully!")
        print(f"   Login credentials:")
        print(f"   Admin:     admin / admin123")
        print(f"   Staff:     staff1 / staff123")
        print(f"   Volunteer: volunteer1 / vol123")

    except Exception as e:
        db.rollback()
        print(f"\n❌ Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
