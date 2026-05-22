from typing import Optional, Any
import json
import redis.asyncio as redis
from app.config import get_settings

settings = get_settings()

class RedisService:
    def __init__(self):
        self.redis_url = settings.redis_url
        self.redis: Optional[redis.Redis] = None

    async def connect(self):
        """Connect to Redis."""
        try:
            self.redis = redis.from_url(
                self.redis_url, 
                encoding="utf-8", 
                decode_responses=True
            )
            await self.redis.ping()
            print(f"✅ Redis connected: {self.redis_url}")
        except Exception as e:
            print(f"❌ Redis connection failed: {e}")
            self.redis = None

    async def close(self):
        """Close Redis connection."""
        if self.redis:
            await self.redis.close()

    async def get(self, key: str) -> Optional[Any]:
        """Get value from Redis."""
        if not self.redis:
            return None
        try:
            value = await self.redis.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            print(f"⚠️ Redis get error ({key}): {e}")
            return None

    async def set(self, key: str, value: Any, expire: int = 3600):
        """Set value in Redis with expiration in seconds."""
        if not self.redis:
            return
        try:
            json_value = json.dumps(value)
            await self.redis.set(key, json_value, ex=expire)
        except Exception as e:
            print(f"⚠️ Redis set error ({key}): {e}")

    async def delete(self, key: str):
        """Delete key from Redis."""
        if not self.redis:
            return
        try:
            await self.redis.delete(key)
        except Exception as e:
            print(f"⚠️ Redis delete error ({key}): {e}")
            
    async def clear_prefix(self, prefix: str):
        """Delete all keys starting with prefix."""
        if not self.redis:
            return
        try:
            keys = await self.redis.keys(f"{prefix}*")
            if keys:
                await self.redis.delete(*keys)
        except Exception as e:
            print(f"⚠️ Redis clear_prefix error ({prefix}): {e}")

# Singleton instance
redis_service = RedisService()
