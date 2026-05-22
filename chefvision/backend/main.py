from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
from app.config import get_settings
from app.database import init_db
from fastapi.responses import JSONResponse
from starlette.status import HTTP_503_SERVICE_UNAVAILABLE
from app.core.settings_store import settings_store
from app.routers import ingredients, recipes, auth, pantry, voice, subscription, admin, honeypot
from app.core.logger import logger

# Security Imports
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from app.core.rate_limiter import limiter, rate_limit_custom_handler
from app.core.cache import cache as redis_cache


settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database and redis on startup."""
    init_db()
    await redis_cache.connect() # Connect to Redis
    
    # Debug: Print all registered routes
    logger.info("--- Registered Routes ---")
    for route in app.routes:
        if hasattr(route, "path"):
            methods = ", ".join(route.methods) if hasattr(route, "methods") else "ANY"
            logger.info(f"{methods} {route.path}")
    logger.info("-----------------------\n")
    
    yield
    
    await redis_cache.disconnect() # Close Redis connection


# Create FastAPI app
app = FastAPI(
    title="ChefVision AI API",
    description="Akıllı yemek tarifi önerisi ve malzeme tanıma API'si - Gemini 3 destekli",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# --- Security Headers Middleware ---
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    # HSTS (Strict-Transport-Security) - Force HTTPS for 1 year
    # response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    
    # X-Frame-Options: Prevent Clickjacking
    response.headers["X-Frame-Options"] = "DENY"
    
    # X-Content-Type-Options: Prevent MIME sniffing
    response.headers["X-Content-Type-Options"] = "nosniff"
    
    # X-XSS-Protection: Enable XSS filtering (Legacy but good practice)
    response.headers["X-XSS-Protection"] = "1; mode=block"
    
    # Metadata Hiding
    response.headers["Server"] = "ChefVisionSecure"
    
    return response

# --- Rate Limiter Setup ---
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_custom_handler)
app.add_middleware(SlowAPIMiddleware)

# Middleware to check Maintenance Mode
@app.middleware("http")
async def check_maintenance_mode(request: Request, call_next):
    # Retrieve settings from store (in-memory)
    # Note: In a real app with multiple workers, in-memory store won't work perfectly sync.
    # But for a single worker (default uvicorn), it is fine.
    if settings_store.maintenance_mode:
        # Allow access to admin endpoints, docs, and authentication
        allowed_paths = [
            "/api/v1/admin", 
            "/api/v1/auth", 
            "/docs", 
            "/redoc", 
            "/openapi.json", 
            "/health",
            "/uploads" # Allow images to load
        ]
        
        # Check if the request path starts with any allowed path
        is_allowed = any(request.url.path.startswith(path) for path in allowed_paths)
        
        # Also allow OPTIONS requests for CORS
        if request.method == "OPTIONS":
            is_allowed = True

        if not is_allowed:
             return JSONResponse(
                status_code=HTTP_503_SERVICE_UNAVAILABLE,
                content={"detail": "Sistem şu anda bakım modundadır. Lütfen daha sonra tekrar deneyiniz."}
            )
            
    response = await call_next(request)
    return response

# CORS middleware for Flutter app
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=settings.api_v1_prefix)
app.include_router(ingredients.router, prefix=settings.api_v1_prefix)
app.include_router(recipes.router, prefix=settings.api_v1_prefix)
app.include_router(pantry.router, prefix=settings.api_v1_prefix)
app.include_router(voice.router, prefix=settings.api_v1_prefix)
app.include_router(subscription.router, prefix=settings.api_v1_prefix)
app.include_router(admin.router, prefix=settings.api_v1_prefix)
app.include_router(honeypot.router) # Catch scanners

# Serve uploaded files (avatars, etc.)
uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "ChefVision AI",
        "motto": "Dolabındakileri Gören, Cebini Düşünen Akıllı Şef",
        "version": "2.0.0",
        "ai_models": {
            "vision": settings.gemini_vision_model,
            "quick_recipes": settings.gemini_flash_model,
            "detailed_recipes": settings.gemini_flash_model
        },
        "docs": "/docs",
        "endpoints": {
            "auth": {
                "register": "/api/v1/auth/register",
                "login": "/api/v1/auth/login",
                "me": "/api/v1/auth/me"
            },
            "ingredients": {
                "analyze_image": "/api/v1/ingredients/analyze-image",
                "categories": "/api/v1/ingredients/categories"
            },
            "recipes": {
                "suggest": "/api/v1/recipes/suggest",
                "detail": "/api/v1/recipes/detail/{title}",
                "popular": "/api/v1/recipes/popular",
                "favorites": "/api/v1/recipes/favorites"
            },
            "pantry": {
                "list": "/api/v1/pantry/",
                "expiring": "/api/v1/pantry/expiring-soon",
                "shopping": "/api/v1/pantry/shopping"
            },
            "subscription": {
                "status": "/api/v1/subscription/status",
                "subscribe": "/api/v1/subscription/subscribe",
                "cancel": "/api/v1/subscription/cancel",
                "payment_method": "/api/v1/subscription/payment-method",
                "history": "/api/v1/subscription/history"
            }
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "ChefVision AI",
        "version": "2.0.0",
        "ai_ready": True
    }


if not settings.is_production:
    @app.get("/debug/routes")
    async def debug_routes():
        """List all registered routes for debugging (Dev only)."""
        routes = []
        for route in app.routes:
            if hasattr(route, "path"):
                methods = ", ".join(route.methods) if hasattr(route, "methods") else "ANY"
                routes.append(f"{methods} {route.path}")
        return {"routes": routes}
