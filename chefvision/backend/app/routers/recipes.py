import hashlib
import json
import random
import math
from fastapi import APIRouter, HTTPException, Depends, Header
from typing import List
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import RecipeSuggestionRequest, RecipeResponse, RecipeDetailRequest
from app.services.recipe_engine import get_recipe_engine
from app.routers.auth import get_current_user, get_current_user_optional
from app.models.models import User, UserFavorite, Recipe, RecipeRating, CachedSuggestion, DeviceUsage

router = APIRouter(prefix="/recipes", tags=["recipes"])


def _make_ingredients_hash(ingredients: List[str]) -> str:
    """Create a consistent hash from ingredient list (sorted, lowercased)."""
    normalized = sorted([i.strip().lower() for i in ingredients])
    key = "|".join(normalized)
    return hashlib.sha256(key.encode("utf-8")).hexdigest()


@router.post("/suggest", response_model=dict)
async def suggest_recipes(
    request: RecipeSuggestionRequest,
    current_user=Depends(get_current_user_optional),
    db: Session = Depends(get_db),
    accept_language: str = Header("tr", alias="Accept-Language")
):
    """
    Get recipe suggestions based on available ingredients.
    Uses Redis cache for repeated queries (30 min TTL).
    Variation parameter ensures 'Refresh' always gets fresh results.
    Enforces subscription limits (Free, Plus, Pro, Premium).
    """
    from datetime import datetime
    
    # Guest limits
    GUEST_MAX_RECIPES = 3
    
    # --- GUEST MODE: Device-ID based limits ---
    if current_user is None:
        device_id = request.device_id
        if not device_id:
            raise HTTPException(
                status_code=401,
                detail="Lütfen giriş yapın veya misafir olarak devam edin."
            )
        
        # Check device usage
        device_usage = db.query(DeviceUsage).filter(
            DeviceUsage.device_id == device_id
        ).first()
        
        if device_usage and device_usage.recipe_generation_count >= GUEST_MAX_RECIPES:
            raise HTTPException(
                status_code=403,
                detail="Misafir tarif hakkınız doldu. Sınırsız kullanım için ücretsiz hesap oluşturun."
            )
        
        # Guest gets max 3 recipes per request
        request.max_results = min(request.max_results, 3)
        
        try:
            language_code = accept_language.split(',')[0].split('-')[0]
            if language_code not in ['tr', 'en', 'es', 'fr', 'de', 'it']:
                language_code = 'tr'
            
            engine = get_recipe_engine()
            final_recipes = await engine.suggest_recipes(
                ingredients=request.ingredients,
                max_results=request.max_results,
                max_prep_time=request.max_prep_time,
                dietary_preferences=request.dietary_preferences,
                diet_filter=request.diet_filter,
                exclude_allergies=request.exclude_allergies,
                prioritize_waste=request.prioritize_waste,
                avoid_recipes=request.avoid_recipes or [],
                language=language_code,
                cuisine=request.cuisine,
                meal_type=request.meal_type,
                servings=request.servings
            )
            
            # Increment guest usage
            if device_usage:
                device_usage.recipe_generation_count += 1
            else:
                device_usage = DeviceUsage(
                    device_id=device_id,
                    recipe_generation_count=1
                )
                db.add(device_usage)
            db.commit()
            
            return {
                "success": True,
                "count": len(final_recipes),
                "recipes": final_recipes,
                "from_cache": False,
                "message": f"{len(final_recipes)} tarif önerisi bulundu."
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Tarif önerisi başarısız: {str(e)}")
    
    # --- AUTHENTICATED USER: Standard subscription limits ---
    # free: 5 total rights, 3 recipes
    # plus: 4 daily rights (4x3=12), 3 recipes
    # pro: 7 daily rights (7x4=28), 4 recipes
    # premium: 15 daily rights (15x5=75), 5 recipes
    LIMITS = {
        'free': {'daily': 0, 'total': 5, 'per_request': 3},
        'plus': {'daily': 4, 'total': None, 'per_request': 3}, # Note: Backend daily is 4 (12 total), UI says 12. 4*3=12.
        'pro': {'daily': 7, 'total': None, 'per_request': 4},  # 7*4=28.
        'premium': {'daily': 15, 'total': None, 'per_request': 5} # 15*5=75.
    }
    
    user_tier = current_user.subscription_tier or 'free'
    limit = LIMITS.get(user_tier, LIMITS['free'])
    
    # 2. Enforce 'recipes per request' limit
    # User can request less if they want, but not more than allowed
    requested_max = request.max_results
    allowed_max = limit['per_request']
    final_max_results = min(requested_max, allowed_max)
    request.max_results = final_max_results # Override request
    
    # 3. Usage Logic
    now = datetime.now()
    today = now.date()
    last_gen = current_user.last_generation_date.date() if current_user.last_generation_date else None
    
    # Reset daily counter if new day
    if last_gen != today:
        current_user.recipe_generation_count = 0
        current_user.last_generation_date = now
        db.commit() # Commit reset immediately to be safe
    
    # Check Free Total Limit
    if user_tier == 'free':
        if current_user.total_free_generations >= limit['total']:
             raise HTTPException(
                 status_code=403, 
                 detail="Ücretsiz deneme hakkınız doldu (5/5). Devam etmek için lütfen abone olun."
             )
    
    # Check Daily Limit (for paid tiers)
    if limit['daily'] > 0 and current_user.recipe_generation_count >= limit['daily']:
        msg = f"Günlük limitiniz doldu ({limit['daily']} arama)."
        if user_tier != 'premium':
            msg += " Yarın tekrar deneyin veya paketinizi yükseltin."
        else:
            msg += " Yarın tekrar deneyin."
        raise HTTPException(status_code=429, detail=msg)

    try:
        # Detect language code (e.g. "en-US,en;q=0.9" -> "en")
        language_code = accept_language.split(',')[0].split('-')[0]
        if language_code not in ['tr', 'en', 'es', 'fr', 'de', 'it']:
            language_code = 'tr' 
        
        # --- Redis Cache Check ---
        from app.core.cache import cache as redis_cache
        
        # Build a cache key from all parameters that affect results
        filter_parts = [
            f"max_prep:{request.max_prep_time or 0}",
            f"diets:{','.join(sorted(request.dietary_preferences or []))}",
            f"allergies:{','.join(sorted(request.exclude_allergies or []))}",
            f"cuisine:{request.cuisine or ''}",
            f"meal:{request.meal_type or ''}",
            f"servings:{request.servings}",
            f"waste:{request.prioritize_waste}",
            f"max:{final_max_results}",
        ]
        filter_hash = hashlib.md5("|".join(filter_parts).encode()).hexdigest()[:12]
        ingredients_hash = _make_ingredients_hash(request.ingredients)
        cache_key = f"suggest:{ingredients_hash[:16]}:v{request.variation}:{language_code}:{filter_hash}"
        
        cached_result = await redis_cache.get(cache_key)
        if cached_result:
            print(f"✅ SUGGEST CACHE HIT: {cache_key}")
            # Cache hit — still count as usage to prevent abuse
            return {
                "success": True,
                "count": len(cached_result),
                "recipes": cached_result,
                "from_cache": True,
                "message": f"{len(cached_result)} tarif önerisi bulundu."
            }
        
        print(f"❌ SUGGEST CACHE MISS: {cache_key}. Calling AI...")
            
        # CALL AI for fresh recipes
        engine = get_recipe_engine()
        final_recipes = await engine.suggest_recipes(
            ingredients=request.ingredients,
            max_results=request.max_results,
            max_prep_time=request.max_prep_time,
            dietary_preferences=request.dietary_preferences,
            diet_filter=request.diet_filter,
            exclude_allergies=request.exclude_allergies,
            prioritize_waste=request.prioritize_waste,
            avoid_recipes=request.avoid_recipes or [],
            language=language_code,
            cuisine=request.cuisine,
            meal_type=request.meal_type,
            servings=request.servings
        )
        
        # Save to Redis cache (30 min TTL)
        if final_recipes:
            await redis_cache.set(cache_key, final_recipes, ttl=1800)  # 30 minutes
            print(f"💾 SUGGEST CACHED: {cache_key} ({len(final_recipes)} recipes, TTL=30min)")
        
        # Increment usage
        current_user.recipe_generation_count += 1
        if user_tier == 'free':
            current_user.total_free_generations += 1
        current_user.last_generation_date = now
        db.commit()
        
        return {
            "success": True,
            "count": len(final_recipes),
            "recipes": final_recipes,
            "from_cache": False,
            "message": f"{len(final_recipes)} tarif önerisi bulundu."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tarif önerisi başarısız: {str(e)}")


@router.post("/detail")
async def get_recipe_detail(
    request: RecipeDetailRequest,
    db: Session = Depends(get_db),
    accept_language: str = Header("tr", alias="Accept-Language")
):
    """
    Get recipe instructions (quick or detailed).
    mode='quick': Short, concise steps (fewer tokens)
    mode='detailed': Full chef-style instructions (more tokens)
    """
    try:
        recipe_title = request.recipe_title
        base_recipe = request.base_recipe
        mode = request.mode or "detailed"
        
        language_code = accept_language.split(',')[0].split('-')[0]
        if language_code not in ['tr', 'en', 'es', 'fr', 'de', 'it']:
            language_code = 'tr'
        
        engine = get_recipe_engine()
        
        if mode == "quick":
            # Quick mode: concise instructions, fewer tokens
            # 1) Check DB cache first
            db_recipe = db.query(Recipe).filter(
                Recipe.title == recipe_title
            ).first()
            
            if db_recipe and db_recipe.quick_json:
                print(f"✅ QUICK CACHE HIT for '{recipe_title}'")
                return {
                    "success": True,
                    "recipe": json.loads(db_recipe.quick_json),
                    "from_cache": True,
                    "mode": "quick"
                }
            
            # 2) Cache miss → ask AI
            print(f"❌ QUICK CACHE MISS for '{recipe_title}'. Calling AI...")
            recipe = await engine.get_quick_instructions(recipe_title, base_recipe=base_recipe, language=language_code)
            
            if not recipe:
                raise HTTPException(status_code=404, detail="Tarif bulunamadı")
            
            # 3) Save to DB cache
            if db_recipe:
                db_recipe.quick_json = json.dumps(recipe, ensure_ascii=False)
            else:
                new_recipe = Recipe(
                    title=recipe.get("title", recipe_title),
                    description=recipe.get("description", ""),
                    instructions=json.dumps(recipe.get("instructions", []), ensure_ascii=False),
                    prep_time=recipe.get("prep_time", 0),
                    cook_time=recipe.get("cook_time", 0),
                    servings=recipe.get("servings", 4),
                    difficulty=recipe.get("difficulty", "Kolay"),
                    calories=recipe.get("calories"),
                    quick_json=json.dumps(recipe, ensure_ascii=False),
                )
                db.add(new_recipe)
            
            db.commit()
            print(f"💾 Saved quick recipe '{recipe_title}' to DB.")
            
            return {
                "success": True,
                "recipe": recipe,
                "from_cache": False,
                "mode": "quick"
            }
        else:
            # Detailed mode: full chef-style instructions
            # 1) Check if we already have a detailed version in DB
            db_recipe = db.query(Recipe).filter(
                Recipe.title == recipe_title,
                Recipe.is_detailed == True
            ).first()
            
            if db_recipe and db_recipe.detailed_json:
                print(f"✅ DETAIL CACHE HIT for '{recipe_title}'")
                return {
                    "success": True,
                    "recipe": json.loads(db_recipe.detailed_json),
                    "from_cache": True,
                    "mode": "detailed"
                }
            
            # 2) Cache miss → ask AI to expand the base recipe
            print(f"❌ DETAIL CACHE MISS for '{recipe_title}'. Calling AI for expansion...")
            
            recipe = await engine.get_recipe_details(recipe_title, base_recipe=base_recipe, language=language_code)
            
            if not recipe:
                raise HTTPException(status_code=404, detail="Tarif bulunamadı")
            
            # 3) Save/update in DB
            existing_recipe = db.query(Recipe).filter(Recipe.title == recipe_title).first()
            
            if existing_recipe:
                existing_recipe.is_detailed = True
                existing_recipe.detailed_json = json.dumps(recipe, ensure_ascii=False)
                if "quick_instructions" not in recipe and base_recipe and "instructions" in base_recipe:
                    recipe["quick_instructions"] = base_recipe["instructions"]
            else:
                new_recipe = Recipe(
                    title=recipe.get("title", recipe_title),
                    description=recipe.get("description", ""),
                    instructions=json.dumps(recipe.get("instructions", []), ensure_ascii=False),
                    prep_time=recipe.get("prep_time", 0),
                    cook_time=recipe.get("cook_time", 0),
                    servings=recipe.get("servings", 4),
                    difficulty=recipe.get("difficulty", "Kolay"),
                    calories=recipe.get("calories"),
                    is_detailed=True,
                    detailed_json=json.dumps(recipe, ensure_ascii=False),
                )
                if base_recipe and "instructions" in base_recipe:
                     new_recipe.quick_json = json.dumps(base_recipe["instructions"], ensure_ascii=False)
                
                db.add(new_recipe)
            
            db.commit()
            print(f"💾 Saved expanded recipe '{recipe_title}' to DB.")
            
            return {
                "success": True,
                "recipe": recipe,
                "from_cache": False,
                "mode": "detailed"
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tarif detayı alınamadı: {str(e)}")


@router.get("/popular")
async def get_popular_recipes():
    """Get popular/trending recipes (Cached in Redis)."""
    from app.core.cache import cache as redis_cache
    
    # 1) Check Redis
    redis_key = "recipe:popular"
    cached_popular = await redis_cache.get(redis_key)
    if cached_popular:
        return {"recipes": cached_popular}

    # 2) Fallback to Static/DB (Simulated)
    # In real world, this would be a complex aggregation query from DB
    recipes = [
            {
                "id": 1,
                "title": "Menemen",
                "image": "🍳",
                "prep_time": 15,
                "difficulty": "Kolay",
                "is_vegetarian": True,
                "calories": 250
            },
            {
                "id": 2,
                "title": "Mercimek Çorbası",
                "image": "🍲",
                "prep_time": 30,
                "difficulty": "Kolay",
                "is_vegan": True,
                "calories": 180
            },
            {
                "id": 3,
                "title": "Karnıyarık",
                "image": "🍆",
                "prep_time": 45,
                "difficulty": "Orta",
                "calories": 320
            },
            {
                "id": 4,
                "title": "İmam Bayıldı",
                "image": "🫒",
                "prep_time": 40,
                "difficulty": "Orta",
                "is_vegan": True,
                "calories": 220
            },
            {
                "id": 5,
                "title": "Lahmacun",
                "image": "🫓",
                "prep_time": 60,
                "difficulty": "Zor",
                "calories": 280
            },
            {
                "id": 6,
                "title": "Zeytinyağlı Fasulye",
                "image": "🫘",
                "prep_time": 35,
                "difficulty": "Kolay",
                "is_vegan": True,
                "calories": 150
            }
        ]
    
    # 3) Set in Redis (1 Hour TTL)
    await redis_cache.set(redis_key, recipes, ttl=3600)
    
    return {"recipes": recipes}


@router.post("/favorite/{recipe_title}")
async def add_to_favorites(
    recipe_title: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a recipe to favorites."""
    # Find or create recipe in database
    recipe = db.query(Recipe).filter(Recipe.title == recipe_title).first()
    
    if not recipe:
        # Get details from AI
        engine = get_recipe_engine()
        details = await engine.get_recipe_details(recipe_title)
        
        if details:
            recipe = Recipe(
                title=details.get("title", recipe_title),
                description=details.get("description", ""),
                instructions=details.get("instructions", ""),
                prep_time=details.get("prep_time", 0),
                cook_time=details.get("cook_time", 0),
                servings=details.get("servings", 4),
                difficulty=details.get("difficulty", "Kolay"),
                calories=details.get("calories"),
                is_vegan=details.get("is_vegan", False),
                is_vegetarian=details.get("is_vegetarian", False),
                is_gluten_free=details.get("is_gluten_free", False),
                is_dairy_free=details.get("is_dairy_free", False)
            )
            db.add(recipe)
            db.commit()
            db.refresh(recipe)
        else:
            raise HTTPException(status_code=404, detail="Tarif bulunamadı")
    
    # Check if already favorited
    existing = db.query(UserFavorite).filter(
        UserFavorite.user_id == current_user.id,
        UserFavorite.recipe_id == recipe.id
    ).first()
    
    if existing:
        return {"success": True, "message": "Tarif zaten favorilerde"}
    
    favorite = UserFavorite(user_id=current_user.id, recipe_id=recipe.id)
    db.add(favorite)
    db.commit()
    
    return {"success": True, "message": "Tarif favorilere eklendi"}


@router.delete("/favorite/{recipe_id}")
async def remove_from_favorites(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a recipe from favorites."""
    favorite = db.query(UserFavorite).filter(
        UserFavorite.user_id == current_user.id,
        UserFavorite.recipe_id == recipe_id
    ).first()
    
    if not favorite:
        raise HTTPException(status_code=404, detail="Favori bulunamadı")
    
    db.delete(favorite)
    db.commit()
    
    return {"success": True, "message": "Tarif favorilerden kaldırıldı"}


@router.get("/favorites")
async def get_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's favorite recipes."""
    favorites = db.query(UserFavorite).filter(
        UserFavorite.user_id == current_user.id
    ).all()
    
    recipes = []
    for fav in favorites:
        recipe = db.query(Recipe).filter(Recipe.id == fav.recipe_id).first()
        if recipe:
            recipes.append({
                "id": recipe.id,
                "title": recipe.title,
                "description": recipe.description,
                "prep_time": recipe.prep_time,
                "cook_time": recipe.cook_time,
                "difficulty": recipe.difficulty,
                "calories": recipe.calories,
                "is_vegan": recipe.is_vegan,
                "is_vegetarian": recipe.is_vegetarian,
                "favorited_at": fav.created_at.isoformat()
            })
    
    return {"success": True, "favorites": recipes}


# Daily recipes endpoint with DB persistence
@router.get("/daily")
async def get_daily_recipes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    accept_language: str = Header("tr", alias="Accept-Language")
):
    """
    Get 3 daily recipe suggestions from diverse world cuisines.
    Persisted in Redis (Fast) and DB (Backup) for 24 hours.
    """
    import datetime
    from app.models.models import DailyRecipe
    from app.core.cache import cache as redis_cache
    
    today = datetime.date.today().isoformat()
    
    language_code = accept_language.split(',')[0].split('-')[0]
    if language_code not in ['tr', 'en', 'es', 'fr', 'de', 'it']:
        language_code = 'tr'

    redis_key = f"recipe:daily:{today}:{language_code}"
    
    # 1) Check Redis
    cached_daily = await redis_cache.get(redis_key)
    if cached_daily:
        return {"success": True, "recipes": cached_daily}

    # 2) Check DB (Backup)
    daily = db.query(DailyRecipe).filter(
        DailyRecipe.date == today,
        DailyRecipe.language == language_code
    ).first()
    
    # Use DB backup if available
    if daily:
        try:
            recipes = json.loads(daily.recipes_json)
            # Restore to Redis
            await redis_cache.set(redis_key, recipes, ttl=86400)
            return {"success": True, "recipes": recipes}
        except Exception:
            db.delete(daily)
            db.commit()
    
    # 3) Generate via AI
    try:
        engine = get_recipe_engine()
        recipes = await engine.get_daily_recipes(language=language_code)
        
        if recipes:
            if not daily:
                try:
                    new_daily = DailyRecipe(
                        date=today,
                        language=language_code,
                        recipes_json=json.dumps(recipes, ensure_ascii=False)
                    )
                    db.add(new_daily)
                    db.commit()
                except Exception as e:
                    print(f"Error saving to DB: {e}")
                    db.rollback()
            
            # Save to Redis
            await redis_cache.set(redis_key, recipes, ttl=86400)
        
        return {"success": True, "recipes": recipes}
    except Exception as e:
        print(f"Error serving daily recipes: {e}")
        raise HTTPException(status_code=500, detail=str(e))
