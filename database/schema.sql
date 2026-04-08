-- ============================================================
-- Animal Welfare NGO Management System — Database Schema
-- Database: SQLite
-- ============================================================

PRAGMA foreign_keys = ON;

-- ============================================================
-- Table 1: Users (Admin/Staff Authentication)
-- ============================================================
CREATE TABLE IF NOT EXISTS Users (
    user_id         INTEGER PRIMARY KEY AUTOINCREMENT,
    username        VARCHAR(50) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(100) NOT NULL,
    role            VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Staff', 'Volunteer')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Table 2: Animals
-- ============================================================
CREATE TABLE IF NOT EXISTS Animals (
    animal_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name            VARCHAR(100) NOT NULL,
    species         VARCHAR(20) NOT NULL CHECK (species IN ('Dog', 'Cat', 'Bird', 'Rabbit', 'Other')),
    breed           VARCHAR(100),
    age             DECIMAL(4,1) CHECK (age >= 0),
    gender          VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Unknown')),
    health_status   VARCHAR(255) NOT NULL,
    rescue_location VARCHAR(255) NOT NULL,
    date_rescued    DATE NOT NULL,
    image_url       VARCHAR(500),
    status          VARCHAR(20) DEFAULT 'Rescued'
                    CHECK (status IN ('Rescued', 'Under Treatment', 'Available', 'Adopted')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Table 3: Adopters
-- ============================================================
CREATE TABLE IF NOT EXISTS Adopters (
    adopter_id  INTEGER PRIMARY KEY AUTOINCREMENT,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) UNIQUE NOT NULL,
    phone       VARCHAR(15) NOT NULL,
    address     TEXT NOT NULL,
    id_proof    VARCHAR(100),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Table 4: Adoptions
-- ============================================================
CREATE TABLE IF NOT EXISTS Adoptions (
    adoption_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    animal_id       INTEGER NOT NULL,
    adopter_id      INTEGER NOT NULL,
    request_date    DATE NOT NULL,
    adoption_date   DATE,
    status          VARCHAR(20) DEFAULT 'Pending'
                    CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    reviewed_by     VARCHAR(100),
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES Animals(animal_id) ON DELETE RESTRICT,
    FOREIGN KEY (adopter_id) REFERENCES Adopters(adopter_id) ON DELETE CASCADE
);

-- ============================================================
-- Table 5: Donations
-- ============================================================
CREATE TABLE IF NOT EXISTS Donations (
    donation_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_name      VARCHAR(100) NOT NULL,
    donor_email     VARCHAR(150),
    amount          DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    donation_date   DATE NOT NULL,
    donation_type   VARCHAR(20) NOT NULL CHECK (donation_type IN ('One-Time', 'Recurring')),
    purpose         VARCHAR(255),
    payment_mode    VARCHAR(20) NOT NULL
                    CHECK (payment_mode IN ('Cash', 'UPI', 'Card', 'Bank Transfer')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Table 6: Volunteers
-- ============================================================
CREATE TABLE IF NOT EXISTS Volunteers (
    volunteer_id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(150) UNIQUE NOT NULL,
    phone           VARCHAR(15) NOT NULL,
    role            VARCHAR(20) NOT NULL
                    CHECK (role IN ('Animal Care', 'Rescue Ops', 'Medical Support', 'Admin')),
    joined_date     DATE NOT NULL,
    availability    VARCHAR(20) DEFAULT 'Both'
                    CHECK (availability IN ('Weekdays', 'Weekends', 'Both')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Table 7: Medical_Records
-- ============================================================
CREATE TABLE IF NOT EXISTS Medical_Records (
    record_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    animal_id       INTEGER NOT NULL,
    treatment       TEXT NOT NULL,
    diagnosis       VARCHAR(255),
    medication      VARCHAR(255),
    vet_name        VARCHAR(100) NOT NULL,
    treatment_date  DATE NOT NULL,
    follow_up_date  DATE,
    record_type     VARCHAR(20) NOT NULL
                    CHECK (record_type IN ('Treatment', 'Vaccination', 'Checkup', 'Surgery')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES Animals(animal_id) ON DELETE CASCADE
);

-- ============================================================
-- Table 8: Volunteer_Assignments (M:N Bridge Table)
-- ============================================================
CREATE TABLE IF NOT EXISTS Volunteer_Assignments (
    assignment_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    volunteer_id        INTEGER NOT NULL,
    animal_id           INTEGER NOT NULL,
    task_description    TEXT NOT NULL,
    assigned_date       DATE NOT NULL,
    status              VARCHAR(20) DEFAULT 'Active'
                        CHECK (status IN ('Active', 'Completed')),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (volunteer_id) REFERENCES Volunteers(volunteer_id) ON DELETE CASCADE,
    FOREIGN KEY (animal_id) REFERENCES Animals(animal_id) ON DELETE CASCADE,
    UNIQUE(volunteer_id, animal_id, assigned_date)
);

-- ============================================================
-- Indexes for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_animals_status ON Animals(status);
CREATE INDEX IF NOT EXISTS idx_animals_species ON Animals(species);
CREATE INDEX IF NOT EXISTS idx_adoptions_status ON Adoptions(status);
CREATE INDEX IF NOT EXISTS idx_adoptions_animal ON Adoptions(animal_id);
CREATE INDEX IF NOT EXISTS idx_medical_animal ON Medical_Records(animal_id);
CREATE INDEX IF NOT EXISTS idx_donations_date ON Donations(donation_date);
CREATE INDEX IF NOT EXISTS idx_volunteer_assignments_volunteer ON Volunteer_Assignments(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_assignments_animal ON Volunteer_Assignments(animal_id);
