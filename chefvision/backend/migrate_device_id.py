from sqlalchemy import create_engine, text
from app.config import get_settings

def migrate():
    settings = get_settings()
    engine = create_engine(settings.database_url)
    
    with engine.connect() as conn:
        print("Adding device_id column to users table...")
        try:
            # Check if column already exists (for SQLite)
            if "sqlite" in settings.database_url:
                conn.execute(text("ALTER TABLE users ADD COLUMN device_id VARCHAR(255)"))
            else:
                # PostgreSQL/MySQL syntax
                conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS device_id VARCHAR(255)"))
            
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_users_device_id ON users (device_id)"))
            conn.commit()
            print("Migration successful: device_id column added.")
        except Exception as e:
            if "duplicate column name" in str(e).lower() or "already exists" in str(e).lower():
                print("Column device_id already exists, skipping.")
            else:
                print(f"Migration failed: {e}")

if __name__ == "__main__":
    migrate()
