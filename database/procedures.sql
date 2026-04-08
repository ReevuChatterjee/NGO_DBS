-- ============================================================
-- Animal Welfare NGO — Stored Procedures (MySQL-Compatible)
-- NOTE: SQLite does not support stored procedures natively.
--       These are provided in MySQL syntax for the formal report.
--       Equivalent logic is implemented in the Python backend.
-- ============================================================

-- ============================================================
-- Procedure 1: Add new rescued animal
-- ============================================================
DELIMITER $$

CREATE PROCEDURE sp_add_animal(
    IN p_name VARCHAR(100),
    IN p_species VARCHAR(50),
    IN p_breed VARCHAR(100),
    IN p_age DECIMAL(4,1),
    IN p_gender VARCHAR(10),
    IN p_health_status VARCHAR(255),
    IN p_rescue_location VARCHAR(255)
)
BEGIN
    INSERT INTO Animals (
        name, species, breed, age, gender,
        health_status, rescue_location, date_rescued, status
    )
    VALUES (
        p_name, p_species, p_breed, p_age, p_gender,
        p_health_status, p_rescue_location, CURDATE(), 'Rescued'
    );
    SELECT LAST_INSERT_ID() AS new_animal_id;
END$$

DELIMITER ;

-- ============================================================
-- Procedure 2: Approve adoption (with transaction)
-- ============================================================
DELIMITER $$

CREATE PROCEDURE sp_approve_adoption(
    IN p_adoption_id INT,
    IN p_admin_name VARCHAR(100)
)
BEGIN
    DECLARE v_animal_id INT;

    -- Get the animal ID for this adoption
    SELECT animal_id INTO v_animal_id
    FROM Adoptions
    WHERE adoption_id = p_adoption_id;

    IF v_animal_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Adoption request not found.';
    END IF;

    START TRANSACTION;

    -- Update adoption record
    UPDATE Adoptions
    SET status = 'Approved',
        adoption_date = CURDATE(),
        reviewed_by = p_admin_name
    WHERE adoption_id = p_adoption_id;

    -- Update animal status
    UPDATE Animals
    SET status = 'Adopted'
    WHERE animal_id = v_animal_id;

    -- Reject any other pending adoptions for same animal
    UPDATE Adoptions
    SET status = 'Rejected',
        reviewed_by = p_admin_name,
        notes = 'Auto-rejected: Animal adopted by another adopter.'
    WHERE animal_id = v_animal_id
    AND adoption_id != p_adoption_id
    AND status = 'Pending';

    COMMIT;

    SELECT 'Adoption approved successfully.' AS result;
END$$

DELIMITER ;

-- ============================================================
-- Procedure 3: Generate donation report for date range
-- ============================================================
DELIMITER $$

CREATE PROCEDURE sp_donation_report(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT
        donation_type,
        payment_mode,
        COUNT(*) AS total_count,
        SUM(amount) AS total_amount,
        AVG(amount) AS avg_amount
    FROM Donations
    WHERE donation_date BETWEEN p_start_date AND p_end_date
    GROUP BY donation_type, payment_mode
    ORDER BY total_amount DESC;
END$$

DELIMITER ;
