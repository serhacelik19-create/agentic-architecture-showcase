from fastapi import APIRouter, Request, HTTPException
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

# This router is designed to catch bots and scanners.
# Any request to these endpoints is considered malicious.

router = APIRouter(tags=["honeypot"])

@router.get("/admin/login.php")
@router.post("/admin/login.php")
@router.get("/api/v1/system/config")
@router.get("/.env")
async def honeypot_trap(request: Request):
    """
    HONEYPOT: If you are here, you are banned.
    In a real scenario, we would add the IP to a Redis blacklist.
    For now, we simulate a 403 Forbidden or even a slow response to waste their time.
    """
    client_ip = request.client.host
    print(f"SECURITY ALERT: Malicious scan detected from {client_ip} on {request.url.path}")
    
    # We could actually ban them here using Redis
    # redis_client.set(f"ban:{client_ip}", "true", ex=86400) # Ban for 24 hours
    
    raise HTTPException(status_code=404, detail="Not Found") # Pretend it doesn't exist to confuse them
