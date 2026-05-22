"""
Database migration script for adding subscription and payment fields.
Run this script once to add new columns to the existing SQLite database.
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "chefvision.db")


def migrate():
    print(f"[MIGRATE] Migrating database: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # List of columns to add to 'users' table
    new_user_columns = [
        ("is_pro", "BOOLEAN DEFAULT 0"),
        ("subscription_tier", "VARCHAR(50) DEFAULT 'free'"),
        ("subscription_expires_at", "DATETIME"),
        ("payment_last4", "VARCHAR(4)"),
        ("payment_brand", "VARCHAR(20)"),
        ("platform", "VARCHAR(20)"),
        ("original_transaction_id", "VARCHAR(255)"),
        ("purchase_token", "TEXT"),
    ]

    for col_name, col_type in new_user_columns:
        try:
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")
            print(f"  [OK] Added column: users.{col_name}")
        except sqlite3.OperationalError as e:
            if "duplicate column" in str(e).lower():
                print(f"  [SKIP] Column already exists: users.{col_name}")
            else:
                print(f"  [ERR] Error adding users.{col_name}: {e}")

    # Create subscription history table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_subscription_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            action VARCHAR(50) NOT NULL,
            plan VARCHAR(50),
            amount FLOAT,
            payment_last4 VARCHAR(4),
            platform VARCHAR(20),
            transaction_id VARCHAR(255),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
    print("  [OK] Table 'user_subscription_history' ensured")
    
    # Add new columns to user_subscription_history if table exists but columns don't
    history_columns = [
        ("platform", "VARCHAR(20)"),
        ("transaction_id", "VARCHAR(255)")
    ]
    
    for col_name, col_type in history_columns:
        try:
            cursor.execute(f"ALTER TABLE user_subscription_history ADD COLUMN {col_name} {col_type}")
            print(f"  [OK] Added column: user_subscription_history.{col_name}")
        except sqlite3.OperationalError as e:
            if "duplicate column" in str(e).lower():
                print(f"  [SKIP] Column already exists: user_subscription_history.{col_name}")
            else:
                pass # Ignore if table implies it or other error
                
    conn.commit()
    conn.close()
    print("[DONE] Migration complete!")


if __name__ == "__main__":
    migrate()

