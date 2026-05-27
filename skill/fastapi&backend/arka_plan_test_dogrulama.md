<!-- 
BU SKİLL DOSYASI: Python FastAPI projelerinde pytest standartlarını kurmak, 
httpx.AsyncClient kullanarak asenkron API rotalarını (integration tests) test etmek, 
veritabanı (SQLAlchemy) işlemlerini in-memory SQLite fixture'ları ile izole etmek ve 
dış servis bağımlılıklarını (Firebase Auth, Gemini API vb.) taklit (mock) etmek amacıyla hazırlanmıştır.
-->

# Backend Testing and API Validation Rules

This guide defines strict rules for writing unit and integration tests in Python FastAPI backends, using pytest, httpx, and database transaction containment.

## The Rule

> [!IMPORTANT]
> **NEVER** let backend integration tests modify production or seed databases. Always spin up a clean database session context (or SQLite in-memory instance) per test run, and mock external API client requests (like Gemini, Firebase, or external Webhooks).

---

## 1. FastAPI Route Integration Testing (httpx AsyncClient)

### The Problem
Using the synchronous FastAPI `TestClient` to test asynchronous routes can lead to async loop issues or thread deadlocks in specific drivers.

### Correct Pattern
Use `pytest-asyncio` and `httpx.AsyncClient` to perform non-blocking HTTP requests to the test API.
```python
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_read_items_route():
    # Construct async client block
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/items")
    
    # Assert conditions
    assert response.status_code == 200
    assert response.json() == {"status": "success", "items": []}
```

---

## 2. In-Memory SQLite / Postgres Database Fixtures

### The Problem
Writing tests that write directly to the development database leaves garbage data on local disk and risks corrupting actual developer data.

### Correct Pattern
Define a `pytest` fixture that overrides the database session dependency with a clean, in-memory SQLite connection for every test function.
```python
import pytest
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from app.main import app

# Setup local testing SQLite in-memory database
TEST_DB_URL = "sqlite+aiosqlite:///:memory:"
engine = create_async_engine(TEST_DB_URL, echo=False)
TestingSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

@pytest.fixture(autouse=True)
async def setup_test_db():
    # Create tables before test executes
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Drop tables after test completes
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session

# Override the database dependency in FastAPI app
app.dependency_overrides[get_db] = override_get_db
```

---

## 3. Mocking External Services (Firebase Auth & Gemini)

### The Problem
If the backend connects to Firebase to check authorization headers, running tests will fail if you don't send real, active client tokens.

### Correct Pattern
Mock authorization checks or external API responses using `pytest-mock` or `unittest.mock`.
```python
@pytest.mark.asyncio
async def test_delete_recipe_unauthorized(mocker):
    # Mock firebase verification to raise an expired token exception
    from firebase_admin import auth
    mocker.patch(
        "firebase_admin.auth.verify_id_token",
        side_effect=auth.ExpiredIdTokenError("Token expired", None)
    )

    async with AsyncClient(app=app, base_url="http://test") as ac:
        headers = {"Authorization": "Bearer expired-token"}
        response = await ac.delete("/recipes/1", headers=headers)

    # Verify endpoint catches external exceptions and returns standard JSON error
    assert response.status_code == 401
    assert response.json()["detail"] == "Token has expired"
```
