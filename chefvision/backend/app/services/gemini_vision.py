import asyncio
import google.generativeai as genai
import base64
import json
from typing import List
from app.config import get_settings
from app.schemas.schemas import IngredientDetected

settings = get_settings()


def _clean_json_response(text: str) -> str:
    """Clean markdown wrappers from JSON response."""
    text = text.strip()
    if text.startswith("```"):
        parts = text.split("```")
        for part in parts:
            stripped = part.strip()
            if stripped.startswith("json"):
                return stripped[4:].strip()
            elif stripped.startswith("[") or stripped.startswith("{"):
                return stripped
    return text


class GeminiVisionService:
    """Service for analyzing food images using Gemini 3 Pro Vision API."""
    
    def __init__(self):
        genai.configure(api_key=settings.gemini_api_key)
        # Use Flash model for faster image analysis
        self.model = genai.GenerativeModel(settings.gemini_flash_model)
    
    async def analyze_image(self, image_base64: str, language: str = "tr") -> List[IngredientDetected]:
        """
        Analyze an image and detect food ingredients using Gemini 3 Pro.
        """
        try:
            # Decode base64 image
            image_data = base64.b64decode(image_base64)
            
            lang_name = {
                'tr': 'Türkçe', 'en': 'English', 'es': 'Español', 
                'fr': 'Français', 'de': 'Deutsch', 'it': 'Italiano'
            }.get(language, 'Türkçe')

            prompt = f"""
            Bu görüntüdeki yiyecek malzemelerini analiz et ve JSON formatında listele.
            
            Her malzeme için şu bilgileri ver:
            - name: İngilizce isim (Her zaman İngilizce kalsın, internal ID için)
            - name_tr: Türkçe isim
            - name_en: İngilizce isim
            - name_es: İspanyolca isim
            - name_fr: Fransızca isim
            - name_de: Almanca isim
            - name_it: İtalyanca isim
            - confidence: Tahmin güveni (0.0-1.0 arası)
            - category: Kategori (vegetables, fruits, dairy, meat, grains, spices, other)
            - quantity_estimate: Tahmini miktar (örn: "2", "500", "1") boşluk bırak ve yanına İNGİLİZCE birime göre yaz (adet için pcs, gram için g, kg, bunch, packet, jar). Toplam metin "{lang_name}" diline uygun olmasın, birimler hep ingilizce kod (pcs, g, kg vb.) ve rakamlar olsun. Örn "2 pcs", "500 g", "1 bunch"
            
            Sadece JSON array döndür, başka bir şey yazma.
            Örnek format:
            [
                {{
                    "name": "tomato",
                    "name_tr": "Domates",
                    "name_en": "Tomato",
                    "name_es": "Tomate",
                    "name_fr": "Tomate",
                    "name_de": "Tomate",
                    "name_it": "Pomodoro",
                    "confidence": 0.95,
                    "category": "vegetables",
                    "quantity_estimate": "3 pcs"
                }}
            ]
            
            Eğer görüntüde yiyecek yoksa boş array döndür: []
            """
            
            # Create image part for Gemini
            image_part = {
                "mime_type": "image/jpeg",
                "data": image_data
            }
            
            # Generate response with Gemini 3 Pro
            response = await asyncio.wait_for(
                self.model.generate_content_async([prompt, image_part]),
                timeout=30.0
            )
            
            response_text = response.text.strip()
            response_text = _clean_json_response(response_text)
            
            ingredients_data = json.loads(response_text)
            
            ingredients = [
                IngredientDetected(
                    name=item.get("name", "unknown"),
                    name_tr=item.get("name_tr", item.get("name", "Bilinmiyor")),
                    name_en=item.get("name_en", item.get("name", "Unknown")),
                    name_es=item.get("name_es", item.get("name", "Desconocido")),
                    name_fr=item.get("name_fr", item.get("name", "Inconnu")),
                    name_de=item.get("name_de", item.get("name", "Unbekannt")),
                    name_it=item.get("name_it", item.get("name", "Sconosciuto")),
                    confidence=float(item.get("confidence", 0.5)),
                    category=item.get("category", "other"),
                    quantity_estimate=item.get("quantity_estimate")
                )
                for item in ingredients_data
            ]
            
            return ingredients
            
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {e}")
            return []
        except Exception as e:
            print(f"Error analyzing image: {e}")
            raise


# Singleton instance
gemini_vision_service = GeminiVisionService()


def get_gemini_vision_service() -> GeminiVisionService:
    """Get the Gemini Vision service instance."""
    return gemini_vision_service
