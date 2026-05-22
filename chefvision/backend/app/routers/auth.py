from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import (
    RegisterRequest, LoginRequest, TokenResponse, 
    UserResponse, UserUpdate, ChangePasswordRequest,
    ChangeEmailRequest, ForgotPasswordRequest, DeleteAccountRequest
)
from app.services.auth_service import (
    create_user, authenticate_user, get_user_by_email,
    get_user_by_id, create_access_token, decode_token,
    update_user_preferences, change_password, change_email
)
from app.models.models import User
from app.core.rate_limiter import limiter # Import Rate Limiter
import os
import base64
import uuid

router = APIRouter(prefix="/auth", tags=["authentication"])

security = HTTPBearer()
security_optional = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Get the current authenticated user by validating the JWT token.
    """
    token = credentials.credentials
    payload = decode_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Oturum geçersiz veya süresi dolmuş",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz kimlik doğrulama verisi",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = get_user_by_id(db, int(user_id))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="err_user_not_found",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Check Session ID (Single Active Session)
    token_session_id = payload.get("session_id")
    if token_session_id and user.session_id:
        if token_session_id != user.session_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="err_session_expired_other_device",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
    # -- Abonelik & Tolerans (Grace Period) Kontrolü --
    from datetime import datetime, timedelta, timezone
    now_utc = datetime.now(timezone.utc)
    
    # Yönetici Hediyesi var mı ve geçerli mi?
    is_valid_promo = user.promotional_expires_at and user.promotional_expires_at > now_utc
    
    # Kullanıcı Pro görünüyor ama hediyesi yoksa mağaza paketini kontrol et
    if user.is_pro and not is_valid_promo:
        if user.subscription_expires_at:
            # Tolerans süresi bitiş tarihi (3 gün)
            grace_period_end = user.subscription_expires_at + timedelta(days=3)
            
            if now_utc > grace_period_end:
                # Tolerans bitti, kullanıcıyı Free'ye düşür
                user.is_pro = False
                user.subscription_tier = 'free'
                db.commit()
                db.refresh(user)
    
    return user


async def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials = Depends(security_optional),
    db: Session = Depends(get_db)
):
    """Get the current authenticated user, but return None if invalid or missing."""
    try:
        if not credentials:
            return None
            
        token = credentials.credentials
        payload = decode_token(token)
        
        if payload is None:
            return None
        
        user_id = payload.get("sub")
        if user_id is None:
            return None
        
        user = get_user_by_id(db, int(user_id))
        return user
    except Exception:
        return None


@router.post("/register", response_model=TokenResponse)
@limiter.limit("5/minute") # Anti-Bot
async def register(request: Request, body: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if registration is open
    from app.core.settings_store import settings_store
    if not settings_store.registration_open:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Yeni üye alımı şu an kapalıdır."
        )

    # Check if user already exists
    existing_user = get_user_by_email(db, body.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu email adresi zaten kayıtlı"
        )
    
    # Check device ID usage
    initial_credits = 5
    if body.device_id:
        # Count existing users with this device_id
        device_usage_count = db.query(User).filter(User.device_id == body.device_id).count()
        if device_usage_count >= 2:
            initial_credits = 0
            
    # 1. Create Firebase User
    from app.services.firebase_service import firebase_service
    firebase_uid, id_token = await firebase_service.create_user(body.email, body.password)
    
    # 2. Create Local User
    user = create_user(db, body.email, body.password, body.name, body.device_id, initial_credits)
    
    # 3. Update Local User with Firebase UID
    user.firebase_uid = firebase_uid
    
    # 4. Generate Session ID
    from app.services.auth_service import create_session_id
    session_id = create_session_id()
    user.session_id = session_id
    
    db.commit()
    
    # 5. Send Verification Email
    await firebase_service.send_verification_email(id_token)
    
    # Generate token
    access_token = create_access_token(data={"sub": str(user.id)}, session_id=session_id)
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(user)
    )


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute") # Brute Force Prevention
async def login(request: Request, body: LoginRequest, db: Session = Depends(get_db)):
    """Login and get access token."""
    from app.services.firebase_service import firebase_service
    from app.services.auth_service import get_password_hash, get_user_by_email
    
    user = authenticate_user(db, body.email, body.password)
    password_was_reset = False
    
    # If local auth fails, try Firebase as fallback
    if not user:
        db_user = get_user_by_email(db, body.email)
        if db_user:
            # CHECK: If local user was updated recently (e.g. by Admin), prevent old password login via Firebase
            # This prevents the scenario where Admin resets password locally, but user logs in with old Firebase password
            from datetime import datetime
            
            try:
                # updated_at might be naive or aware depending on DB setup. 
                # Assuming naive UTC or converting to safe comparison
                last_updated = db_user.updated_at
                if last_updated:
                    # Basic check: if updated in last 5 minutes, reject fallback to prevent override
                    # (Admin reset just happened)
                    now = datetime.utcnow()
                    # Ensure last_updated is comparable
                    if last_updated.tzinfo:
                         last_updated = last_updated.replace(tzinfo=None)
                    
                    time_diff = (now - last_updated).total_seconds()
                    
                    # If updated within last 24 hours
                    if time_diff < 86400:
                        print(f"DEBUG: Local DB updated recently ({time_diff}s ago). Rejecting Firebase fallback for {body.email}")
                        raise HTTPException(
                            status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Şifreniz değiştirildi. Lütfen yeni şifrenizle giriş yapın."
                        )
            except HTTPException:
                raise
            except Exception as e:
                print(f"Error checking last_updated: {e}")
                # Continue to Firebase auth if check fails
                pass

            # Try to authenticate with Firebase
            try:
                fb_auth = await firebase_service.sign_in_with_password(body.email, body.password)
                if fb_auth:
                    # Firebase auth succeeded with this password → user reset their password via Firebase (Email Link)
                    # AND local DB hasn't been updated recently.
                    
                    # Sync local DB hash
                    db_user.password_hash = get_password_hash(body.password)
                    db.commit()
                    db.refresh(db_user)
                    user = db_user
                    password_was_reset = True
                    print(f"Password synced from Firebase for user {body.email}")
            except Exception as e:
                # Firebase auth failed too
                print(f"Firebase fallback auth failed: {e}")
                pass
        
        if not user:
            # If we reached here, both Local and Firebase auth failed.
            # Instead of a generic 500 if Firebase crashed, we return 401.
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Giriş yapılamadı. E-posta adresiniz veya şifreniz hatalı olabilir. Şifrenizi yakın zamanda değiştirdiyseniz lütfen yeni şifrenizle tekrar deneyin."
            )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hesap devre dışı"
        )
        
    # Check Firebase Verification Status
    try:
        if not password_was_reset:
            # If not already authenticated in the fallback flow above, do it now
            fb_auth = await firebase_service.sign_in_with_password(body.email, body.password)
        
        if fb_auth:
            id_token = fb_auth.get("idToken")
            user_info = await firebase_service.get_user_info(id_token)
            
            if user_info:
                email_verified = user_info.get("emailVerified", False)
                
                # Update local DB if status changed
                if email_verified and not user.verified:
                    user.verified = True
                    db.commit()
                    db.refresh(user)
                
                # If not verified, Block Login
                if not email_verified:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Lütfen giriş yapmadan önce email adresinizi doğrulayın."
                    )
                    
    except HTTPException as he:
        # Re-raise HTTP exceptions (like 403)
        raise he
    except Exception as e:
        print(f"Firebase verification check failed: {e}")
        # If Firebase check fails completely, fall back to local status
        if not user.verified:
             raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Email doğrulama durumu kontrol edilemedi. Lütfen daha sonra tekrar deneyin."
            )
    
    # Device Lock & Session Management
    current_device_id = body.device_id
    if current_device_id:
        # If user has no device_id registered, lock to this one
        if not user.device_id:
            user.device_id = current_device_id
            db.commit()
        
        # If user has a device_id and it doesn't match the current one
        elif user.device_id != current_device_id:
            # Increment device change count
            user.device_change_count += 1
            # Update to new device
            user.device_id = current_device_id
            db.commit()
            
    # Generate new session_id (Single Active Session)
    from app.services.auth_service import create_session_id
    session_id = create_session_id()
    user.session_id = session_id
    db.commit()
    
    access_token = create_access_token(data={"sub": str(user.id)}, session_id=session_id)
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(user)
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user = Depends(get_current_user)):
    """Get current user profile."""
    return UserResponse.model_validate(current_user)


@router.put("/me", response_model=UserResponse)
async def update_me(
    request: UserUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user profile."""
    if request.name:
        current_user.name = request.name
    if request.avatar_url:
        current_user.avatar_url = request.avatar_url
    
    updated_user = update_user_preferences(
        db, current_user,
        diet_preferences=request.diet_preferences,
        allergies=request.allergies
    )
    
    return UserResponse.model_validate(updated_user)


@router.post("/change-password")
async def change_password_endpoint(
    request: ChangePasswordRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change current user's password."""
    success = change_password(db, current_user, request.old_password, request.new_password)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mevcut şifre hatalı"
        )
    return {"message": "Şifre başarıyla güncellendi"}


@router.post("/forgot-password")
async def forgot_password_endpoint(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    Send password reset email using Firebase.
    """
    # 1. Check if user exists in our DB
    user = get_user_by_email(db, request.email)
    if not user:
        # Don't reveal if user exists or not for security, or just return success
        # But for UX, we might want to say "If this email is registered..."
        # However, standard practice often returns 200 OK.
        # But if you want to be explicit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bu email adresi ile kayıtlı kullanıcı bulunamadı"
        )
    
    # 2. Send Password Reset Email via Firebase
    from app.services.firebase_service import firebase_service
    success = await firebase_service.send_password_reset_email(request.email)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Şifre sıfırlama emaili gönderilemedi."
        )
        
    return {"message": "Şifre sıfırlama bağlantısı email adresinize gönderildi."}


@router.post("/change-email", response_model=UserResponse)
async def change_email_endpoint(
    request: ChangeEmailRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change current user's email."""
    # Check if new email is taken
    existing = get_user_by_email(db, request.new_email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu email adresi zaten kullanımda"
        )

    # 1. Authenticate with Firebase to get ID Token (needed for update)
    from app.services.firebase_service import firebase_service
    fb_auth = await firebase_service.sign_in_with_password(current_user.email, request.password)
    if not fb_auth:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mevcut şifre hatalı"
        )
    
    id_token = fb_auth.get("idToken")

    # 2. Update Email in Firebase
    fb_success = await firebase_service.update_email(id_token, request.new_email)
    if not fb_success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Firebase email güncelleme hatası"
        )

    # 3. Update Local DB
    # We use the same service function but we need to handle the password check properly before
    # Since we already checked with Firebase, we can trust the password valid for local/firebase sync?
    # Actually `change_email` service does verify password again locally.
    success = change_email(db, current_user, request.password, request.new_email)
    if not success:
         # This should rarely happen if Firebase auth succeeded, unless local pwd differs
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Yerel veritabanı güncelleme hatası"
        )
    
    # 4. Set Verified = False
    current_user.verified = False
    db.commit()
    db.refresh(current_user)

    # 5. Send Verification Email to New Address
    # We need a new ID token for the *new* email? 
    # The previous ID token is still valid for the user account.
    await firebase_service.send_verification_email(id_token)
    
    return UserResponse.model_validate(current_user)


@router.delete("/me")
async def delete_account(
    request: DeleteAccountRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete the current user's account permanently from both Firebase and the local database.
    Requires the user's password for security confirmation.
    """
    from app.services.firebase_service import firebase_service
    
    # 1. Authenticate with Firebase to verify password and get a fresh ID token
    fb_auth = await firebase_service.sign_in_with_password(current_user.email, request.password)
    if not fb_auth:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mevcut şifre hatalı, hesap silinemedi."
        )
        
    id_token = fb_auth.get("idToken")
    
    # 2. Delete user from Firebase
    fb_deleted = await firebase_service.delete_user(id_token)
    if not fb_deleted:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Firebase hesap silme işlemi başarısız oldu."
        )
        
    # 3. Check if user has active subscription to return warning key
    message_key = "success_account_deleted"
    if current_user.is_pro and current_user.platform in ["ios", "android"]:
        message_key = "warning_subscription_active_delete"
        
    # 4. Delete user from local database
    # Assuming cascade deletes are configured on relationships like pantry_items, favorites, etc.
    try:
        db.delete(current_user)
        db.commit()
    except Exception as e:
        db.rollback()
        # Even if DB fails, Firebase is deleted, meaning the user can't login anyway, but it's an inconsistent state
        print(f"Failed to delete user from database: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Kayıtlar silinirken bir veritabanı hatası oluştu."
        )
        
    return {"message": message_key}


@router.post("/upload-avatar", response_model=UserResponse)
async def upload_avatar(
    request: dict,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload profile avatar as base64 image."""
    image_base64 = request.get("image_base64")
    if not image_base64:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="image_base64 alanı gerekli"
        )
    
    # Save to uploads directory
    uploads_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads", "avatars")
    os.makedirs(uploads_dir, exist_ok=True)
    
    filename = f"{current_user.id}_{uuid.uuid4().hex[:8]}.jpg"  # type: ignore
    filepath = os.path.join(uploads_dir, filename)
    
    try:
        image_data = base64.b64decode(image_base64)
        
        # 1. Size Check (~5MB max)
        if len(image_data) > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Dosya boyutu çok büyük (Max 5MB)"
            )
            
        # 2. Basic Magic Bytes Check (JPEG, PNG, WebP)
        is_jpeg = image_data.startswith(b'\xff\xd8\xff')
        is_png = image_data.startswith(b'\x89PNG\r\n\x1a\n')
        is_webp = image_data[0:4] == b'RIFF' and image_data[8:12] == b'WEBP'  # type: ignore
        
        if not (is_jpeg or is_png or is_webp):
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Sadece JPEG, PNG veya WebP formatları desteklenir."
            )
        
        with open(filepath, "wb") as f:
            f.write(image_data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Görsel işlenemedi: {str(e)}"
        )
    
    # Update user avatar URL
    current_user.avatar_url = f"/uploads/avatars/{filename}"
    db.commit()
    db.refresh(current_user)
    
    return UserResponse.model_validate(current_user)
