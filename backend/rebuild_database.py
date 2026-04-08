import sqlite3
import os

db_path = "ngo_animal_welfare.db"
schema_flags = [
    "../database/schema.sql",
    "../database/triggers.sql", 
    "../database/views.sql"
]

def rebuild_db():
    print("Removing old database...")
    if os.path.exists(db_path):
        try:
            os.remove(db_path)
            print("Successfully deleted old database.")
        except Exception as e:
            print(f"Failed to delete db: {e}")
    
    print("Rebuilding from raw SQL scripts to ensure Views and Triggers exist...")
    
    conn = sqlite3.connect(db_path)
    # Enable foreign keys
    conn.execute("PRAGMA foreign_keys = ON;")
    cursor = conn.cursor()
    
    for script_file in schema_flags:
        if os.path.exists(script_file):
            print(f"Executing {script_file}...")
            with open(script_file, "r") as f:
                cursor.executescript(f.read())
        else:
            print(f"Warning: {script_file} not found!")
            
    conn.commit()
    conn.close()
    
    print("Database reconstructed with all Triggers and Views successfully!")

if __name__ == "__main__":
    rebuild_db()
