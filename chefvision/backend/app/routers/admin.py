from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, text
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta, date, timezone
from pydantic import BaseModel
import json

from app.database import get_db
from app.models.models import (
    User, Recipe, Ingredient, UserPantry, UserSubscriptionHistory,
    RecipeRating, UserFavorite, CachedSuggestion, DailyRecipe
)
from app.services.auth_service import get_password_hash
from app.routers.auth import get_current_user
from app.schemas.schemas import UserResponse, IngredientDetected, AdminUserCreate, AdminCreate, AdminUpdate, AdminResponse
from app.core.settings_store import settings_store

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    responses={404: {"detail": "Not found"}},
)

# --- Security Dependency ---

ADMIN_EMAILS = ["serhat@chefvision.com", "admin@chefvision.com"]

async def get_current_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin and current_user.email not in ADMIN_EMAILS:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

# --- System Settings ---

@router.get("/system-settings")
async def get_system_settings(current_user: User = Depends(get_current_admin)):
    return {
        "maintenance_mode": settings_store.maintenance_mode,
        "registration_open": settings_store.registration_open
    }

class SystemSettingsUpdate(BaseModel):
    maintenance_mode: Optional[bool] = None
    registration_open: Optional[bool] = None

@router.put("/system-settings")
async def update_system_settings(settings: SystemSettingsUpdate, current_user: User = Depends(get_current_admin)):
    if settings.maintenance_mode is not None:
        settings_store.maintenance_mode = settings.maintenance_mode
    if settings.registration_open is not None:
        settings_store.registration_open = settings.registration_open
    
    return {
        "maintenance_mode": settings_store.maintenance_mode,
        "registration_open": settings_store.registration_open
    }

# --- 1. General Overview & Financials ---

@router.get("/stats/financials")
async def get_financial_metrics(
    days: int = 30,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Get financial metrics: Revenue, MRR, ARR, ARPU.
    Calculated from UserSubscriptionHistory using SQL aggregations.
    """
    
    # 1. Total Revenue in last X days
    start_date = datetime.now() - timedelta(days=days)
    revenue_query = db.query(
        func.sum(UserSubscriptionHistory.amount)
    ).filter(
        UserSubscriptionHistory.created_at >= start_date,
        UserSubscriptionHistory.action.in_(['subscribe', 'renew'])
    ).scalar() or 0.0

    # 2. MRR (Monthly Recurring Revenue) estimation (Actual tiers)
    # Prices: Plus: 30, Pro: 60, Premium: 100
    plus_count = db.query(func.count(User.id)).filter(User.subscription_tier == 'plus').scalar() or 0
    pro_count = db.query(func.count(User.id)).filter(User.subscription_tier == 'pro').scalar() or 0
    premium_count = db.query(func.count(User.id)).filter(User.subscription_tier == 'premium').scalar() or 0
    
    estimated_mrr = (plus_count * 30) + (pro_count * 60) + (premium_count * 100)

    # 3. ARR (Annual Run Rate)
    estimated_arr = estimated_mrr * 12

    # 4. ARPU (Average Revenue Per User) - Total Revenue / Total Users
    total_users = db.query(func.count(User.id)).scalar() or 1
    total_lifetime_revenue = db.query(func.sum(UserSubscriptionHistory.amount)).scalar() or 0.0
    arpu = total_lifetime_revenue / total_users

    # 5. Revenue Forecast (Simple Linear Projection based on last month growth)
    # Compare this month vs last month
    last_month_start = datetime.now() - timedelta(days=60)
    last_month_end = datetime.now() - timedelta(days=30)
    
    last_month_revenue = db.query(func.sum(UserSubscriptionHistory.amount)).filter(
        UserSubscriptionHistory.created_at >= last_month_start,
        UserSubscriptionHistory.created_at < last_month_end
    ).scalar() or 0.0
    
    growth_rate = 0
    if last_month_revenue > 0:
        growth_rate = ((revenue_query - last_month_revenue) / last_month_revenue) * 100

    forecast_next_month = estimated_mrr * (1 + (growth_rate / 100))

    return {
        "total_revenue": revenue_query,
        "mrr": estimated_mrr,
        "arr": estimated_arr,
        "arpu": arpu,
        "growth_rate": growth_rate,
        "forecast_next_month": forecast_next_month
    }

# --- 2. User User Intelligence ---

@router.get("/stats/users")
async def get_user_intelligence(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Get user analytics: Churn risk, segmentation, retention.
    """
    now = datetime.now()
    seven_days_ago = now - timedelta(days=7)
    thirty_days_ago = now - timedelta(days=30)

    # 1. Total Users breakdown
    total_users = db.query(func.count(User.id)).filter(User.is_admin == False).scalar()
    plus_users = db.query(func.count(User.id)).filter(User.subscription_tier == 'plus', User.is_admin == False).scalar()
    pro_users = db.query(func.count(User.id)).filter(User.subscription_tier == 'pro', User.is_admin == False).scalar()
    premium_users = db.query(func.count(User.id)).filter(User.subscription_tier == 'premium', User.is_admin == False).scalar()
    active_subscriptions = db.query(func.count(User.id)).filter(User.subscription_tier != 'free', User.is_admin == False).scalar()
    
    # 2. New Users (Last 7 days)
    new_users = db.query(func.count(User.id)).filter(User.created_at >= seven_days_ago, User.is_admin == False).scalar()

    # 3. Churn Risk: Pro users who haven't logged in (updated_at) in 30 days
    # Note: We rely on updated_at roughly indicating activity if login updates it, or last_login field if it existed.
    # Assuming updated_at is touched on interaction.
    churn_risk_count = db.query(func.count(User.id)).filter(
        User.is_pro == True,
        User.updated_at < thirty_days_ago
    ).scalar()

    # 4. Diet Preference Segmentation (Parsing JSON/String fields)
    # This is heavy, in production use a proper analytics DB or search engine.
    # We will do a simple text search scan for demonstration.
    vegan_count = db.query(func.count(User.id)).filter(User.diet_preferences.ilike('%vegan%')).scalar()
    keto_count = db.query(func.count(User.id)).filter(User.diet_preferences.ilike('%keto%')).scalar()
    gluten_free_count = db.query(func.count(User.id)).filter(User.diet_preferences.ilike('%gluten%')).scalar()

    # 5. Active Users Heatmap (Daily activity last 7 days)
    # Group by date of updated_at
    daily_activity = db.query(
        func.date(User.updated_at).label('date'),
        func.count(User.id)
    ).filter(
        User.updated_at >= seven_days_ago
    ).group_by(
        func.date(User.updated_at)
    ).all()

    return {
        "total_users": total_users,
        "plus_users": plus_users,
        "pro_users": pro_users,
        "premium_users": premium_users,
        "active_subscriptions": active_subscriptions,
        "new_users_last_7d": new_users,
        "churn_risk_count": churn_risk_count,
        "segments": {
            "vegan": vegan_count,
            "keto": keto_count,
            "gluten_free": gluten_free_count
        },
        "daily_activity": [{"date": str(d[0]), "count": d[1]} for d in daily_activity],
        "tier_distribution": [
            {"name": "Plus", "value": plus_users, "color": "#10b981"},
            {"name": "Pro", "value": pro_users, "color": "#f97316"},
            {"name": "Premium", "value": premium_users, "color": "#a855f7"},
            {"name": "Free", "value": total_users - active_subscriptions, "color": "#94a3b8"}
        ]
    }

# --- 3. Content Insights ---

@router.get("/stats/content")
async def get_content_insights(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Get content insights: Popular recipes, ingredient trends, waste analysis.
    """
    # 1. Most Popular Recipes (by favorites count)
    popular_recipes = db.query(
        Recipe.title,
        func.count(UserFavorite.id).label('favorite_count')
    ).join(UserFavorite).group_by(Recipe.id).order_by(desc('favorite_count')).limit(5).all()

    # 2. Top Ingredients in Pantries (Trend analysis)
    top_ingredients = db.query(
        Ingredient.name,
        func.count(UserPantry.id).label('pantry_count')
    ).join(UserPantry).group_by(Ingredient.id).order_by(desc('pantry_count')).limit(10).all()

    # 3. Waste Analysis: Ingredients closest to expiry across all pantries
    # Ingredients expiring in next 3 days
    three_days_from_now = datetime.now() + timedelta(days=3)
    expiring_soon = db.query(
        Ingredient.name,
        func.count(UserPantry.id).label('count')
    ).join(UserPantry).filter(
        UserPantry.expires_at <= three_days_from_now,
        UserPantry.expires_at >= datetime.now()
    ).group_by(Ingredient.id).order_by(desc('count')).limit(5).all()

    # 4. Flavor Profile (Simulated based on tags/categories if available, or just cuisine stats)
    cuisine_stats = db.query(
        Recipe.cuisine,
        func.count(Recipe.id)
    ).group_by(Recipe.cuisine).all()

    return {
        "popular_recipes": [{"title": r[0], "favorites": r[1]} for r in popular_recipes],
        "top_ingredients": [{"name": r[0], "count": r[1]} for r in top_ingredients],
        "waste_risk_items": [{"name": r[0], "count": r[1]} for r in expiring_soon],
        "cuisine_distribution": [{"cuisine": r[0] or "Unknown", "count": r[1]} for r in cuisine_stats]
    }


# --- 4. User Management (Admin Actions) ---

@router.post("/users/create")
async def create_user_admin(
    user_data: AdminUserCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Manually create a user from admin panel.
    """
    # Check if exists
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="E-posta adresi zaten kullanımda.")
    
    try:
        hashed_pw = get_password_hash(user_data.password)
        new_user = User(
            email=user_data.email,
            password_hash=hashed_pw,
            name=user_data.name,
            is_pro=user_data.is_pro,
            subscription_tier=user_data.tier if user_data.is_pro else 'free'
        )
        
        if new_user.is_pro:
            new_user.subscription_expires_at = datetime.now() + timedelta(days=365) # Gift 1 year
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return {"message": "Kullanıcı başarıyla oluşturuldu", "user_id": new_user.id}
    except Exception as e:
        db.rollback()
        print(f"ERROR creating user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Kullanıcı oluşturulurken bir hata oluştu: {str(e)}")

@router.put("/users/{user_id}/subscription")
async def manage_subscription(
    user_id: int,
    subscription_data: dict, # {is_pro, duration_days}
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Manage user subscription (Grant PRO, extend, cancel).
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    
    user.is_pro = subscription_data['is_pro']
    now_utc = datetime.now(timezone.utc)
    
    if user.is_pro:
        user.subscription_tier = subscription_data.get('tier', 'pro')
        days = subscription_data.get('duration_days', 30)
        # If already has expiry, add to it, else start from now
        start_date = user.subscription_expires_at if user.subscription_expires_at and user.subscription_expires_at > now_utc else now_utc
        user.subscription_expires_at = start_date + timedelta(days=days)
        
        # Log history
        history = UserSubscriptionHistory(
            user_id=user.id,
            action='admin_grant',
            plan=user.subscription_tier,
            amount=0
        )
        db.add(history)
    else:
        user.subscription_tier = 'free'
        # Abonelik sıfırlanırken tarihi silmek (None) yerine, geçmiş bir tarihe ayarlıyoruz. 
        # Bu sayede App Store test ekibi (ve sistem) hesabın "hiç alınmamış" değil, "alınmış ve süresi bitmiş (expired)" olduğunu anlar.
        user.subscription_expires_at = now_utc - timedelta(days=1)
        # Log history
        history = UserSubscriptionHistory(
            user_id=user.id,
            action='admin_revoke',
            plan='manual',
            amount=0
        )
        db.add(history)
    
    db.commit()
    db.refresh(user)
    return {"message": "Subscription updated", "is_pro": user.is_pro, "expires_at": user.subscription_expires_at}

@router.get("/users/search")
async def search_users(
    query: Optional[str] = Query(None),
    tier: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Search users by name or email, optionally filtered by subscription tier.
    """
    db_query = db.query(User).filter(User.is_admin == False)
    
    if query and query.strip():
        search_term = f"%{query.strip()}%"
        db_query = db_query.filter(
            (User.email.ilike(search_term)) | (User.name.ilike(search_term))
        )
        
    if tier and tier.lower().strip() != 'all':
        target_tier = tier.lower().strip()
        db_query = db_query.filter(func.lower(User.subscription_tier) == target_tier)
        
    users = db_query.order_by(desc(User.created_at)).limit(50).all()
    
    return [
        {
            "id": u.id,
            "email": u.email,
            "name": u.name,
            "is_pro": u.is_pro,
            "subscription_tier": u.subscription_tier,
            "created_at": u.created_at,
            "device_change_count": u.device_change_count
        } for u in users
    ]


@router.get("/users/{user_id}")
async def get_user_details(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Get detailed user profile for support.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
        
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "is_pro": user.is_pro,
        "subscription_tier": user.subscription_tier,
        "subscription_expires_at": user.subscription_expires_at,
        "created_at": user.created_at,
        "updated_at": user.updated_at,
        "avatar_url": user.avatar_url,
        "diet_preferences": user.diet_preferences,
        "recipe_count": user.recipe_generation_count,
        "device_change_count": user.device_change_count
    }

@router.put("/users/{user_id}/reset-device-lock")
async def reset_device_lock(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Reset device change count and clear session to unlock account.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    
    user.device_change_count = 0
    user.session_id = None # Force logout
    db.commit()
    
    return {"message": "Cihaz kilidi kaldırıldı ve oturum sıfırlandı."}

class AdminPasswordReset(BaseModel):
    new_password: str

@router.post("/users/{user_id}/reset-password")
async def admin_reset_password(
    user_id: int,
    data: AdminPasswordReset,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Admin override to reset user password.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
        
    # 1. Update Local DB
    user.password_hash = get_password_hash(data.new_password)
    db.commit()
    
    return {"message": f"Password for {user.email} has been reset."}




# --- 5. Admin User Management ---

@router.get("/admins", response_model=List[AdminResponse])
async def list_admins(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """List all admin users."""
    admins = db.query(User).filter(User.is_admin == True).order_by(desc(User.created_at)).all()
    return admins


@router.post("/admins", response_model=AdminResponse)
async def create_admin(
    data: AdminCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Create a new admin user."""
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        if existing.is_admin:
            raise HTTPException(status_code=400, detail="Bu email zaten admin olarak kayıtlı.")
        # Upgrade existing user to admin
        existing.is_admin = True
        if data.name:
            existing.name = data.name
        if data.password:
            existing.password_hash = get_password_hash(data.password)
        db.commit()
        db.refresh(existing)
        return existing
    
    try:
        new_user = User(
            email=data.email,
            password_hash=get_password_hash(data.password),
            name=data.name,
            is_admin=True,
            is_active=True,
            subscription_tier='free'
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Admin oluşturulurken hata: {str(e)}")


@router.put("/admins/{user_id}", response_model=AdminResponse)
async def update_admin(
    user_id: int,
    data: AdminUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Update an admin user's info."""
    user = db.query(User).filter(User.id == user_id, User.is_admin == True).first()
    if not user:
        raise HTTPException(status_code=404, detail="Admin kullanıcı bulunamadı.")
    
    if data.name is not None:
        user.name = data.name
    if data.email is not None:
        # Check email uniqueness
        existing = db.query(User).filter(User.email == data.email, User.id != user_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Bu email adresi zaten kullanımda.")
        user.email = data.email
    if data.password is not None:
        user.password_hash = get_password_hash(data.password)
    
    db.commit()
    db.refresh(user)
    return user


@router.delete("/admins/{user_id}")
async def remove_admin(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Remove admin privileges from a user."""
    if admin.id == user_id:
        raise HTTPException(status_code=400, detail="Kendinizi admin listesinden çıkaramazsınız.")
    
    # Prevent removing the last admin
    admin_count = db.query(func.count(User.id)).filter(User.is_admin == True).scalar()
    if admin_count <= 1:
        raise HTTPException(status_code=400, detail="Son admin silinemez. Sisteme erişim kaybedilir.")
    
    user = db.query(User).filter(User.id == user_id, User.is_admin == True).first()
    if not user:
        raise HTTPException(status_code=404, detail="Admin kullanıcı bulunamadı.")
    
    user.is_admin = False
    db.commit()
    return {"message": f"{user.email} artık admin değil."}
