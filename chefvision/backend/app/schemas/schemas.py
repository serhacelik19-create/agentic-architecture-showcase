from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime


# =====================
# Authentication Schemas
# =====================

class RegisterRequest(BaseModel):
    """User registration request."""
    email: EmailStr
    # Password: Min 8 chars, must contain at least one letter and one number
    password: str = Field(..., min_length=8)
    
    # Name: Letters and spaces only, 2-50 chars
    name: str = Field(..., min_length=2, max_length=50, pattern=r"^[a-zA-ZçğıöşüÇĞİÖŞÜ\s]+$")
    device_id: Optional[str] = None

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not any(char.isalpha() for char in v):
            raise ValueError('Şifre en az bir harf içermelidir')
        if not any(char.isdigit() for char in v):
            raise ValueError('Şifre en az bir rakam içermelidir')
        return v


class LoginRequest(BaseModel):
    """User login request."""
    email: EmailStr
    password: str = Field(..., min_length=1) # Don't validate pattern on login to avoid enum attacks
    device_id: Optional[str] = None


class TokenResponse(BaseModel):
    """JWT token response."""
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    name: str


class UserResponse(UserBase):
    """User response schema."""
    id: int
    avatar_url: Optional[str] = None
    is_pro: bool = False
    subscription_tier: str = 'free'
    subscription_expires_at: Optional[datetime] = None
    recipe_generation_count: int = 0
    total_free_generations: int = 0
    payment_last4: Optional[str] = None
    payment_brand: Optional[str] = None
    diet_preferences: Optional[str] = None
    allergies: Optional[str] = None
    device_change_count: int = 0
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    """User update schema."""
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    diet_preferences: Optional[str] = None  # comma-separated: vegan,vegetarian,glutenfree
    allergies: Optional[str] = None  # comma-separated: nuts,dairy,shellfish


# =====================
# Ingredient Schemas
# =====================

class IngredientBase(BaseModel):
    name: str
    name_tr: Optional[str] = None
    name_en: Optional[str] = None
    name_es: Optional[str] = None
    name_fr: Optional[str] = None
    name_de: Optional[str] = None
    name_it: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None


class IngredientCreate(IngredientBase):
    pass


class IngredientResponse(IngredientBase):
    id: int
    calories_per_100g: Optional[float] = None
    protein_per_100g: Optional[float] = None
    carbs_per_100g: Optional[float] = None
    fat_per_100g: Optional[float] = None
    
    class Config:
        from_attributes = True


class IngredientDetected(BaseModel):
    """Ingredient detected from image."""
    name: str
    name_tr: str
    name_en: str
    name_es: str
    name_fr: str
    name_de: str
    name_it: str
    confidence: float
    category: str
    quantity_estimate: Optional[str] = None


# =====================
# Image Analysis Schemas
# =====================

class ImageAnalysisRequest(BaseModel):
    image_base64: str
    device_id: Optional[str] = None


class ImageAnalysisResponse(BaseModel):
    success: bool
    ingredients: List[IngredientDetected]
    message: Optional[str] = None


class RecipeDetailResponse(BaseModel):
    success: bool
    recipe: dict
    from_cache: bool


class VoiceCommandRequest(BaseModel):
    command_text: str


class VoiceCommandResponse(BaseModel):
    action: str
    items: List[dict]
    feedback_message: str
    message: Optional[str] = None


# =====================
# Receipt Scanning Schemas
# =====================

class ReceiptItem(BaseModel):
    """Item extracted from receipt."""
    ingredient_name: str
    name_tr: Optional[str] = None
    name_en: Optional[str] = None
    name_es: Optional[str] = None
    name_fr: Optional[str] = None
    name_de: Optional[str] = None
    name_it: Optional[str] = None
    quantity: float = 1.0
    unit: str = "adet"
    price: Optional[float] = None
    category: Optional[str] = None


class ReceiptAnalysisRequest(BaseModel):
    """Request to analyze a receipt image."""
    image_base64: str


class ReceiptAnalysisResponse(BaseModel):
    """Response from receipt analysis."""
    success: bool
    items: List[ReceiptItem]
    total_amount: Optional[float] = None
    merchant_name: Optional[str] = None
    date: Optional[str] = None
    message: Optional[str] = None


# =====================
# Recipe Schemas
# =====================

class RecipeIngredientInfo(BaseModel):
    name: str
    quantity: str
    is_optional: bool = False


class NutritionInfo(BaseModel):
    """Nutrition information for a recipe."""
    calories: Optional[int] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None


class RecipeBase(BaseModel):
    title: str
    description: Optional[str] = None
    instructions: List[str]
    image_url: Optional[str] = None
    prep_time: int = 0
    cook_time: int = 0
    servings: int = 4
    difficulty: str = "Kolay"
    cuisine: Optional[str] = None


class RecipeCreate(RecipeBase):
    ingredients: List[RecipeIngredientInfo]


class RecipeResponse(RecipeBase):
    id: Optional[int] = None
    ingredients: List[RecipeIngredientInfo] = []
    nutrition: Optional[NutritionInfo] = None
    is_vegan: bool = False
    is_vegetarian: bool = False
    is_gluten_free: bool = False
    is_dairy_free: bool = False
    match_percentage: Optional[int] = None
    tips: Optional[List[str]] = None
    instructions_summary: Optional[List[str]] = None
    quick_instructions: Optional[List[str]] = None
    missing_recommendations: Optional[List[str]] = None
    is_detailed: bool = False
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class RecipeDetailRequest(BaseModel):
    """Request for detailed recipe expansion."""
    recipe_title: str
    base_recipe: Optional[dict] = None  # Full summary recipe JSON
    mode: str = "detailed"  # "quick" or "detailed"


class RecipeSuggestionRequest(BaseModel):
    ingredients: List[str]
    max_results: int = 5
    max_prep_time: Optional[int] = None
    dietary_preferences: Optional[List[str]] = None  # vegan, vegetarian, gluten_free, etc.
    diet_filter: Optional[str] = None  # Deprecated, kept for backward compatibility
    exclude_allergies: Optional[List[str]] = None
    prioritize_waste: bool = False
    avoid_recipes: Optional[List[str]] = None  # List of recipe titles to avoid (for hybrid suggestion logic)
    cuisine: Optional[str] = None
    meal_type: Optional[str] = None
    variation: int = 1
    servings: int = 2
    device_id: Optional[str] = None


class RecipeSuggestionResponse(BaseModel):
    recipes: List[RecipeResponse]
    ai_suggestions: Optional[List[dict]] = None


# =====================
# Pantry Schemas
# =====================

class PantryItemBase(BaseModel):
    ingredient_name: str
    quantity: float = 1.0
    unit: str = "adet"
    expires_at: Optional[datetime] = None


class PantryItemCreate(PantryItemBase):
    pass


class PantryItemResponse(PantryItemBase):
    id: int
    added_at: datetime
    days_until_expiry: Optional[int] = None
    category: Optional[str] = None
    translations: Optional[dict] = None
    
    class Config:
        from_attributes = True


# =====================
# Shopping List Schemas
# =====================

class ShoppingItemBase(BaseModel):
    ingredient_name: str
    quantity: Optional[str] = None


class ShoppingItemCreate(ShoppingItemBase):
    pass


class ShoppingItemResponse(ShoppingItemBase):
    id: int
    is_checked: bool = False
    created_at: datetime
    translations: Optional[dict] = None
    
    class Config:
        from_attributes = True


class ShoppingItemUpdate(BaseModel):
    """Schema for updating a shopping item."""
    ingredient_name: Optional[str] = None
    quantity: Optional[str] = None
    is_checked: Optional[bool] = None


# =====================
# Rating Schemas
# =====================

class RatingCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class RatingResponse(RatingCreate):
    id: int
    user_id: int
    recipe_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Update forward reference
TokenResponse.model_rebuild()


# =====================
# Password & Account Schemas
# =====================

class ChangePasswordRequest(BaseModel):
    """Change password request."""
    old_password: str
    new_password: str = Field(..., min_length=6)


class ChangeEmailRequest(BaseModel):
    """Change email request."""
    password: str
    new_email: EmailStr


class ForgotPasswordRequest(BaseModel):
    """Request to send password reset email."""
    email: EmailStr


class DeleteAccountRequest(BaseModel):
    """Request to delete user account."""
    password: str


class AdminUserCreate(BaseModel):
    """Schema for admin to create a user manually."""
    email: EmailStr
    password: str
    name: str
    is_pro: bool = False
    tier: str = 'free'


class AdminCreate(BaseModel):
    """Schema for creating a new admin user."""
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str = Field(..., min_length=2, max_length=50)


class AdminUpdate(BaseModel):
    """Schema for updating an admin user."""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=6)


class AdminResponse(BaseModel):
    """Admin user response schema."""
    id: int
    email: str
    name: str
    is_admin: bool
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# =====================
# Subscription Schemas
# =====================

class SubscriptionCreateRequest(BaseModel):
    """Request to create a subscription."""
    tier: str = Field(..., description="Target subscription tier (plus, pro, premium)")


class PaymentIntentResponse(BaseModel):
    """Response for payment intent creation (Iyzico compatible)."""
    token: Optional[str] = None
    checkout_form_content: Optional[str] = None
    payment_page_url: Optional[str] = None
    status: str = "success"


class SubscriptionResponse(BaseModel):
    """Subscription status response."""
    is_pro: bool
    subscription_tier: str
    plan: Optional[str] = None
    expires_at: Optional[datetime] = None
    payment_last4: Optional[str] = None
    payment_brand: Optional[str] = None


class PaymentMethodUpdate(BaseModel):
    """Update payment method."""
    payment_last4: str = Field(..., min_length=4, max_length=4)
    payment_brand: str = Field(default='Visa')


class SubscriptionHistoryResponse(BaseModel):
    """Subscription history entry."""
    id: int
    action: str
    plan: Optional[str] = None
    amount: Optional[float] = None
    payment_last4: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class SubscriptionVerifyRequest(BaseModel):
    """Request to verify IAP receipt."""
    receipt_data: str = Field(..., min_length=10) # Encoded receipt or token
    platform: str = Field(..., pattern=r"^(ios|android|web)$") # 'ios' or 'android'
    product_id: str = Field(..., min_length=5) # e.g. 'com.chefvision.pro'
    price: Optional[float] = None
    currency: Optional[str] = None
