import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from app.config import get_settings

def check_connection():
    settings = get_settings()
    url = settings.database_url
    print(f"Testing connection to: {url}")
    
    try:
        engine = create_engine(url)
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ Connection verified successfully!")
            return True
    except OperationalError as e:
        print("\n❌ Connection Failed!")
        print(f"Error details: {e}")
        print("\nOlası Sebepler:")
        if "password authentication failed" in str(e):
            print("- Kullanıcı adı veya şifre yanlış.")
        elif "does not exist" in str(e):
            print("- Veritabanı ('chefvision_db') oluşturulmamış.")
        elif "Connection refused" in str(e):
            print("- PostgreSQL servisi çalışmıyor veya port (5432) kapalı.")
        return False
    except Exception as e:
        print(f"\n❌ Unexpected Error: {e}")
        return False

if __name__ == "__main__":
    check_connection()
