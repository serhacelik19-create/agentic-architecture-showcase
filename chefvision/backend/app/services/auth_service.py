import bcrypt
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.config import get_settings
from app.models.models import User

settings = get_settings()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    # Convert strings to bytes
    password_bytes = plain_password.encode('utf-8')
    hash_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hash_bytes)


def get_password_hash(password: str) -> str:
    """Hash a password."""
    # Convert string to bytes
    password_bytes = password.encode('utf-8')
    # Generate salt and hash
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None, session_id: Optional[str] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire})
    
    if session_id:
        to_encode.update({"session_id": session_id})
        
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT token."""
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        return payload
    except JWTError:
        return None


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get a user by email."""
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """Get a user by ID."""
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, email: str, password: str, name: str, device_id: Optional[str] = None, initial_credits: int = 5) -> User:
    """Create a new user."""
    hashed_password = get_password_hash(password)
    db_user = User(
        email=email,
        password_hash=hashed_password,
        name=name,
        device_id=device_id,
        total_free_generations=initial_credits,
        recipe_generation_count=0
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate a user by email and password."""
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


def update_user_preferences(
    db: Session, 
    user: User, 
    diet_preferences: Optional[str] = None,
    allergies: Optional[str] = None
) -> User:
    """Update user's dietary preferences and allergies."""
    if diet_preferences is not None:
        user.diet_preferences = diet_preferences
    if allergies is not None:
        user.allergies = allergies
    db.commit()
    db.refresh(user)
    return user


def change_password(
    db: Session,
    user: User,
    old_password: str,
    new_password: str
) -> bool:
    """Change user's password after verifying old password."""
    if not verify_password(old_password, user.password_hash):
        return False
    user.password_hash = get_password_hash(new_password)
    db.commit()
    return True


def change_email(
    db: Session,
    user: User,
    password: str,
    new_email: str
) -> bool:
    """Change user's email after verifying password."""
    if not verify_password(password, user.password_hash):
        return False
    
    # Check if new email is already taken
    existing_user = get_user_by_email(db, new_email)
    if existing_user:
        return False
        
    user.email = new_email
    db.commit()
    db.refresh(user)
    return True


def create_session_id() -> str:
    """Generate a unique session ID."""
    import uuid
    return str(uuid.uuid4())
