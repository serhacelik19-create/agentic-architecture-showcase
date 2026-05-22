from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database
    # Default to PostgreSQL
    database_url: str = "postgresql://YOUR_DATABASE_USER:YOUR_DATABASE_PASSWORD@localhost:5432/chefvision_db"
    
    # Redis
    redis_url: str = "redis://localhost:6379/0"
    
    # JWT Settings
    jwt_secret_key: str = "YOUR_JWT_SECRET_KEY_HERE"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days
    
    # App
    debug: bool = True
    secret_key: str = "YOUR_DEV_SECRET_KEY_HERE"
    api_v1_prefix: str = "/api/v1"
    
    # AI Models
    # ⚠️ WARNING: Default values are for local development only.
    # In production, these MUST be overridden via .env or environment variables.
    # Never commit real API keys to version control!
    gemini_api_key: str = "YOUR_GEMINI_API_KEY_HERE"
    gemini_flash_model: str = "gemini-3.1-flash-lite-preview"
    gemini_vision_model: str = "gemini-3-flash-preview"
    
    # Firebase
    # ⚠️ WARNING: Override this via .env in production!
    firebase_api_key: str = "YOUR_FIREBASE_API_KEY_HERE"

    # Payment Verification
    # Stripe
    # ⚠️ WARNING: Override this via .env in production!
    stripe_secret_key: str = "sk_test_mock_key"
    stripe_webhook_secret: Optional[str] = None
    stripe_price_id_monthly: str = "price_mock_monthly_id"

    # Google Play
    google_application_credentials: Optional[str] = "play_billing.json"
    google_play_package_name: str = "com.chefvision"
    allow_test_purchase_bypass: bool = False
    
    # App Store
    apple_shared_secret: Optional[str] = None # For legacy verification
    apple_key_id: Optional[str] = None # For App Store Server API
    apple_issuer_id: Optional[str] = None
    apple_private_key: Optional[str] = None # content of .p8 file
    apple_bundle_id: str = "com.chefvision"
    
    # Environment
    is_production: bool = False
    allowed_origins: list[str] = [
        "https://admin.chefvision.com",
        "http://localhost:3000",       # Dashboard dev
        "http://localhost:5173",       # Vite dev
    ]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
