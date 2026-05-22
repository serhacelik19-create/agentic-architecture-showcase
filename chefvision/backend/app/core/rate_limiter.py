from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, Response

# Initialize Limiter
# By default, use remote address (IP) as identifier.
# In production, behind a proxy (Nginx/Cloudflare), you might need 'X-Forwarded-For'.
limiter = Limiter(key_func=get_remote_address)

def rate_limit_custom_handler(request: Request, exc: RateLimitExceeded) -> Response:
    """
    Custom handler for Rate Limit Exceeded errors.
    Return a JSON response with a clear message and 429 status code.
    """
    response = Response(
        content='{"detail": "Çok fazla istek gönderdiniz. Lütfen bir süre bekleyin."}',
        media_type="application/json",
        status_code=429,
    )
    # Add Retry-After header if available in exception
    # response = exc.headers 
    return response
