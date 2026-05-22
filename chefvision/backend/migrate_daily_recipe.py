import sys
import os

# Add parent directory to path to allow importing app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, Base
from app.models.models import DailyRecipe
from sqlalchemy import text

def migrate():
    print("Dropping daily_recipes table...")
    with engine.connect() as conn:
        conn.execute(text("DROP TABLE IF EXISTS daily_recipes"))
        conn.commit()
    
    print("Creating daily_recipes table...")
    # This will create tables that don't exist (daily_recipes)
    Base.metadata.create_all(bind=engine)
    print("Migration Done!")

if __name__ == "__main__":
    migrate()
