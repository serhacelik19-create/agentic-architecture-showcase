from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.models import User
from app.services.auth_service import get_password_hash
from app.config import get_settings

def reset_admin():
    print(f"DEBUG: Database URL from settings: {get_settings().database_url}")
    db = SessionLocal()
    try:
        email = "admin@chefvision.com"
        password = "admin123"
        hashed_password = get_password_hash(password)
        
        # Check if user exists
        existing = db.query(User).filter(User.email == email).first()
        
        if existing:
            # Update existing user
            existing.password_hash = hashed_password
            existing.name = "System Admin"
            existing.is_active = True
            existing.is_admin = True
            existing.is_pro = True
            existing.subscription_tier = "pro"
            db.commit()
            print(f"✅ Updated existing user {email} with is_admin=True")
        else:
            # Create new user
            user = User(
                email=email,
                password_hash=hashed_password,
                name="System Admin",
                is_active=True,
                is_admin=True,
                is_pro=True,
                subscription_tier="pro"
            )
            db.add(user)
            db.commit()
            print(f"✅ Created user {email} with is_admin=True")
        
        print(f"📧 Email: {email}")
        print(f"🔑 Password: {password}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_admin()
