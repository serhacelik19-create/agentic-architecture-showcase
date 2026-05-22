from sqlalchemy import create_engine, text
import os
import sys

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app.config import get_settings
except ImportError:
    sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "app"))
    from config import get_settings

def migrate():
    settings = get_settings()
    print(f"[MIGRATE] Veritabanı bağlantısı kuruluyor: {settings.database_url}")
    engine = create_engine(settings.database_url)

    # Sütun listesi ve tipleri
    columns_to_add = [
        ("is_pro", "BOOLEAN DEFAULT FALSE"),
        ("subscription_tier", "VARCHAR(50) DEFAULT 'free'"),
        ("subscription_expires_at", "TIMESTAMP WITH TIME ZONE"),
        ("recipe_generation_count", "INTEGER DEFAULT 0"),
        ("last_generation_date", "TIMESTAMP WITH TIME ZONE"),
        ("total_free_generations", "INTEGER DEFAULT 0"),
        ("payment_last4", "VARCHAR(4)"),
        ("payment_brand", "VARCHAR(20)")
    ]

    print("[MIGRATE] 'users' tablosuna eksik sütunlar kontrol ediliyor...")
    
    for col_name, col_type in columns_to_add:
        # Her sütun için taze bir bağlantı açıyoruz (Postgres transaction hatasını önlemek için)
        with engine.connect() as conn:
            # Transaction'ı manuel yönetmek için AUTOCOMMIT benzeri davranması için commit() kullanacağız
            try:
                # Sütun var mı kontrol et
                check_query = text(f"SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='{col_name}'")
                exists = conn.execute(check_query).fetchone()
                
                if not exists:
                    conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
                    conn.commit()
                    print(f"  [OK] Sütun eklendi: users.{col_name}")
                else:
                    print(f"  [SKIP] Sütun zaten mevcut: users.{col_name}")
            except Exception as e:
                print(f"  [ERR] {col_name} eklenirken hata: {e}")

    print("[MIGRATE] 'user_subscription_history' tablosu kontrol ediliyor...")
    with engine.connect() as conn:
        try:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS user_subscription_history (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    action VARCHAR(50) NOT NULL,
                    plan VARCHAR(50),
                    amount FLOAT,
                    payment_last4 VARCHAR(4),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                )
            """))
            conn.commit()
            print("  [OK] 'user_subscription_history' tablosu hazır.")
        except Exception as e:
            print(f"  [ERR] Tablo oluşturulurken hata: {e}")

    print("[DONE] Veritabanı onarımı tamamlandı.")

if __name__ == "__main__":
    migrate()
