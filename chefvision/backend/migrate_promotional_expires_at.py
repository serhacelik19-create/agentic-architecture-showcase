import sys
import os

# Ensure the app module can be found
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.database import engine

def migrate():
    print("Starting database migration: Adding promotional_expires_at to users...")
    
    sql = "ALTER TABLE users ADD COLUMN promotional_expires_at TIMESTAMP WITH TIME ZONE;"
    
    try:
        with engine.begin() as conn:
            conn.execute(text(sql))
            print("[OK] Migration successful! Column 'promotional_expires_at' added.")
    except Exception as e:
        error_msg = str(e).lower()
        # PostgreSQL error code for duplicate column is 42701
        if "42701" in error_msg or "already exists" in error_msg:
            print("[SKIP] Column 'promotional_expires_at' already exists.")
        else:
            print(f"[ERROR] Migration failed: {e}")

if __name__ == "__main__":
    migrate()
