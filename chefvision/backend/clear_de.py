from app.database import Base, engine
from app.models.models import (
    User, Ingredient, UserPantry, Recipe, RecipeIngredient, 
    UserFavorite, RecipeRating, ShoppingItem, CachedSuggestion, 
    DailyRecipe, UserSubscriptionHistory
)
# Gerekli tüm modelleri import ettiğinizden emin olun

print("Veritabanı tabloları siliniyor...")
Base.metadata.drop_all(bind=engine)
print("Veritabanı tabloları yeniden oluşturuluyor...")
Base.metadata.create_all(bind=engine)
print("Veritabanı sıfırlandı!")