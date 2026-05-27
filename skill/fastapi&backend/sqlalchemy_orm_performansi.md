<!-- 
BU SKİLL DOSYASI: SQLAlchemy ORM kullanan backend projelerinde N+1 sorgu problemlerini engellemek, 
veritabanı bağlantı havuzu (connection pool) sızıntılarını ve tükenmelerini önlemek ve 
sadece gerekli verilerin (eager loading, column selection) çekilmesini sağlamak amacıyla hazırlanmıştır.
-->

# SQLAlchemy ORM and Database Performance Rules

This guide defines strict rules for writing high-performance database interactions, avoiding the N+1 query problem, and managing connection pool lifecycles.

## The Rule

> [!IMPORTANT]
> **ALWAYS** use eager loading (`selectinload` or `joinedload`) when fetching relationship properties that will be accessed in lists or loops. Always manage database session scopes using FastAPI `Depends` to prevent connection leaks.

---

## 1. Preventing the N+1 Query Problem

### The Problem
When you fetch a list of database rows and then loop through them accessing a related attribute, SQLAlchemy fires a separate SQL query for *every* item in the list if lazy loading is enabled. This degrades performance exponentially.

### Incorrect Pattern
```python
@app.get("/recipes")
async def get_recipes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Recipe))
    recipes = result.scalars().all()
    
    # CRITICAL ERROR: Accessing recipe.ingredients inside a loop fires
    # a separate database query for EVERY recipe (N+1 queries).
    return [
        {"name": r.name, "ingredients": [i.name for i in r.ingredients]} 
        for r in recipes
    ]
```

### Correct Pattern
Use `selectinload` (recommended for 1-to-many/many-to-many) or `joinedload` (recommended for 1-to-1/many-to-1) to load the relationships in a single optimized query.
```python
from sqlalchemy.orm import selectinload

@app.get("/recipes")
async def get_recipes(db: AsyncSession = Depends(get_db)):
    # Correct: Force SQLAlchemy to fetch ingredients inside the initial query
    query = select(Recipe).options(selectinload(Recipe.ingredients))
    result = await db.execute(query)
    recipes = result.scalars().all()
    
    return [
        {"name": r.name, "ingredients": [i.name for i in r.ingredients]} 
        for r in recipes
    ]
```

---

## 2. Preventing Connection Session Leaks

### The Problem
Manually opening a session database connection without wrapping it in a try-finally block or using `Depends` can keep connections open permanently, causing pool exhaustion.

### Incorrect Pattern
```python
@app.get("/users")
async def get_users():
    # CRITICAL ERROR: Session is opened but never closed.
    # Connection remains active, leaking database pool resources.
    db = SessionLocal() 
    users = db.query(User).all()
    return users
```

### Correct Pattern
Use FastAPI's Dependency Injection pattern (`Depends`) yielding the session context. This guarantees that the session closes automatically after the request finishes.
```python
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session # Auto-closes session when the request cycle completes

@app.get("/users")
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    return result.scalars().all()
```

---

## 3. Columns Selection (Over-fetching Prevention)

### The Problem
Fetching entire model objects with many large columns (like text blobs or raw files) when you only need a single value (like a count or user name).

### Correct Pattern
Select only the columns you need using `select(...)` directly on attributes.
```python
# Querying only name and id instead of loading the full entity
query = select(User.id, User.name)
result = await db.execute(query)
users_list = result.all() # Returns a list of tuples containing only id and name
```
