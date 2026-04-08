import sqlite3

def run_truncate():
    conn = sqlite3.connect('ngo_animal_welfare.db')
    cursor = conn.cursor()

    tables = [
        'Volunteer_Assignments',
        'Medical_Records',
        'Adoptions',
        'Adopters',
        'Donations',
        'Animals',
        'Volunteers'
    ]

    for table in tables:
        cursor.execute(f"DELETE FROM {table}")
        try:
            cursor.execute(f"DELETE FROM sqlite_sequence WHERE name='{table}'")
        except sqlite3.OperationalError:
            pass

    cursor.execute("DELETE FROM Users WHERE role != 'Admin'")

    conn.commit()
    conn.close()
    print("Database fully truncated with schema preserved.")

if __name__ == "__main__":
    run_truncate()
