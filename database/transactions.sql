-- ============================================================
-- Animal Welfare NGO — Transaction Examples
-- ============================================================

-- ============================================================
-- Transaction 1: Atomic adoption approval
-- Approves adoption and updates animal status in one transaction
-- If any step fails, all changes are rolled back
-- ============================================================
BEGIN TRANSACTION;

    -- Step 1: Approve the adoption request
    UPDATE Adoptions
    SET status = 'Approved',
        adoption_date = DATE('now'),
        reviewed_by = 'Admin User'
    WHERE adoption_id = 1;

    -- Step 2: Update animal status to 'Adopted'
    UPDATE Animals
    SET status = 'Adopted'
    WHERE animal_id = (
        SELECT animal_id FROM Adoptions WHERE adoption_id = 1
    );

    -- Step 3: Reject any other pending requests for the same animal
    UPDATE Adoptions
    SET status = 'Rejected',
        reviewed_by = 'Admin User',
        notes = 'Auto-rejected: Animal was adopted by another applicant.'
    WHERE animal_id = (
        SELECT animal_id FROM Adoptions WHERE adoption_id = 1
    )
    AND adoption_id != 1
    AND status = 'Pending';

COMMIT;
-- Use ROLLBACK instead of COMMIT if any step fails

-- ============================================================
-- Transaction 2: Rescue intake — add animal + first medical record
-- ============================================================
BEGIN TRANSACTION;

    -- Step 1: Register new rescued animal
    INSERT INTO Animals (name, species, breed, age, gender, health_status, rescue_location, date_rescued, status)
    VALUES ('Buddy', 'Dog', 'Labrador', 3.0, 'Male', 'Injured left leg', 'MG Road, Bangalore', DATE('now'), 'Rescued');

    -- Step 2: Add initial medical checkup record
    INSERT INTO Medical_Records (animal_id, treatment, diagnosis, medication, vet_name, treatment_date, record_type)
    VALUES (
        (SELECT MAX(animal_id) FROM Animals),
        'Initial assessment and wound cleaning',
        'Fracture in left foreleg',
        'Meloxicam 0.1mg/kg',
        'Dr. Priya Sharma',
        DATE('now'),
        'Checkup'
    );

    -- Step 3: Update status to Under Treatment
    UPDATE Animals
    SET status = 'Under Treatment'
    WHERE animal_id = (SELECT MAX(animal_id) FROM Animals);

COMMIT;

-- ============================================================
-- Transaction 3: Volunteer assignment batch
-- Assign a volunteer to multiple animals atomically
-- ============================================================
BEGIN TRANSACTION;

    INSERT INTO Volunteer_Assignments (volunteer_id, animal_id, task_description, assigned_date, status)
    VALUES (1, 1, 'Daily feeding and exercise', DATE('now'), 'Active');

    INSERT INTO Volunteer_Assignments (volunteer_id, animal_id, task_description, assigned_date, status)
    VALUES (1, 2, 'Medication administration', DATE('now'), 'Active');

    INSERT INTO Volunteer_Assignments (volunteer_id, animal_id, task_description, assigned_date, status)
    VALUES (1, 3, 'Socialization training', DATE('now'), 'Active');

COMMIT;
