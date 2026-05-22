from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
from app.database import get_db
from app.routers.auth import get_current_user
from app.models.models import User, UserPantry, Ingredient, ShoppingItem
from app.schemas.schemas import (
    PantryItemCreate, PantryItemResponse,
    ShoppingItemCreate, ShoppingItemResponse, ShoppingItemUpdate,
    ReceiptAnalysisResponse,
    VoiceCommandRequest, VoiceCommandResponse
)
from app.services.recipe_engine import get_recipe_engine

router = APIRouter(prefix="/pantry", tags=["pantry"])





# Category mapping for auto-detection
CATEGORY_MAP = {
    # Sebzeler
    'domates': 'vegetables', 'biber': 'vegetables', 'soğan': 'vegetables',
    'patates': 'vegetables', 'havuç': 'vegetables', 'patlıcan': 'vegetables',
    'kabak': 'vegetables', 'salatalık': 'vegetables', 'marul': 'vegetables',
    'ıspanak': 'vegetables', 'brokoli': 'vegetables', 'karnabahar': 'vegetables',
    'lahana': 'vegetables', 'kereviz': 'vegetables', 'turp': 'vegetables',
    'pırasa': 'vegetables', 'enginar': 'vegetables', 'bamya': 'vegetables',
    'semizotu': 'vegetables', 'roka': 'vegetables', 'maydanoz': 'vegetables',
    'dereotu': 'vegetables', 'taze soğan': 'vegetables', 'sarımsak': 'vegetables',
    # Meyveler
    'elma': 'fruits', 'portakal': 'fruits', 'muz': 'fruits',
    'limon': 'fruits', 'üzüm': 'fruits', 'çilek': 'fruits',
    'karpuz': 'fruits', 'kavun': 'fruits', 'armut': 'fruits',
    'kayısı': 'fruits', 'şeftali': 'fruits', 'kiraz': 'fruits',
    'erik': 'fruits', 'mandalina': 'fruits', 'nar': 'fruits',
    'incir': 'fruits', 'hurma': 'fruits', 'avokado': 'fruits',
    'ananas': 'fruits', 'kivi': 'fruits',
    # Et & Tavuk
    'tavuk': 'meat', 'et': 'meat', 'kıyma': 'meat', 'dana': 'meat',
    'kuzu': 'meat', 'hindi': 'meat', 'biftek': 'meat', 'pirzola': 'meat',
    'sucuk': 'meat', 'sosis': 'meat', 'pastırma': 'meat', 'jambon': 'meat',
    # Deniz Ürünleri
    'balık': 'seafood', 'karides': 'seafood', 'somon': 'seafood',
    'ton': 'seafood', 'levrek': 'seafood', 'hamsi': 'seafood',
    'midye': 'seafood', 'kalamar': 'seafood', 'alabalık': 'seafood',
    # Süt Ürünleri
    'süt': 'dairy', 'yoğurt': 'dairy', 'peynir': 'dairy',
    'tereyağı': 'dairy', 'kaymak': 'dairy', 'kefir': 'dairy',
    'krema': 'dairy', 'ayran': 'dairy', 'lor': 'dairy',
    'kaşar': 'dairy', 'beyaz peynir': 'dairy',
    # Yumurta
    'yumurta': 'eggs',
    # Tahıllar
    'un': 'grains', 'pirinç': 'grains', 'bulgur': 'grains',
    'yulaf': 'grains', 'mısır': 'grains', 'irmik': 'grains',
    'nişasta': 'grains',
    # Baklagiller
    'fasulye': 'legumes', 'nohut': 'legumes', 'mercimek': 'legumes',
    'bezelye': 'legumes', 'börülce': 'legumes', 'barbunya': 'legumes',
    # Makarna
    'makarna': 'pasta', 'erişte': 'pasta', 'şehriye': 'pasta',
    'lazanya': 'pasta', 'spagetti': 'pasta',
    # Ekmek & Fırın
    'ekmek': 'bakery', 'simit': 'bakery', 'pide': 'bakery',
    'bazlama': 'bakery', 'lavaş': 'bakery', 'poğaça': 'bakery',
    'börek': 'bakery', 'yufka': 'bakery', 'galeta': 'bakery',
    # Baharatlar
    'tuz': 'spices', 'karabiber': 'spices', 'pul biber': 'spices',
    'kekik': 'spices', 'kimyon': 'spices', 'zerdeçal': 'spices',
    'tarçın': 'spices', 'defne': 'spices', 'biberiye': 'spices',
    'nane': 'spices', 'sumak': 'spices',
    # Soslar & Çeşniler
    'salça': 'sauces', 'soya sosu': 'sauces', 'ketçap': 'sauces',
    'mayonez': 'sauces', 'hardal': 'sauces', 'sirke': 'sauces',
    'sos': 'sauces', 'nar ekşisi': 'sauces',
    # Yağlar
    'zeytinyağı': 'oils', 'sıvı yağ': 'oils', 'ayçiçek yağı': 'oils',
    'zeytin': 'oils',
    # İçecekler
    'su': 'beverages', 'meyve suyu': 'beverages', 'çay': 'beverages',
    'kahve': 'beverages', 'kola': 'beverages', 'gazoz': 'beverages',
    'soda': 'beverages', 'bira': 'beverages',
    # Atıştırmalıklar
    'cips': 'snacks', 'bisküvi': 'snacks', 'gofret': 'snacks',
    'kraker': 'snacks', 'çikolata': 'snacks',
    # Kuruyemiş
    'fındık': 'nuts', 'fıstık': 'nuts', 'ceviz': 'nuts',
    'badem': 'nuts', 'kaju': 'nuts', 'yer fıstığı': 'nuts',
    'antep fıstığı': 'nuts', 'leblebi': 'nuts', 'kuru üzüm': 'nuts',
    # Dondurulmuş
    'dondurma': 'frozen', 'donmuş': 'frozen', 'buzlu': 'frozen',
    # Konserve
    'konserve': 'canned', 'domates konservesi': 'canned',
    # Tatlı & Şeker
    'bal': 'sweets', 'şeker': 'sweets', 'reçel': 'sweets',
    'pekmez': 'sweets', 'helva': 'sweets', 'tahin': 'sweets',
    'puding': 'sweets',
}


def _guess_category(name: str) -> str:
    """Guess ingredient category from name."""
    name_lower = name.lower().strip()
    for key, cat in CATEGORY_MAP.items():
        if key in name_lower:
            return cat
    return 'other'

def _get_translations_dict(ingredient: Optional[Ingredient]) -> Optional[dict]:
    if not ingredient:
        return None
    base_name = ingredient.name_tr or ingredient.name
    return {
        "tr": ingredient.name_tr or ingredient.name,
        "en": ingredient.name_en or base_name,
        "es": ingredient.name_es or base_name,
        "fr": ingredient.name_fr or base_name,
        "de": ingredient.name_de or base_name,
        "it": ingredient.name_it or base_name,
    }


class PantryItemUpdate(BaseModel):
    quantity: Optional[float] = None
    unit: Optional[str] = None
    expires_at: Optional[datetime] = None


class BulkPantryItem(BaseModel):
    ingredient_name: str
    quantity: float = 1.0
    unit: str = "adet"
    expires_at: Optional[datetime] = None




@router.get("/expiring-soon", response_model=List[PantryItemResponse])
async def get_expiring_items(
    days: int = 3,
    accept_language: Optional[str] = Header("tr"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get pantry items expiring within specified days."""
    if current_user.subscription_tier in ['free', 'plus']:
         raise HTTPException(status_code=403, detail="Kiler takibi sadece Pro ve Premium paketlerde mevcuttur.")
    
    today = datetime.now().date()
    cutoff_date = today + timedelta(days=days)
    
    # expires_at'in tarih kısmını karşılaştırıyoruz
    items = db.query(UserPantry).filter(
        UserPantry.user_id == current_user.id,
        UserPantry.expires_at != None
    ).all()
    
    # Manuel filtreleme
    expiring_items = [i for i in items if i.expires_at.date() <= cutoff_date]
    
    lang = (accept_language or "tr").split(',')[0].split('-')[0].lower()
    if lang not in ['tr', 'en', 'es', 'fr', 'de', 'it']:
        lang = 'tr'

    result = []
    for item in expiring_items:
        expiry_date = item.expires_at.date()
        days_until_expiry = (expiry_date - today).days
        ingredient = db.query(Ingredient).filter(Ingredient.id == item.ingredient_id).first()
        
        if ingredient:
            ingredient_name = getattr(ingredient, f"name_{lang}", None) or ingredient.name_tr or ingredient.name
        else:
            ingredient_name = "Bilinmiyor"
            
        category = ingredient.category if ingredient else "other"
        
        result.append(PantryItemResponse(
            id=item.id,
            ingredient_name=ingredient_name,
            quantity=item.quantity,
            unit=item.unit,
            expires_at=item.expires_at,
            added_at=item.added_at,
            days_until_expiry=days_until_expiry,
            category=category or 'other',
            translations=_get_translations_dict(ingredient)
        ))
    
    return result


@router.get("/list", response_model=List[PantryItemResponse])
async def get_pantry_items(
    accept_language: Optional[str] = Header("tr"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all pantry items for the current user."""
    if current_user.subscription_tier in ['free', 'plus']:
         raise HTTPException(status_code=403, detail="Kiler takibi sadece Pro ve Premium paketlerde mevcuttur.")

    items = db.query(UserPantry).filter(UserPantry.user_id == current_user.id).all()
    
    lang = (accept_language or "tr").split(',')[0].split('-')[0].lower()
    if lang not in ['tr', 'en', 'es', 'fr', 'de', 'it']:
        lang = 'tr'

    result = []
    for item in items:
        days_until_expiry = None
        if item.expires_at:
            # Gün bazlı fark (saat farkından etkilenmez)
            today = datetime.now().date()
            expiry_date = item.expires_at.date()
            days_until_expiry = (expiry_date - today).days
        
        ingredient = db.query(Ingredient).filter(Ingredient.id == item.ingredient_id).first()
        if ingredient:
            ingredient_name = getattr(ingredient, f"name_{lang}", None) or ingredient.name_tr or ingredient.name
        else:
            ingredient_name = "Bilinmiyor"
            
        category = ingredient.category if ingredient else "other"
        
        result.append(PantryItemResponse(
            id=item.id,
            ingredient_name=ingredient_name,
            quantity=item.quantity,
            unit=item.unit,
            expires_at=item.expires_at,
            added_at=item.added_at,
            days_until_expiry=days_until_expiry,
            category=category or 'other',
            translations=_get_translations_dict(ingredient)
        ))
    
    return result


@router.post("/add", response_model=PantryItemResponse)
async def add_pantry_item(
    item: PantryItemCreate,
    accept_language: Optional[str] = Header("tr"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add item to pantry."""
    if current_user.subscription_tier in ['free', 'plus']:
         raise HTTPException(status_code=403, detail="Kiler takibi sadece Pro ve Premium paketlerde mevcuttur.")

    lang = (accept_language or "tr").split(',')[0].split('-')[0].lower()
    if lang not in ['tr', 'en', 'es', 'fr', 'de', 'it']:
        lang = 'tr'

    # Find ingredient by either the current language's name, Turkish name, or English name
    attr_lang = getattr(Ingredient, f"name_{lang}")
    ingredient = db.query(Ingredient).filter(
        (attr_lang.ilike(item.ingredient_name)) |
        (Ingredient.name_tr.ilike(item.ingredient_name)) |
        (Ingredient.name.ilike(item.ingredient_name))
    ).first()
    
    if not ingredient:
        engine = get_recipe_engine()
        translated = await engine.translate_ingredient(item.ingredient_name, lang)
        
        ingredient = Ingredient(
            name=translated.get("name", item.ingredient_name.lower()),
            name_tr=translated.get("name_tr", item.ingredient_name),
            name_en=translated.get("name_en", item.ingredient_name),
            name_es=translated.get("name_es", item.ingredient_name),
            name_fr=translated.get("name_fr", item.ingredient_name),
            name_de=translated.get("name_de", item.ingredient_name),
            name_it=translated.get("name_it", item.ingredient_name),
            category=translated.get("category", _guess_category(translated.get("name_tr", item.ingredient_name)))
        )
        db.add(ingredient)
        db.commit()
        db.refresh(ingredient)
    elif not ingredient.category or ingredient.category == 'other':
        guessed = _guess_category(ingredient.name_tr or item.ingredient_name)
        if guessed != 'other':
            ingredient.category = guessed
            db.commit()
    
    pantry_item = UserPantry(
        user_id=current_user.id,
        ingredient_id=ingredient.id,
        quantity=item.quantity,
        unit=item.unit,
        expires_at=item.expires_at
    )
    db.add(pantry_item)
    db.commit()
    db.refresh(pantry_item)
    
    days_until_expiry = None
    if pantry_item.expires_at:
        delta = pantry_item.expires_at - datetime.now()
        days_until_expiry = delta.days
    
    return PantryItemResponse(
        id=pantry_item.id,
        ingredient_name=getattr(ingredient, f"name_{lang}", None) or ingredient.name_tr or ingredient.name,
        quantity=pantry_item.quantity,
        unit=pantry_item.unit,
        expires_at=pantry_item.expires_at,
        added_at=pantry_item.added_at,
        days_until_expiry=days_until_expiry,
        category=ingredient.category or 'other',
        translations=_get_translations_dict(ingredient)
    )


@router.delete("/{item_id}")
async def delete_pantry_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove item from pantry."""
    if current_user.subscription_tier in ['free', 'plus']:
         raise HTTPException(status_code=403, detail="Kiler takibi sadece Pro ve Premium paketlerde mevcuttur.")
    item = db.query(UserPantry).filter(
        UserPantry.id == item_id,
        UserPantry.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Malzeme bulunamadı"
        )
    
    db.delete(item)
    db.commit()
    
    return {"success": True, "message": "Malzeme silindi"}


@router.put("/{item_id}", response_model=PantryItemResponse)
async def update_pantry_item(
    item_id: int,
    update: PantryItemUpdate,
    accept_language: Optional[str] = Header("tr"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update pantry item quantity, unit, or expiry."""
    if current_user.subscription_tier in ['free', 'plus']:
         raise HTTPException(status_code=403, detail="Kiler takibi sadece Pro ve Premium paketlerde mevcuttur.")
    item = db.query(UserPantry).filter(
        UserPantry.id == item_id,
        UserPantry.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Malzeme bulunamadı"
        )
    
    if update.quantity is not None:
        item.quantity = update.quantity
    if update.unit is not None:
        item.unit = update.unit
    if update.expires_at is not None:
        item.expires_at = update.expires_at
    
    db.commit()
    db.refresh(item)
    
    lang = (accept_language or "tr").split(',')[0].split('-')[0].lower()
    if lang not in ['tr', 'en', 'es', 'fr', 'de', 'it']:
        lang = 'tr'
        
    ingredient = db.query(Ingredient).filter(Ingredient.id == item.ingredient_id).first()
    if ingredient:
        ingredient_name = getattr(ingredient, f"name_{lang}", None) or ingredient.name_tr or ingredient.name
    else:
        ingredient_name = "Bilinmiyor"
        
    category = ingredient.category if ingredient else "other"
    
    days_until_expiry = None
    if item.expires_at:
        delta = item.expires_at - datetime.now()
        days_until_expiry = delta.days
    
    return PantryItemResponse(
        id=item.id,
        ingredient_name=ingredient_name,
        quantity=item.quantity,
        unit=item.unit,
        expires_at=item.expires_at,
        added_at=item.added_at,
        days_until_expiry=days_until_expiry,
        category=category or 'other',
        translations=_get_translations_dict(ingredient)
    )


@router.post("/bulk", response_model=List[PantryItemResponse])
async def add_bulk_pantry_items(
    items: List[BulkPantryItem],
    accept_language: Optional[str] = Header("tr"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add multiple items to pantry at once."""
    lang = (accept_language or "tr").split(',')[0].split('-')[0].lower()
    if lang not in ['tr', 'en', 'es', 'fr', 'de', 'it']:
        lang = 'tr'
        
    attr_lang = getattr(Ingredient, f"name_{lang}")
    
    results = []
    for bulk_item in items:
        ingredient = db.query(Ingredient).filter(
            (attr_lang.ilike(bulk_item.ingredient_name)) |
            (Ingredient.name_tr.ilike(bulk_item.ingredient_name)) |
            (Ingredient.name.ilike(bulk_item.ingredient_name))
        ).first()
        
        if not ingredient:
            engine = get_recipe_engine()
            translated = await engine.translate_ingredient(bulk_item.ingredient_name, lang)
            
            ingredient = Ingredient(
                name=translated.get("name", bulk_item.ingredient_name.lower()),
                name_tr=translated.get("name_tr", bulk_item.ingredient_name),
                name_en=translated.get("name_en", bulk_item.ingredient_name),
                name_es=translated.get("name_es", bulk_item.ingredient_name),
                name_fr=translated.get("name_fr", bulk_item.ingredient_name),
                name_de=translated.get("name_de", bulk_item.ingredient_name),
                name_it=translated.get("name_it", bulk_item.ingredient_name),
                category=translated.get("category", _guess_category(translated.get("name_tr", bulk_item.ingredient_name)))
            )
            db.add(ingredient)
            db.commit()
            db.refresh(ingredient)
        elif not ingredient.category or ingredient.category == 'other':
            guessed = _guess_category(ingredient.name_tr or bulk_item.ingredient_name)
            if guessed != 'other':
                ingredient.category = guessed
                db.commit()
        
        pantry_item = UserPantry(
            user_id=current_user.id,
            ingredient_id=ingredient.id,
            quantity=bulk_item.quantity,
            unit=bulk_item.unit,
            expires_at=bulk_item.expires_at
        )
        db.add(pantry_item)
        db.commit()
        db.refresh(pantry_item)
        
        days_until_expiry = None
        if pantry_item.expires_at:
            delta = pantry_item.expires_at - datetime.now()
            days_until_expiry = delta.days
        
        results.append(PantryItemResponse(
            id=pantry_item.id,
            ingredient_name=getattr(ingredient, f"name_{lang}", None) or ingredient.name_tr or ingredient.name,
            quantity=pantry_item.quantity,
            unit=pantry_item.unit,
            expires_at=pantry_item.expires_at,
            added_at=pantry_item.added_at,
            days_until_expiry=days_until_expiry,
            category=ingredient.category or 'other',
            translations=_get_translations_dict(ingredient)
        ))
    
    return results


# =====================
# Shopping List Endpoints
# =====================

@router.get("/shopping", response_model=List[ShoppingItemResponse])
async def get_shopping_list(
    accept_language: Optional[str] = Header("tr"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get shopping list."""
    if current_user.subscription_tier in ['free', 'plus']:
         raise HTTPException(status_code=403, detail="Alışveriş listesi sadece Pro ve Premium paketlerde mevcuttur.")

    lang = (accept_language or "tr").split(',')[0].split('-')[0].lower()
    if lang not in ['tr', 'en', 'es', 'fr', 'de', 'it']:
        lang = 'tr'

    items = db.query(ShoppingItem).filter(
        ShoppingItem.user_id == current_user.id
    ).order_by(ShoppingItem.is_checked, ShoppingItem.created_at.desc()).all()
    
    response_items = []
    for item in items:
        # Match with Ingredients table to get the localized name
        ingredient = db.query(Ingredient).filter(Ingredient.name_tr.ilike(item.ingredient_name)).first()
        loc_name = item.ingredient_name
        if ingredient:
             loc_name = getattr(ingredient, f"name_{lang}", None) or ingredient.name_tr or item.ingredient_name
             
        # Create response model but override ingredient_name
        resp_item = ShoppingItemResponse.model_validate(item)
        resp_item.ingredient_name = loc_name
        resp_item.translations = _get_translations_dict(ingredient)
        response_items.append(resp_item)
        
    return response_items


@router.post("/shopping", response_model=ShoppingItemResponse)
async def add_shopping_item(
    item: ShoppingItemCreate,
    accept_language: Optional[str] = Header("tr"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add item to shopping list."""
    if current_user.subscription_tier in ['free', 'plus']:
         raise HTTPException(status_code=403, detail="Alışveriş listesi sadece Pro ve Premium paketlerde mevcuttur.")
    
    lang = (accept_language or "tr").split(',')[0].split('-')[0].lower()
    if lang not in ['tr', 'en', 'es', 'fr', 'de', 'it']:
        lang = 'tr'
        
    attr_lang = getattr(Ingredient, f"name_{lang}")
    ingredient = db.query(Ingredient).filter(
        (attr_lang.ilike(item.ingredient_name)) |
        (Ingredient.name_tr.ilike(item.ingredient_name)) |
        (Ingredient.name.ilike(item.ingredient_name))
    ).first()
    
    if not ingredient:
        engine = get_recipe_engine()
        translated = await engine.translate_ingredient(item.ingredient_name, lang)
        
        ingredient = Ingredient(
            name=translated.get("name", item.ingredient_name.lower()),
            name_tr=translated.get("name_tr", item.ingredient_name),
            name_en=translated.get("name_en", item.ingredient_name),
            name_es=translated.get("name_es", item.ingredient_name),
            name_fr=translated.get("name_fr", item.ingredient_name),
            name_de=translated.get("name_de", item.ingredient_name),
            name_it=translated.get("name_it", item.ingredient_name),
            category=translated.get("category", _guess_category(translated.get("name_tr", item.ingredient_name)))
        )
        db.add(ingredient)
        db.commit()
        db.refresh(ingredient)
    elif not ingredient.category or ingredient.category == 'other':
        guessed = _guess_category(ingredient.name_tr or item.ingredient_name)
        if guessed != 'other':
            ingredient.category = guessed
            db.commit()

    shopping_item = ShoppingItem(
        user_id=current_user.id,
        ingredient_name=ingredient.name_tr or ingredient.name,
        quantity=item.quantity
    )
    db.add(shopping_item)
    db.commit()
    db.refresh(shopping_item)
    
    resp_item = ShoppingItemResponse.model_validate(shopping_item)
    resp_item.ingredient_name = getattr(ingredient, f"name_{lang}", None) or ingredient.name_tr or ingredient.name
    resp_item.translations = _get_translations_dict(ingredient)
    return resp_item


@router.put("/shopping/{item_id}", response_model=ShoppingItemResponse)
async def update_shopping_item(
    item_id: int,
    update: ShoppingItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update shopping item."""
    if current_user.subscription_tier in ['free', 'plus']:
         raise HTTPException(status_code=403, detail="Alışveriş listesi sadece Pro ve Premium paketlerde mevcuttur.")
    item = db.query(ShoppingItem).filter(
        ShoppingItem.id == item_id,
        ShoppingItem.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Öğe bulunamadı"
        )
    
    if update.ingredient_name is not None:
        item.ingredient_name = update.ingredient_name
    if update.quantity is not None:
        item.quantity = update.quantity
    if update.is_checked is not None:
        item.is_checked = update.is_checked
        
    db.commit()
    db.refresh(item)
    resp_item = ShoppingItemResponse.model_validate(item)
    ingredient = db.query(Ingredient).filter(Ingredient.name_tr.ilike(item.ingredient_name)).first()
    resp_item.translations = _get_translations_dict(ingredient)
    return resp_item


@router.put("/shopping/{item_id}/toggle")
async def toggle_shopping_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Toggle shopping item checked status."""
    if current_user.subscription_tier in ['free', 'plus']:
         raise HTTPException(status_code=403, detail="Alışveriş listesi sadece Pro ve Premium paketlerde mevcuttur.")
    item = db.query(ShoppingItem).filter(
        ShoppingItem.id == item_id,
        ShoppingItem.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Öğe bulunamadı"
        )
    
    item.is_checked = not item.is_checked
    db.commit()
    
    return {"success": True, "is_checked": item.is_checked}


@router.delete("/shopping/{item_id}")
async def delete_shopping_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove item from shopping list."""
    if current_user.subscription_tier in ['free', 'plus']:
         raise HTTPException(status_code=403, detail="Alışveriş listesi sadece Pro ve Premium paketlerde mevcuttur.")
    item = db.query(ShoppingItem).filter(
        ShoppingItem.id == item_id,
        ShoppingItem.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Öğe bulunamadı"
        )
    
    db.delete(item)
    db.commit()
    
    return {"success": True, "message": "Öğe silindi"}


@router.delete("/shopping/clear-checked")
async def clear_checked_items(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Clear all checked items from shopping list."""
    if current_user.subscription_tier in ['free', 'plus']:
         raise HTTPException(status_code=403, detail="Alışveriş listesi sadece Pro ve Premium paketlerde mevcuttur.")
    db.query(ShoppingItem).filter(
        ShoppingItem.user_id == current_user.id,
        ShoppingItem.is_checked == True
    ).delete()
    db.commit()
    
    return {"success": True, "message": "İşaretli öğeler silindi"}


# =====================
# Receipt Analysis Endpoints
# =====================

@router.post("/analyze-receipt")
async def analyze_receipt(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze a receipt image using Gemini 3 Flash."""
    if current_user.subscription_tier in ['free', 'plus']:
         raise HTTPException(status_code=403, detail="Fiş analizi sadece Pro ve Premium paketlerde mevcuttur.")

    engine = get_recipe_engine()
    
    # content_type web'den geldiğinde None olabilir, kontrol et
    ct = file.content_type or ""
    print(f"DEBUG analyze-receipt: filename={file.filename}, content_type={ct}, size_hint={file.size}")
    
    if ct and not ct.startswith("image/"):
        # Eğer content_type var ama resim değilse, yine de dosya uzantısına bak
        ext = (file.filename or "").lower().split(".")[-1] if file.filename else ""
        if ext not in ("jpg", "jpeg", "png", "webp", "gif", "bmp"):
            raise HTTPException(
                status_code=400, 
                detail=f"Geçerli bir resim dosyası gerekli. Gelen tip: {ct}"
            )
    
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Boş dosya")
    
    print(f"DEBUG analyze-receipt: dosya boyutu={len(contents)} byte")
    
    try:
        result = await engine.analyze_receipt(contents)
        print(f"DEBUG analyze-receipt: sonuç={result}")
        return result
    except Exception as e:
        print(f"ERROR analyze-receipt: {e}")
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "items": [],
            "message": f"Fiş analiz edilemedi: {str(e)}"
        }


@router.post("/voice-command", response_model=VoiceCommandResponse)
async def process_voice_command(
    request: VoiceCommandRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Process a voice command for pantry management."""
    if current_user.subscription_tier != 'premium':
         raise HTTPException(status_code=403, detail="Sesli komutlar sadece Premium pakette mevcuttur.")

    engine = get_recipe_engine()
    result = await engine.parse_voice_command(request.command_text)
    
    action = result.get("action")
    items = result.get("items", [])
    
    if action == "add" and items:
        for item in items:
            name = item.get("ingredient_name")
            if not name: continue
            
            # Find or create ingredient
            ingredient = db.query(Ingredient).filter(Ingredient.name_tr == name).first()
            if not ingredient:
                guessed_cat = _guess_category(name)
                ingredient = Ingredient(
                    name=name.lower(),
                    name_tr=name,
                    category=guessed_cat
                )
                db.add(ingredient)
                db.commit()
                db.refresh(ingredient)
            
            # Add to user pantry
            pantry_item = UserPantry(
                user_id=current_user.id,
                ingredient_id=ingredient.id,
                quantity=item.get("quantity", 1.0),
                unit=item.get("unit", "adet")
            )
            db.add(pantry_item)
        db.commit()
        
    elif action == "remove" and items:
        for item in items:
            name = item.get("ingredient_name")
            if not name: continue
            
            # Find pantry item and delete
            # Note: This is a simple exact match search. Could be improved.
            items_to_delete = db.query(UserPantry).join(Ingredient).filter(
                UserPantry.user_id == current_user.id,
                Ingredient.name_tr.ilike(f"%{name}%")
            ).all()
            
            for d_item in items_to_delete:
                db.delete(d_item)
        db.commit()
        
    return result


@router.get("/stats")
async def get_pantry_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get aggregate statistics for the user's pantry."""
    items = db.query(UserPantry).filter(UserPantry.user_id == current_user.id).all()
    
    total_count = len(items)
    expiring_soon_count = 0
    expired_count = 0
    now = datetime.now()
    cutoff = now + timedelta(days=3)
    
    category_counts = {}
    
    for item in items:
        # Category stats
        ingredient = db.query(Ingredient).filter(Ingredient.id == item.ingredient_id).first()
        cat = ingredient.category if ingredient else 'other'
        category_counts[cat] = category_counts.get(cat, 0) + 1
        
        # Expiry stats
        if item.expires_at:
            if item.expires_at < now:
                expired_count += 1
            elif item.expires_at <= cutoff:
                expiring_soon_count += 1
                
    # Calculate "Waste Prevention Score"
    waste_score = 100
    if total_count > 0:
        waste_penalty = (expired_count * 10) + (expiring_soon_count * 5)
        waste_score = max(0, 100 - (waste_penalty / total_count))
        
    return {
        "total_items": total_count,
        "expiring_soon": expiring_soon_count,
        "expired": expired_count,
        "category_distribution": category_counts,
        "waste_prevention_score": round(waste_score, 1)
    }
