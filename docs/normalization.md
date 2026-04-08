# Database Documentation: Normalization

Below is the step-by-step normalization process for the core tables of the Animal Welfare NGO system. We progress from Unnormalized Form (UNF) through to Third Normal Form (3NF).

---

## 1. Table: Adoptions (Workflow Demo)

**UNF (Unnormalized Form):**
`adopter_name, adopter_phone, adopter_email, animal_name, species, date_rescued, request_date, status, vet_name, diagnosis`
*Issues*: Mixing adopter details with animal, medical info, and adoption instance details. Repeating groups if an adopter adopts multiple animals or an animal has multiple medical records.

**1NF (First Normal Form):**
*Rule*: Remove repeating groups, assign Primary Key (PK).
`Adoption(adoption_id PK, adopter_name, adopter_phone, adopter_email, animal_id, animal_name, species, request_date, status)`
*Issues*: `adopter_name` and `animal_name` depend only on part of the implicit composite entity. Partial dependency exists if we consider the true key of this transaction to just be `adoption_id`.

**2NF (Second Normal Form):**
*Rule*: Remove partial dependencies (All non-key attributes must depend entirely on the primary key).
We split entities into logical tables:
* `Adopters(adopter_id PK, adopter_name, adopter_phone, adopter_email)`
* `Animals(animal_id PK, animal_name, species)`
* `Adoptions(adoption_id PK, animal_id FK, adopter_id FK, request_date, status)`

**3NF (Third Normal Form):**
*Rule*: Remove transitive dependencies (Non-key attributes cannot depend on other non-key attributes).
Looking at the 2NF tables, there are no transitive dependencies. For instance, in `Adopters`, `adopter_phone` relies strictly on `adopter_id`, not on `adopter_email`. The schema is in 3NF.

---

## 2. Table: Volunteer_Assignments (M:N Bridge)

**UNF:**
`volunteer_name, role, animal_name, task_description, assigned_date`
*Issues*: M:N relationship flattened into one table causes immense redundancy (rewriting volunteer names and animal names for every task).

**1NF:**
`VolunteerAssignments(assignment_id PK, volunteer_id, volunteer_name, role, animal_id, animal_name, task_description, assigned_date)`

**2NF / 3NF:**
Isolate the entities into their respective tables and use a bridge table to resolve the many-to-many relationship:
* `Volunteers(volunteer_id PK, name, role)`
* `Animals(animal_id PK, animal_name)`
* `Volunteer_Assignments(assignment_id PK, volunteer_id FK, animal_id FK, task_description, assigned_date)`

---

## 3. Table: Medical_Records

**UNF:**
`animal_name, species, treatment, diagnosis, medication, vet_name, treatment_date`

**1NF:**
`Medical(record_id PK, animal_id, animal_name, species, treatment, diagnosis, medication, vet_name, treatment_date)`

**2NF / 3NF:**
`animal_name` and `species` rely on `animal_id`, not `record_id`. Move them to the `Animals` table.
* `Medical_Records(record_id PK, animal_id FK, treatment, diagnosis, medication, vet_name, treatment_date)`

---
### Conclusion
By applying these normalization rules across the entire dataset, we achieved the clean schema provided in `schema.sql`, featuring 8 normalized relations without duplication or insertion/deletion anomalies.
