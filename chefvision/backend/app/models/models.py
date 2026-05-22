from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text, Boolean, JSON, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    """User model with authentication support."""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    device_id = Column(String(255), index=True, nullable=True)
    is_admin = Column(Boolean, default=False)
    
    # Firebase Auth
    firebase_uid = Column(String(128), index=True, nullable=True)
    verified = Column(Boolean, default=False)
    
    # Subscription fields
    is_pro = Column(Boolean, default=False)
    subscription_tier = Column(String(50), default='free')  # free, plus, pro, premium
    subscription_expires_at = Column(DateTime(timezone=True), nullable=True)
    promotional_expires_at = Column(DateTime(timezone=True), nullable=True)
    
    # Usage limits
    recipe_generation_count = Column(Integer, default=0)
    last_generation_date = Column(DateTime(timezone=True), nullable=True)
    total_free_generations = Column(Integer, default=0)

    # Payment info (masked)
    _payment_last4 = Column("payment_last4", String(255), nullable=True) # Encrypted
    payment_brand = Column(String(20), nullable=True)  # Visa, MasterCard, etc.
    
    # IAP Info
    platform = Column(String(20), nullable=True) # ios, android, web
    original_transaction_id = Column(String(255), nullable=True)
    _purchase_token = Column("purchase_token", Text, nullable=True) # Encrypted
    
    # Account Security
    session_id = Column(String(36), nullable=True, index=True) # For single active session
    device_change_count = Column(Integer, default=0) # For device lock limit
    
    # Dietary preferences (JSON stored as string)
    diet_preferences = Column(Text, nullable=True)  # vegan, vegetarian, glutenfree, etc.
    allergies = Column(Text, nullable=True)  # nuts, dairy, shellfish, etc.

    @property
    def purchase_token(self):
        from app.core.encryption import decrypt_data
        return decrypt_data(self._purchase_token)

    @purchase_token.setter
    def purchase_token(self, value):
        from app.core.encryption import encrypt_data
        self._purchase_token = encrypt_data(value)

    @property
    def payment_last4(self):
        from app.core.encryption import decrypt_data
        return decrypt_data(self._payment_last4)

    @payment_last4.setter
    def payment_last4(self, value):
        from app.core.encryption import encrypt_data
        self._payment_last4 = encrypt_data(value)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    pantry_items = relationship("UserPantry", back_populates="user", cascade="all, delete-orphan")
    favorites = relationship("UserFavorite", back_populates="user", cascade="all, delete-orphan")
    shopping_items = relationship("ShoppingItem", back_populates="user", cascade="all, delete-orphan")
    subscription_history = relationship("UserSubscriptionHistory", back_populates="user", cascade="all, delete-orphan")


class Ingredient(Base):
    """Ingredient model."""
    __tablename__ = "ingredients"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    name_tr = Column(String(255), nullable=True)  # Turkish name
    name_en = Column(String(255), nullable=True)  # English name
    name_es = Column(String(255), nullable=True)  # Spanish name
    name_fr = Column(String(255), nullable=True)  # French name
    name_de = Column(String(255), nullable=True)  # German name
    name_it = Column(String(255), nullable=True)  # Italian name
    category = Column(String(100), nullable=True)  # vegetables, fruits, dairy, etc.
    image_url = Column(String(500), nullable=True)
    calories_per_100g = Column(Float, nullable=True)
    protein_per_100g = Column(Float, nullable=True)
    carbs_per_100g = Column(Float, nullable=True)
    fat_per_100g = Column(Float, nullable=True)
    
    # Relationships
    pantry_items = relationship("UserPantry", back_populates="ingredient")
    recipe_ingredients = relationship("RecipeIngredient", back_populates="ingredient")


class UserPantry(Base):
    """User's pantry items with expiry tracking."""
    __tablename__ = "user_pantry"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), nullable=False)
    quantity = Column(Float, default=1.0)
    unit = Column(String(50), default="adet")  # pieces, grams, liters, etc.
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="pantry_items")
    ingredient = relationship("Ingredient", back_populates="pantry_items")


class Recipe(Base):
    """Recipe model with nutrition info."""
    __tablename__ = "recipes"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    instructions = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=True)
    prep_time = Column(Integer, default=0)  # minutes
    cook_time = Column(Integer, default=0)  # minutes
    servings = Column(Integer, default=4)
    difficulty = Column(String(50), default="Kolay")  # Kolay, Orta, Zor
    cuisine = Column(String(100), nullable=True)  # Turkish, Italian, etc.
    
    # Nutrition info
    calories = Column(Integer, nullable=True)
    protein = Column(Float, nullable=True)
    carbs = Column(Float, nullable=True)
    fat = Column(Float, nullable=True)
    
    # Dietary flags
    is_vegan = Column(Boolean, default=False)
    is_vegetarian = Column(Boolean, default=False)
    is_gluten_free = Column(Boolean, default=False)
    is_dairy_free = Column(Boolean, default=False)
    
    # Caching fields
    is_detailed = Column(Boolean, default=False)
    detailed_json = Column(Text, nullable=True)  # Full detailed recipe JSON from AI
    quick_json = Column(Text, nullable=True)  # Quick/summary recipe JSON from AI
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    ingredients = relationship("RecipeIngredient", back_populates="recipe", cascade="all, delete-orphan")
    favorites = relationship("UserFavorite", back_populates="recipe", cascade="all, delete-orphan")
    ratings = relationship("RecipeRating", back_populates="recipe", cascade="all, delete-orphan")


class RecipeIngredient(Base):
    """Recipe ingredients junction table."""
    __tablename__ = "recipe_ingredients"
    
    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), nullable=True)
    ingredient_name = Column(String(255), nullable=False)  # For AI-generated ingredients
    quantity = Column(String(100), nullable=True)  # "2 cups", "500g", etc.
    is_optional = Column(Boolean, default=False)
    
    # Relationships
    recipe = relationship("Recipe", back_populates="ingredients")
    ingredient = relationship("Ingredient", back_populates="recipe_ingredients")


class UserFavorite(Base):
    """User's favorite recipes."""
    __tablename__ = "user_favorites"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="favorites")
    recipe = relationship("Recipe", back_populates="favorites")


class RecipeRating(Base):
    """Recipe ratings and reviews."""
    __tablename__ = "recipe_ratings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    recipe = relationship("Recipe", back_populates="ratings")


class ShoppingItem(Base):
    """User's shopping list items."""
    __tablename__ = "shopping_items"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ingredient_name = Column(String(255), nullable=False)
    quantity = Column(String(100), nullable=True)
    is_checked = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="shopping_items")


class CachedSuggestion(Base):
    """Cache for ingredient-based recipe suggestions to avoid redundant AI calls."""
    __tablename__ = "cached_suggestions"
    
    id = Column(Integer, primary_key=True, index=True)
    ingredients_hash = Column(String(64), unique=True, index=True, nullable=False)
    ingredients_list = Column(Text, nullable=False)  # JSON string of sorted ingredients
    suggestions_json = Column(Text, nullable=False)  # Full JSON response from AI
    hit_count = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class DailyRecipe(Base):
    """Daily recipe suggestions cached for 24 hours."""
    __tablename__ = "daily_recipes"
    __table_args__ = (UniqueConstraint('date', 'language', name='uq_daily_date_language'),)

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String(10), index=True, nullable=False)  # YYYY-MM-DD
    language = Column(String(5), default='tr', nullable=False)
    recipes_json = Column(Text, nullable=False)  # JSON list of 3 recipes
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class UserSubscriptionHistory(Base):
    """Subscription payment history."""
    __tablename__ = "user_subscription_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String(50), nullable=False)  # subscribe, cancel, renew, payment_failed
    plan = Column(String(50), nullable=True)  # monthly, annual
    amount = Column(Float, nullable=True)
    payment_last4 = Column(String(4), nullable=True)
    platform = Column(String(20), nullable=True) # ios, android, web
    transaction_id = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="subscription_history")


class DeviceUsage(Base):
    """Tracks API usage for guests based on Device ID to prevent abuse."""
    __tablename__ = "device_usage"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String(255), unique=True, index=True, nullable=False)
    camera_scans_count = Column(Integer, default=0)
    recipe_generation_count = Column(Integer, default=0)
    last_used_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
