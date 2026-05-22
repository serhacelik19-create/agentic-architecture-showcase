from fastapi import APIRouter, HTTPException, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import ImageAnalysisRequest, ImageAnalysisResponse, IngredientResponse
from app.services.gemini_vision import get_gemini_vision_service
from app.routers.auth import get_current_user_optional
from app.models.models import DeviceUsage

router = APIRouter(prefix="/ingredients", tags=["ingredients"])

# Guest limits
GUEST_MAX_SCANS = 2


@router.post("/analyze-image", response_model=ImageAnalysisResponse)
async def analyze_image(
    request: ImageAnalysisRequest,
    current_user=Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Analyze an image to detect food ingredients.
    
    Accepts a base64 encoded image and returns a list of detected ingredients
    with confidence scores and categories.
    
    Guest users (no auth token) must provide a device_id.
    Their usage is tracked and limited to prevent abuse.
    """
    # Guest rate limiting via Device-ID
    if current_user is None:
        device_id = request.device_id
        if not device_id:
            raise HTTPException(
                status_code=401,
                detail="Lütfen giriş yapın veya misafir olarak devam edin."
            )
        
        # Check device usage
        device_usage = db.query(DeviceUsage).filter(
            DeviceUsage.device_id == device_id
        ).first()
        
        if device_usage and device_usage.camera_scans_count >= GUEST_MAX_SCANS:
            raise HTTPException(
                status_code=403,
                detail="Misafir tarama hakkınız doldu. Sınırsız kullanım için ücretsiz hesap oluşturun."
            )
    
    try:
        service = get_gemini_vision_service()
        ingredients = await service.analyze_image(request.image_base64)
        
        # Increment guest usage on success
        if current_user is None and request.device_id:
            device_usage = db.query(DeviceUsage).filter(
                DeviceUsage.device_id == request.device_id
            ).first()
            
            if device_usage:
                device_usage.camera_scans_count += 1
            else:
                device_usage = DeviceUsage(
                    device_id=request.device_id,
                    camera_scans_count=1
                )
                db.add(device_usage)
            db.commit()
        
        return ImageAnalysisResponse(
            success=True,
            ingredients=ingredients,
            message=f"{len(ingredients)} malzeme tespit edildi."
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Görüntü analizi başarısız: {str(e)}")


@router.get("/categories")
async def get_ingredient_categories():
    """Get available ingredient categories."""
    return {
        "categories": [
            {"id": "vegetables", "name": "Sebzeler", "icon": "🥬"},
            {"id": "fruits", "name": "Meyveler", "icon": "🍎"},
            {"id": "dairy", "name": "Süt Ürünleri", "icon": "🧀"},
            {"id": "meat", "name": "Et Ürünleri", "icon": "🥩"},
            {"id": "grains", "name": "Tahıllar", "icon": "🌾"},
            {"id": "spices", "name": "Baharatlar", "icon": "🌶️"},
            {"id": "other", "name": "Diğer", "icon": "🍽️"}
        ]
    }
