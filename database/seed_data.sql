-- ============================================================
-- Animal Welfare NGO — Sample Seed Data
-- ============================================================

-- ============================================================
-- Users
-- ============================================================
-- Note: password_hash values are bcrypt hashes of 'password123'
INSERT INTO Users (username, password_hash, full_name, role) VALUES
('admin', '$2b$12$LJ3m4ys3GZ7kP5W6VQB8eOZQP9t8KL2rJhH9k0q1w2e3r4t5y6u7', 'System Administrator', 'Admin'),
('staff1', '$2b$12$LJ3m4ys3GZ7kP5W6VQB8eOZQP9t8KL2rJhH9k0q1w2e3r4t5y6u7', 'Rahul Verma', 'Staff'),
('volunteer1', '$2b$12$LJ3m4ys3GZ7kP5W6VQB8eOZQP9t8KL2rJhH9k0q1w2e3r4t5y6u7', 'Sneha Patel', 'Volunteer');

-- ============================================================
-- Animals (15+ records)
-- ============================================================
INSERT INTO Animals (name, species, breed, age, gender, health_status, rescue_location, date_rescued, status) VALUES
('Bruno', 'Dog', 'German Shepherd', 3.0, 'Male', 'Healthy', 'Indiranagar, Bangalore', '2025-01-15', 'Available'),
('Mimi', 'Cat', 'Persian', 2.5, 'Female', 'Healthy', 'Koramangala, Bangalore', '2025-02-10', 'Available'),
('Rocky', 'Dog', 'Indie', 4.0, 'Male', 'Under observation for skin allergy', 'MG Road, Bangalore', '2025-02-20', 'Under Treatment'),
('Cleo', 'Cat', 'Siamese', 1.5, 'Female', 'Recovering from malnutrition', 'HSR Layout, Bangalore', '2025-03-01', 'Under Treatment'),
('Kiwi', 'Bird', 'Budgerigar', 1.0, 'Male', 'Healthy', 'Jayanagar, Bangalore', '2025-03-05', 'Available'),
('Thumper', 'Rabbit', 'Holland Lop', 2.0, 'Female', 'Healthy', 'Whitefield, Bangalore', '2025-03-10', 'Available'),
('Max', 'Dog', 'Golden Retriever', 5.0, 'Male', 'Healthy - recovered from injury', 'Electronic City, Bangalore', '2024-11-20', 'Adopted'),
('Whiskers', 'Cat', 'Maine Coon', 3.0, 'Male', 'Healthy', 'Marathahalli, Bangalore', '2025-01-25', 'Available'),
('Daisy', 'Dog', 'Beagle', 2.0, 'Female', 'Healthy', 'JP Nagar, Bangalore', '2025-03-15', 'Available'),
('Polly', 'Bird', 'Cockatiel', 2.5, 'Female', 'Wing injury - healing', 'BTM Layout, Bangalore', '2025-03-20', 'Under Treatment'),
('Simba', 'Cat', 'Indie', 1.0, 'Male', 'Healthy', 'Yelahanka, Bangalore', '2025-04-01', 'Rescued'),
('Luna', 'Dog', 'Labrador', 1.5, 'Female', 'Healthy', 'Hebbal, Bangalore', '2025-04-02', 'Available'),
('Pepper', 'Cat', 'Bengal', 2.0, 'Male', 'Mild eye infection', 'Rajajinagar, Bangalore', '2025-04-03', 'Under Treatment'),
('Oreo', 'Rabbit', 'Netherland Dwarf', 1.0, 'Male', 'Healthy', 'Malleshwaram, Bangalore', '2025-04-04', 'Available'),
('Charlie', 'Dog', 'Pomeranian', 6.0, 'Male', 'Dental issues', 'Basavanagudi, Bangalore', '2025-04-05', 'Under Treatment'),
('Nemo', 'Other', 'Turtle', 5.0, 'Unknown', 'Healthy', 'Cubbon Park, Bangalore', '2025-03-25', 'Available');

-- ============================================================
-- Adopters (8+ records)
-- ============================================================
INSERT INTO Adopters (name, email, phone, address, id_proof) VALUES
('Arjun Mehta', 'arjun.mehta@email.com', '9876543210', '42, 3rd Cross, Indiranagar, Bangalore 560038', 'Aadhaar - XXXX-XXXX-1234'),
('Priya Krishnan', 'priya.k@email.com', '9876543211', '15, 1st Main, Koramangala 4th Block, Bangalore 560034', 'Aadhaar - XXXX-XXXX-5678'),
('Vikram Singh', 'vikram.s@email.com', '9876543212', '88, 2nd Floor, HSR Layout Sector 2, Bangalore 560102', 'PAN - ABCDE1234F'),
('Ananya Iyer', 'ananya.i@email.com', '9876543213', '7, Lake View Apts, JP Nagar 5th Phase, Bangalore 560078', 'Aadhaar - XXXX-XXXX-9012'),
('Rohan Gupta', 'rohan.g@email.com', '9876543214', '23, Palm Grove, Whitefield Main Road, Bangalore 560066', 'Driving License - KA01-2023-XXXXX'),
('Deepika Nair', 'deepika.n@email.com', '9876543215', '55, Green Park, Yelahanka New Town, Bangalore 560064', 'Aadhaar - XXXX-XXXX-3456'),
('Karthik Reddy', 'karthik.r@email.com', '9876543216', '101, Maple Street, Electronic City Phase 1, Bangalore 560100', 'PAN - FGHIJ5678K'),
('Meera Sharma', 'meera.s@email.com', '9876543217', '33, Rose Garden, Hebbal, Bangalore 560024', 'Aadhaar - XXXX-XXXX-7890');

-- ============================================================
-- Adoptions
-- ============================================================
INSERT INTO Adoptions (animal_id, adopter_id, request_date, adoption_date, status, reviewed_by, notes) VALUES
(7, 1, '2024-12-15', '2024-12-20', 'Approved', 'System Administrator', 'Home visit completed successfully.'),
(1, 2, '2025-04-01', NULL, 'Pending', NULL, 'Applicant has prior pet ownership experience.'),
(2, 3, '2025-04-02', NULL, 'Pending', NULL, 'Lives in a cat-friendly apartment.'),
(5, 4, '2025-03-28', '2025-04-01', 'Approved', 'Rahul Verma', 'Has a proper bird cage at home.'),
(6, 5, '2025-04-03', NULL, 'Pending', NULL, 'First-time rabbit owner, needs orientation.'),
(9, 6, '2025-04-04', NULL, 'Pending', NULL, NULL);

-- ============================================================
-- Donations (12+ records)
-- ============================================================
INSERT INTO Donations (donor_name, donor_email, amount, donation_date, donation_type, purpose, payment_mode) VALUES
('Rajesh Kumar', 'rajesh.k@email.com', 5000.00, '2025-01-10', 'One-Time', 'Medical', 'UPI'),
('Sunita Devi', 'sunita.d@email.com', 2000.00, '2025-01-15', 'Recurring', 'Food', 'Bank Transfer'),
('TechCorp Foundation', 'csr@techcorp.com', 50000.00, '2025-02-01', 'One-Time', 'Shelter', 'Bank Transfer'),
('Amit Joshi', 'amit.j@email.com', 1000.00, '2025-02-14', 'One-Time', 'Medical', 'UPI'),
('Priya Krishnan', 'priya.k@email.com', 3000.00, '2025-02-20', 'Recurring', 'Food', 'Card'),
('Nandini Rao', 'nandini.r@email.com', 1500.00, '2025-03-01', 'One-Time', 'Medical', 'UPI'),
('Anonymous', NULL, 10000.00, '2025-03-05', 'One-Time', 'Shelter', 'Cash'),
('Vikram Singh', 'vikram.s@email.com', 2500.00, '2025-03-10', 'Recurring', 'Food', 'Card'),
('Green Earth Trust', 'info@greenearth.org', 25000.00, '2025-03-15', 'One-Time', 'Shelter', 'Bank Transfer'),
('Sneha Patel', 'sneha.p@email.com', 500.00, '2025-03-20', 'One-Time', 'Medical', 'UPI'),
('Arjun Mehta', 'arjun.m@email.com', 7500.00, '2025-04-01', 'Recurring', 'Food', 'Bank Transfer'),
('Deepika Nair', 'deepika.n@email.com', 2000.00, '2025-04-05', 'One-Time', 'Medical', 'UPI'),
('Karthik Reddy', 'karthik.r@email.com', 3500.00, '2025-04-06', 'One-Time', 'Shelter', 'Card');

-- ============================================================
-- Volunteers (6+ records)
-- ============================================================
INSERT INTO Volunteers (name, email, phone, role, joined_date, availability) VALUES
('Sneha Patel', 'sneha.volunteer@email.com', '9988776601', 'Animal Care', '2024-06-15', 'Weekends'),
('Rahul Sharma', 'rahul.volunteer@email.com', '9988776602', 'Rescue Ops', '2024-08-01', 'Both'),
('Divya Menon', 'divya.volunteer@email.com', '9988776603', 'Medical Support', '2024-10-20', 'Weekdays'),
('Aakash Jain', 'aakash.volunteer@email.com', '9988776604', 'Animal Care', '2025-01-10', 'Weekends'),
('Kavitha Rangan', 'kavitha.volunteer@email.com', '9988776605', 'Admin', '2024-03-01', 'Weekdays'),
('Farhan Sheikh', 'farhan.volunteer@email.com', '9988776606', 'Rescue Ops', '2025-02-15', 'Both');

-- ============================================================
-- Medical Records
-- ============================================================
INSERT INTO Medical_Records (animal_id, treatment, diagnosis, medication, vet_name, treatment_date, follow_up_date, record_type) VALUES
(1, 'General checkup and vaccinations', 'Healthy', 'Rabies vaccine, DHPP', 'Dr. Sanjay Kumar', '2025-01-20', '2025-07-20', 'Vaccination'),
(1, 'Routine health assessment', 'Healthy - fit for adoption', NULL, 'Dr. Sanjay Kumar', '2025-03-15', NULL, 'Checkup'),
(2, 'Deworming and vaccination', 'Mild worm infestation', 'Praziquantel, FVRCP vaccine', 'Dr. Meera Nair', '2025-02-15', '2025-03-15', 'Treatment'),
(2, 'Follow-up checkup', 'Healthy - cleared', NULL, 'Dr. Meera Nair', '2025-03-15', NULL, 'Checkup'),
(3, 'Skin allergy treatment', 'Dermatitis - fungal', 'Ketoconazole shampoo, Cetirizine', 'Dr. Sanjay Kumar', '2025-02-25', '2025-03-25', 'Treatment'),
(3, 'Follow-up skin assessment', 'Improving - continue medication', 'Ketoconazole shampoo', 'Dr. Sanjay Kumar', '2025-03-25', '2025-04-25', 'Checkup'),
(4, 'Nutritional support and IV fluids', 'Severe malnutrition', 'Multivitamins, Iron supplements', 'Dr. Priya Sharma', '2025-03-02', '2025-03-16', 'Treatment'),
(4, 'Follow-up weight check', 'Weight gain observed, improving', 'Continued supplements', 'Dr. Priya Sharma', '2025-03-16', '2025-04-16', 'Checkup'),
(7, 'Leg injury treatment', 'Fractured right foreleg', 'Meloxicam, Splint applied', 'Dr. Priya Sharma', '2024-11-22', '2024-12-22', 'Surgery'),
(7, 'Post-surgery recovery check', 'Healing well', 'Continued Meloxicam', 'Dr. Priya Sharma', '2024-12-22', NULL, 'Checkup'),
(10, 'Wing injury assessment', 'Partial wing fracture', 'Anti-inflammatory, Rest', 'Dr. Meera Nair', '2025-03-21', '2025-04-21', 'Treatment'),
(13, 'Eye infection treatment', 'Conjunctivitis', 'Tobramycin eye drops', 'Dr. Sanjay Kumar', '2025-04-04', '2025-04-11', 'Treatment'),
(15, 'Dental checkup', 'Periodontal disease stage 2', 'Dental cleaning scheduled', 'Dr. Meera Nair', '2025-04-06', '2025-04-20', 'Checkup');

-- ============================================================
-- Volunteer Assignments
-- ============================================================
INSERT INTO Volunteer_Assignments (volunteer_id, animal_id, task_description, assigned_date, status) VALUES
(1, 1, 'Daily feeding and exercise for Bruno', '2025-03-01', 'Active'),
(1, 2, 'Daily feeding for Mimi', '2025-03-01', 'Active'),
(2, 3, 'Monitor Rocky''s skin condition', '2025-03-01', 'Active'),
(3, 4, 'Administer supplements to Cleo', '2025-03-05', 'Active'),
(3, 10, 'Monitor Polly''s wing recovery', '2025-03-22', 'Active'),
(4, 9, 'Exercise and socialization for Daisy', '2025-03-20', 'Active'),
(2, 7, 'Post-surgery physiotherapy for Max', '2024-12-01', 'Completed'),
(6, 11, 'Initial assessment for Simba', '2025-04-01', 'Active'),
(4, 12, 'Daily walks for Luna', '2025-04-03', 'Active');
