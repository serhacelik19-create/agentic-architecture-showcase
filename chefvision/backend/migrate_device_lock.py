import sys
import os
from sqlalchemy import text

# HARDCODE FOR CLOUD SHELL ENVIRONMENT
# Bu satır, terminalde export yapmasanız bile betiğin doğru veritabanına bağlanmasını sağlar.
os.environ["DATABASE_URL"] = os.getenv("DATABASE_URL", "postgresql://YOUR_DATABASE_USER:YOUR_DATABASE_PASSWORD@YOUR_DATABASE_HOST/YOUR_DATABASE_NAME?sslmode=require")

# Add parent directory to path to allow importing app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine

def migrate():
    print("Migrating users table for Account Security...")
    with engine.connect() as conn:
        # PostgreSQL'de işlem hatasını önlemek için kolon varlığını sistematik kontrol ediyoruz
        def column_exists(table, column):
            query = text(f"SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name=:t AND column_name=:c)")
            return conn.execute(query, {"t": table, "c": column}).scalar()

        # 1. session_id
        if not column_exists('users', 'session_id'):
            print("Adding 'session_id' column...")
            conn.execute(text("ALTER TABLE users ADD COLUMN session_id VARCHAR(36)"))
            conn.execute(text("CREATE INDEX ix_users_session_id ON users (session_id)"))
            conn.commit()
            print("Added 'session_id' column.")
        else:
            print("Column 'session_id' already exists.")

        # 2. device_change_count
        if not column_exists('users', 'device_change_count'):
            print("Adding 'device_change_count' column...")
            conn.execute(text("ALTER TABLE users ADD COLUMN device_change_count INTEGER DEFAULT 0"))
            conn.commit()
            print("Added 'device_change_count' column.")
        else:
            print("Column 'device_change_count' already exists.")

        # 3. device_id
        if not column_exists('users', 'device_id'):
            print("Adding 'device_id' column...")
            conn.execute(text("ALTER TABLE users ADD COLUMN device_id VARCHAR(255)"))
            conn.execute(text("CREATE INDEX ix_users_device_id ON users (device_id)"))
            conn.commit()
            print("Added 'device_id' column.")
        else:
            print("Column 'device_id' already exists.")
            
    print("Migration Done!")

if __name__ == "__main__":
    migrate()
