"""
Migration script: Add is_admin column to users table.
Connects to the existing database and adds the column if it doesn't exist.
"""
from sqlalchemy import text
from app.database import engine

def migrate():
    with engine.connect() as conn:
        # Check if column already exists
        result = conn.execute(text("""
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'is_admin'
        """))
        
        if result.fetchone() is None:
            print("Adding 'is_admin' column to users table...")
            conn.execute(text("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE"))
            conn.commit()
            print("✅ 'is_admin' column added successfully.")
        else:
            print("ℹ️ 'is_admin' column already exists.")
        
        # Set admin flag for known admin emails
        admin_emails = ['serhat@chefvision.com', 'admin@chefvision.com']
        for email in admin_emails:
            result = conn.execute(
                text("UPDATE users SET is_admin = TRUE WHERE email = :email"),
                {"email": email}
            )
            if result.rowcount > 0:
                print(f"✅ {email} marked as admin.")
        conn.commit()
        
    print("Migration complete!")

if __name__ == "__main__":
    migrate()
