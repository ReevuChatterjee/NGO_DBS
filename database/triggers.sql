-- ============================================================
-- Animal Welfare NGO — SQLite Triggers
-- ============================================================

-- ============================================================
-- Trigger 1: Auto-update animal status when adoption is approved
-- When an adoption record is updated to 'Approved', the
-- corresponding animal's status changes to 'Adopted'
-- ============================================================
CREATE TRIGGER IF NOT EXISTS trg_approve_adoption
AFTER UPDATE ON Adoptions
FOR EACH ROW
WHEN NEW.status = 'Approved' AND OLD.status != 'Approved'
BEGIN
    UPDATE Animals
    SET status = 'Adopted'
    WHERE animal_id = NEW.animal_id;
END;

-- ============================================================
-- Trigger 2: Prevent duplicate active adoptions for same animal
-- Before inserting a new adoption request, check if the animal
-- already has a Pending or Approved adoption
-- ============================================================
CREATE TRIGGER IF NOT EXISTS trg_prevent_duplicate_adoption
BEFORE INSERT ON Adoptions
FOR EACH ROW
WHEN (
    SELECT COUNT(*) FROM Adoptions
    WHERE animal_id = NEW.animal_id
    AND status IN ('Pending', 'Approved')
) > 0
BEGIN
    SELECT RAISE(ABORT, 'Animal already has an active adoption request.');
END;

-- ============================================================
-- Trigger 3: Auto-set adoption_date when approved
-- Ensures adoption_date is populated when status becomes Approved
-- ============================================================
CREATE TRIGGER IF NOT EXISTS trg_set_adoption_date
AFTER UPDATE ON Adoptions
FOR EACH ROW
WHEN NEW.status = 'Approved' AND NEW.adoption_date IS NULL
BEGIN
    UPDATE Adoptions
    SET adoption_date = DATE('now')
    WHERE adoption_id = NEW.adoption_id;
END;

-- ============================================================
-- Trigger 4: Reset animal status when adoption is rejected
-- If the only active adoption for an animal is rejected,
-- set the animal back to 'Available'
-- ============================================================
CREATE TRIGGER IF NOT EXISTS trg_reject_adoption
AFTER UPDATE ON Adoptions
FOR EACH ROW
WHEN NEW.status = 'Rejected' AND OLD.status = 'Pending'
BEGIN
    UPDATE Animals
    SET status = 'Available'
    WHERE animal_id = NEW.animal_id
    AND (SELECT COUNT(*) FROM Adoptions
         WHERE animal_id = NEW.animal_id
         AND status IN ('Pending', 'Approved')) = 0;
END;
