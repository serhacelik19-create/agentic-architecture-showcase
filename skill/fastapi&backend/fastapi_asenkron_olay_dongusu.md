<!-- 
BU SKİLL DOSYASI: FastAPI backend projelerinde asenkron (async/await) yapı standartlarını korumak, 
endpoint'ler (route handlers) içindeki senkron bloklayıcı (blocking) kütüphane ve dosya/veritabanı çağrılarının 
event loop'u kilitlemesini engellemek ve doğru asenkron eşzamanlılık (concurrency) kalıplarını kurmak amacıyla hazırlanmıştır.
-->

# FastAPI Asynchronous Architecture and Event Loop Rules

This guide defines strict rules for using `async` / `await` in FastAPI endpoints, avoiding blocking operations in the event loop, and configuring async tasks safely.

## The Rule

> [!IMPORTANT]
> **NEVER** perform blocking I/O operations (synchronous database calls, synchronous network requests, or long-running CPU-bound calculations) directly inside an `async def` endpoint. These must either be run using asynchronous clients or offloaded to a thread pool.

---

## 1. Preventing Event Loop Blocking

### The Problem
If you define an endpoint with `async def`, FastAPI runs it directly on the single-threaded event loop. If that endpoint performs a synchronous blocking task (like using `time.sleep()` or synchronous database calls), it blocks the entire server. No other requests can be processed during that time.

### Incorrect Pattern
```python
import time
from fastapi import FastAPI

app = FastAPI()

@app.get("/items")
async def read_items():
    # CRITICAL ERROR: Blocks the single-threaded event loop for 2 seconds.
    # All concurrent users are stalled.
    time.sleep(2) 
    return {"message": "done"}
```

### Correct Patterns

#### Option A: Use non-blocking async functions
Use the asynchronous equivalent of the library.
```python
import asyncio
from fastapi import FastAPI

app = FastAPI()

@app.get("/items")
async def read_items():
    # Correct: Non-blocking yield to event loop
    await asyncio.sleep(2) 
    return {"message": "done"}
```

#### Option B: Define as a standard synchronous def
If you must write synchronous code, omit the `async` keyword. FastAPI will automatically run this endpoint in a separate thread pool.
```python
import time
from fastapi import FastAPI

app = FastAPI()

@app.get("/items")
def read_items():
    # Correct: FastAPI offloads this to an external thread pool
    time.sleep(2) 
    return {"message": "done"}
```

---

## 2. Asynchronous Databases with SQLAlchemy

### The Problem
AI agents frequently attempt to run standard synchronous SQLAlchemy queries inside `async def` endpoints, which blocks the event loop and raises runtime errors when integrating async drivers.

### Incorrect Pattern
```python
@app.get("/users/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    # CRITICAL ERROR: Synchronous database fetch inside an async endpoint
    user = db.query(User).filter(User.id == user_id).first() 
    return user
```

### Correct Pattern
Always use `AsyncSession` and execute queries asynchronously via `await db.execute(...)`.
```python
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

@app.get("/users/{user_id}")
async def get_user(user_id: int, db: AsyncSession = Depends(get_async_db)):
    # Correct: Asynchronous query execution
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    return user
```
