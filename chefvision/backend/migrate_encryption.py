from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.config import get_settings
from app.core.encryption import encrypt_data, decrypt_data
import json

# Setup DB connection
settings = get_settings()
engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def is_encrypted(data):
    """Check if data is likely encrypted (Fernet token format)."""
    if not data:
        return False
    try:
        # Fernet tokens are URL-safe base64 strings
        decrypt_data(data)
        return True
    except Exception:
        return False

def migrate_users():
    print("Starting encryption migration for User table...")
    
    # Raw SQL might be safer here to avoid model conflicts, but let's try ORM first if possible.
    # Actually, raw SQL is better because our model definitions now auto-encrypt/decrypt on access,
    # which might confuse the migration process if we are not careful (double encryption).
    
    # We will read raw values using SQL and update them using SQL to be 100% sure.
    
    try:
        # 1. Fetch all users with potential sensitive data
        # Note: We select id, purchase_token, payment_last4
        with engine.connect() as connection:
            result = connection.execute(text("SELECT id, purchase_token, payment_last4 FROM users"))
            users = result.fetchall()
            
            print(f"Found {len(users)} users. Checking for unencrypted data...")
            
            migrated_count = 0
            
            for user in users:
                user_id = user[0]
                p_token = user[1]
                p_last4 = user[2]
                
                needs_update = False
                new_token = p_token
                new_last4 = p_last4
                
                # Check purchase_token
                if p_token and not is_encrypted(p_token):
                    print(f"Encrypting purchase_token for user {user_id}...")
                    new_token = encrypt_data(p_token)
                    needs_update = True
                
                # Check payment_last4
                if p_last4 and not is_encrypted(p_last4):
                    print(f"Encrypting payment_last4 for user {user_id}...")
                    new_last4 = encrypt_data(p_last4)
                    needs_update = True
                
                if needs_update:
                    # Update DB
                    connection.execute(
                        text("UPDATE users SET purchase_token = :token, payment_last4 = :last4 WHERE id = :uid"),
                        {"token": new_token, "last4": new_last4, "uid": user_id}
                    )
                    migrated_count += 1
            
            connection.commit()
            print(f"Migration completed. {migrated_count} users updated.")
            
    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    migrate_users()
