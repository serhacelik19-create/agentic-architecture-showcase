import asyncio
from sqlalchemy import text
from app.database import engine

def run_migration():
    print("Starting database migration...")
    
    with open('add_languages.sql', 'r', encoding='utf-8') as f:
        sql = f.read()
        
    try:
        with engine.begin() as conn:
            conn.execute(text(sql))
            print("Migration successful! Language columns added to ingredients table.")
    except Exception as e:
        print(f"Migration error: {e}")

if __name__ == "__main__":
    run_migration()
