-- ============================================================
-- Animal Welfare NGO — Advanced SQL Queries
-- ============================================================

-- ============================================================
-- Query 1: Animals available for adoption
-- ============================================================
SELECT
    animal_id, name, species, breed, age, gender,
    health_status, rescue_location, date_rescued
FROM Animals
WHERE status = 'Available'
ORDER BY date_rescued DESC;

-- ============================================================
-- Query 2: Complete adoption history with adopter details
-- Uses multi-table JOIN
-- ============================================================
SELECT
    a.name AS animal_name,
    a.species,
    a.breed,
    ad.name AS adopter_name,
    ad.phone AS adopter_phone,
    ad.email AS adopter_email,
    ao.request_date,
    ao.adoption_date,
    ao.status AS adoption_status,
    ao.reviewed_by
FROM Adoptions ao
JOIN Animals a ON ao.animal_id = a.animal_id
JOIN Adopters ad ON ao.adopter_id = ad.adopter_id
ORDER BY ao.request_date DESC;

-- ============================================================
-- Query 3: Total donations by type (aggregation)
-- ============================================================
SELECT
    donation_type,
    COUNT(*) AS donation_count,
    SUM(amount) AS total_amount,
    AVG(amount) AS average_amount,
    MIN(amount) AS min_donation,
    MAX(amount) AS max_donation
FROM Donations
GROUP BY donation_type;

-- ============================================================
-- Query 4: Animals with full medical history
-- ============================================================
SELECT
    a.name AS animal_name,
    a.species,
    mr.record_type,
    mr.diagnosis,
    mr.treatment,
    mr.medication,
    mr.vet_name,
    mr.treatment_date,
    mr.follow_up_date
FROM Animals a
JOIN Medical_Records mr ON a.animal_id = mr.animal_id
ORDER BY a.name, mr.treatment_date DESC;

-- ============================================================
-- Query 5: Volunteer workload summary
-- Uses LEFT JOIN to include volunteers with no assignments
-- ============================================================
SELECT
    v.name AS volunteer_name,
    v.role,
    v.availability,
    COUNT(va.animal_id) AS animals_assigned,
    SUM(CASE WHEN va.status = 'Active' THEN 1 ELSE 0 END) AS active_tasks,
    SUM(CASE WHEN va.status = 'Completed' THEN 1 ELSE 0 END) AS completed_tasks
FROM Volunteers v
LEFT JOIN Volunteer_Assignments va ON v.volunteer_id = va.volunteer_id
GROUP BY v.volunteer_id
ORDER BY animals_assigned DESC;

-- ============================================================
-- Query 6: Donation analysis by purpose and payment mode
-- Uses GROUP BY with multiple columns
-- ============================================================
SELECT
    COALESCE(purpose, 'General') AS purpose,
    payment_mode,
    COUNT(*) AS count,
    SUM(amount) AS total
FROM Donations
GROUP BY purpose, payment_mode
ORDER BY total DESC;

-- ============================================================
-- Query 7: Animals rescued in last 30 days with status counts
-- Uses subquery and date functions
-- ============================================================
SELECT
    species,
    status,
    COUNT(*) AS count
FROM Animals
WHERE date_rescued >= DATE('now', '-30 days')
GROUP BY species, status
ORDER BY species, count DESC;

-- ============================================================
-- Query 8: Adopters with multiple adoption requests
-- Uses HAVING clause
-- ============================================================
SELECT
    ad.name,
    ad.email,
    COUNT(ao.adoption_id) AS total_requests,
    SUM(CASE WHEN ao.status = 'Approved' THEN 1 ELSE 0 END) AS approved,
    SUM(CASE WHEN ao.status = 'Rejected' THEN 1 ELSE 0 END) AS rejected,
    SUM(CASE WHEN ao.status = 'Pending' THEN 1 ELSE 0 END) AS pending
FROM Adopters ad
JOIN Adoptions ao ON ad.adopter_id = ao.adopter_id
GROUP BY ad.adopter_id
HAVING COUNT(ao.adoption_id) > 0
ORDER BY total_requests DESC;

-- ============================================================
-- Query 9: Animals never visited by a vet
-- Uses LEFT JOIN with NULL check (anti-join pattern)
-- ============================================================
SELECT
    a.animal_id, a.name, a.species, a.status,
    a.date_rescued, a.health_status
FROM Animals a
LEFT JOIN Medical_Records mr ON a.animal_id = mr.animal_id
WHERE mr.record_id IS NULL
ORDER BY a.date_rescued;

-- ============================================================
-- Query 10: Monthly donation trends
-- Uses date formatting for time-series grouping
-- ============================================================
SELECT
    STRFTIME('%Y-%m', donation_date) AS month,
    COUNT(*) AS num_donations,
    SUM(amount) AS total_amount,
    AVG(amount) AS avg_amount
FROM Donations
GROUP BY STRFTIME('%Y-%m', donation_date)
ORDER BY month DESC;
