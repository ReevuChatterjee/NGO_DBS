-- ============================================================
-- Animal Welfare NGO — SQL Views
-- ============================================================

-- ============================================================
-- View 1: Available animals with latest medical record
-- Shows all animals currently available for adoption along
-- with their most recent medical treatment information
-- ============================================================
CREATE VIEW IF NOT EXISTS vw_available_animals AS
SELECT
    a.animal_id,
    a.name,
    a.species,
    a.breed,
    a.age,
    a.gender,
    a.health_status,
    a.rescue_location,
    a.date_rescued,
    a.image_url,
    mr.treatment AS latest_treatment,
    mr.vet_name AS last_vet,
    mr.treatment_date AS last_treatment_date,
    mr.record_type AS last_record_type
FROM Animals a
LEFT JOIN Medical_Records mr ON a.animal_id = mr.animal_id
    AND mr.treatment_date = (
        SELECT MAX(mr2.treatment_date)
        FROM Medical_Records mr2
        WHERE mr2.animal_id = a.animal_id
    )
WHERE a.status = 'Available';

-- ============================================================
-- View 2: Donation summary by purpose
-- Aggregates donation statistics grouped by purpose
-- ============================================================
CREATE VIEW IF NOT EXISTS vw_donation_summary AS
SELECT
    COALESCE(purpose, 'General') AS purpose,
    SUM(amount) AS total_raised,
    COUNT(*) AS num_donations,
    AVG(amount) AS avg_donation,
    MIN(amount) AS min_donation,
    MAX(amount) AS max_donation
FROM Donations
GROUP BY purpose;

-- ============================================================
-- View 3: Complete adoption details
-- Joins Adoptions with Animals and Adopters for full picture
-- ============================================================
CREATE VIEW IF NOT EXISTS vw_adoption_details AS
SELECT
    ao.adoption_id,
    ao.request_date,
    ao.adoption_date,
    ao.status AS adoption_status,
    ao.reviewed_by,
    ao.notes,
    a.animal_id,
    a.name AS animal_name,
    a.species,
    a.breed,
    a.age,
    a.image_url,
    ad.adopter_id,
    ad.name AS adopter_name,
    ad.email AS adopter_email,
    ad.phone AS adopter_phone,
    ad.address AS adopter_address
FROM Adoptions ao
JOIN Animals a ON ao.animal_id = a.animal_id
JOIN Adopters ad ON ao.adopter_id = ad.adopter_id;

-- ============================================================
-- View 4: Volunteer workload summary
-- Shows each volunteer with their assigned animal count
-- ============================================================
CREATE VIEW IF NOT EXISTS vw_volunteer_workload AS
SELECT
    v.volunteer_id,
    v.name,
    v.email,
    v.phone,
    v.role,
    v.availability,
    v.joined_date,
    COUNT(va.assignment_id) AS total_assignments,
    SUM(CASE WHEN va.status = 'Active' THEN 1 ELSE 0 END) AS active_assignments,
    SUM(CASE WHEN va.status = 'Completed' THEN 1 ELSE 0 END) AS completed_assignments
FROM Volunteers v
LEFT JOIN Volunteer_Assignments va ON v.volunteer_id = va.volunteer_id
GROUP BY v.volunteer_id;
