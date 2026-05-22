import asyncio
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.models import Ingredient, User
import asyncio
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.models import Ingredient, User

# Category mapping for auto-detection (Embedded to safeguard against import issues)
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

def seed_data():
    """Seed initial data into the database."""
    db = SessionLocal()
    try:
        print("🌱 Seeding initial data...")
        
        # 1. Seed Ingredients from CATEGORY_MAP
        print(f"   - Checking {len(CATEGORY_MAP)} ingredients...")
        count = 0
        for name, category in CATEGORY_MAP.items():
            exists = db.query(Ingredient).filter(Ingredient.name_tr == name).first()
            if not exists:
                ingredient = Ingredient(
                    name=name.lower(), # English placeholder
                    name_tr=name,
                    category=category
                )
                db.add(ingredient)
                count += 1
        
        if count > 0:
            db.commit()
            print(f"   ✅ Added {count} new ingredients.")
        else:
            print("   ✨ Ingredients already seeded.")

    except Exception as e:
        print(f"❌ Seeding failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
