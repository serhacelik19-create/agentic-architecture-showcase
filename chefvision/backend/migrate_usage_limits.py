from sqlalchemy import create_engine, text
import os
import sys

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import get_settings

def migrate():
    settings = get_settings()
    print(f"Connecting to database: {settings.database_url}")
    engine = create_engine(settings.database_url)

    with engine.connect() as conn:
        print("Adding usage limit columns to users table...")
        
        # 1. recipe_generation_count
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN recipe_generation_count INTEGER DEFAULT 0"))
            print("✅ Added recipe_generation_count")
        except Exception as e:
            print(f"⚠️ recipe_generation_count likely exists or error: {e}")
            
        # 2. last_generation_date
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN last_generation_date TIMESTAMP WITH TIME ZONE"))
            print("✅ Added last_generation_date")
        except Exception as e:
            print(f"⚠️ last_generation_date likely exists or error: {e}")

        # 3. total_free_generations
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN total_free_generations INTEGER DEFAULT 0"))
            print("✅ Added total_free_generations")
        except Exception as e:
            print(f"⚠️ total_free_generations likely exists or error: {e}")
            
        conn.commit()
        print("Migration complete.")

if __name__ == "__main__":
    migrate()
