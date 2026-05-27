<!-- 
BU SKİLL DOSYASI: Backend uygulamalarında veri güvenliğini ve girdi doğrulamayı (input validation) 
en üst düzeye çıkarmak, SQL enjeksiyon (injection) zafiyetlerini parametrik sorgularla önlemek 
ve hassas verilerin (API anahtarları, şifreler vb.) kod içine gömülmesini (hardcoding) engelleyerek 
Pydantic BaseSettings ile güvenli yönetimini sağlamak amacıyla hazırlanmıştır.
-->

# Backend Security, Injection Prevention, and Secrets Rules

This guide defines strict rules for writing secure database queries, implementing input validation via Pydantic, and managing environment variables without security leaks.

## The Rule

> [!IMPORTANT]
> **NEVER** write database queries using string formatting or concatenation (e.g., f-strings) as it introduces severe SQL injection vulnerabilities. Always use parameterized queries or ORM abstractions, validate inputs using Pydantic, and keep credentials strictly outside the codebase.

---

## 1. Preventing SQL Injection Vulnerabilities

### The Problem
Building database queries using Python string formatting allows attackers to pass malicious input (like `' OR '1'='1`) to bypass authentication or delete tables.

### Incorrect Pattern
```python
@app.get("/items")
async def search_items(query: str, db: AsyncSession = Depends(get_db)):
    # CRITICAL SECURITY RISK: Input query is directly injected into the raw SQL string
    sql = f"SELECT * FROM items WHERE name = '{query}'" 
    result = await db.execute(text(sql))
    return result.all()
```

### Correct Pattern
Always use SQLAlchemy parameter binding or standard ORM select structures.
```python
@app.get("/items")
async def search_items(query: str, db: AsyncSession = Depends(get_db)):
    # Correct: Bind parameters safely to prevent SQL injection
    sql = text("SELECT * FROM items WHERE name = :query_param")
    result = await db.execute(sql, {"query_param": query})
    return result.all()
```

---

## 2. Input Validation via Pydantic

### The Problem
AI-generated code often accepts unvalidated dictionaries or types directly into routes, allowing invalid schemas or malformed JSON payloads to cause runtime crashes.

### Incorrect Pattern
```python
@app.post("/users")
async def create_user(payload: dict): // CRITICAL ERROR: Unvalidated dictionary input
    # Crashes with KeyError if payload is missing fields
    new_user = User(email=payload["email"], age=payload["age"]) 
    return {"status": "ok"}
```

### Correct Pattern
Define input boundaries using strict Pydantic schemas.
```python
from pydantic import BaseModel, EmailStr, Field

class UserCreateSchema(BaseModel):
    # Strict validation rules enforced at the boundary
    email: EmailStr
    age: int = Field(gt=0, lt=120, description="Age must be between 1 and 120")

@app.post("/users")
async def create_user(user_in: UserCreateSchema):
    # Safe input payload parsed automatically
    new_user = User(email=user_in.email, age=user_in.age)
    return {"status": "ok"}
```

---

## 3. Safe Management of Secrets (No Hardcoded Keys)

### The Problem
AI agents frequently insert API keys, secret strings, or database URLs directly into source files for easy connectivity.

### Incorrect Pattern
```python
# CRITICAL SECURITY RISK: Hardcoded API keys are easily leaked in Git history
GEMINI_API_KEY = "AIzaSyD-1234567890-xyz" 
```

### Correct Pattern
Always read configuration from environment variables. Use `pydantic-settings` to manage configuration schemas systematically.
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    gemini_api_key: str
    database_url: str

    class Config:
        env_file = ".env"

settings = Settings()

# Safe usage
api_key = settings.gemini_api_key
```
