import redis.asyncio as redis
import json
import os
from typing import Optional, Any
from app.config import get_settings

settings = get_settings()

# Redis Connection URL
# If running in Docker Compose with service name 'redis', use 'redis://redis:6379'
# If running locally without Docker, use 'redis://localhost:6379'
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

class RedisCache:
    def __init__(self):
        self.redis: Optional[redis.Redis] = None

    async def connect(self):
        """Establish Redis connection pool."""
        if not self.redis:
            self.redis = redis.from_url(
                REDIS_URL, 
                encoding="utf-8", 
                decode_responses=True,
                max_connections=10
            )
            # Test connection
            try:
                await self.redis.ping()
                print(f"✅ Redis connected at {REDIS_URL}")
            except Exception as e:
                print(f"⚠️ Redis connection failed: {e}")
                self.redis = None

    async def disconnect(self):
        """Close Redis connection."""
        if self.redis:
            await self.redis.close()

    async def get(self, key: str) -> Any:
        """Get value from Redis and deserialize JSON if needed."""
        if not self.redis:
            return None
        try:
            val = await self.redis.get(key)
            if val:
                return json.loads(val)
            return None
        except Exception:
            return None

    async def set(self, key: str, value: Any, ttl: int = 3600):
        """Serialize value to JSON and set in Redis with TTL."""
        if not self.redis:
            return
        try:
            json_val = json.dumps(value, ensure_ascii=False)
            await self.redis.set(key, json_val, ex=ttl)
        except Exception as e:
            print(f"Redis Set Error: {e}")

    async def delete(self, key: str):
        """Delete key from Redis."""
        if self.redis:
            await self.redis.delete(key)

# Global Instance
cache = RedisCache()
