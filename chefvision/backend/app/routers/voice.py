from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from app.database import get_db
from app.routers.auth import get_current_user, get_current_user_optional
from app.models.models import User, UserPantry, Ingredient
from app.services.voice_assistant import get_voice_assistant
import base64

router = APIRouter(prefix="/voice", tags=["voice-assistant"])


class VoiceInputRequest(BaseModel):
    """Voice input request."""
    text: str  # Transcribed speech
    include_pantry: bool = True
    recipe_context: Optional[dict] = None


class VoiceResponse(BaseModel):
    """Voice assistant response."""
    response: str
    action: Optional[str] = None
    action_data: Optional[dict] = None
    emotion: str = "helpful"


class CookingTipRequest(BaseModel):
    """Request for cooking tip."""
    recipe_title: str
    step_number: int


class TtsRequest(BaseModel):
    """Text-to-speech request."""
    text: str
    speed: float = 0.95  # Speaking rate (0.25 to 4.0)
    pitch: float = 1.0   # Pitch (-20.0 to 20.0)


@router.post("/tts")
async def text_to_speech(
    request: TtsRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Convert text to natural speech using Google Cloud TTS WaveNet.
    Returns MP3 audio as base64.
    Falls back to gTTS if Google Cloud is unavailable.
    """
    if current_user.subscription_tier in ['free', 'plus']:
         raise HTTPException(status_code=403, detail="Sesli okuma sadece Pro ve Premium paketlerde mevcuttur.")

    # Try Google Cloud TTS first (WaveNet - most natural)
    try:
        from google.cloud import texttospeech

        client = texttospeech.TextToSpeechClient()

        synthesis_input = texttospeech.SynthesisInput(text=request.text)

        voice = texttospeech.VoiceSelectionParams(
            language_code="tr-TR",
            name="tr-TR-Wavenet-D",  # Female WaveNet voice
            ssml_gender=texttospeech.SsmlVoiceGender.FEMALE,
        )

        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3,
            speaking_rate=request.speed,
            pitch=request.pitch,
        )

        response = client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config,
        )

        audio_base64 = base64.b64encode(response.audio_content).decode("utf-8")

        return {
            "success": True,
            "audio_base64": audio_base64,
            "format": "mp3",
            "voice": "tr-TR-Wavenet-D",
        }

    except Exception as e:
        print(f"⚠️ Google Cloud TTS unavailable: {e}. Using gTTS fallback.")

    # Fallback: gTTS (Google Translate TTS - free, decent quality)
    try:
        from gtts import gTTS
        import io

        tts = gTTS(text=request.text, lang="tr", slow=False)
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)

        audio_base64 = base64.b64encode(audio_buffer.read()).decode("utf-8")

        return {
            "success": True,
            "audio_base64": audio_base64,
            "format": "mp3",
            "voice": "gTTS-fallback",
        }
    except Exception as e2:
        raise HTTPException(status_code=500, detail=f"TTS hatası: {str(e2)}")




@router.post("/chat", response_model=VoiceResponse)
async def voice_chat(
    request: VoiceInputRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Process voice input and get AI response.
    Uses Gemini 3 Flash for real-time conversation.
    """
    if current_user.subscription_tier != 'premium':
         raise HTTPException(status_code=403, detail="AI Asistan sadece Premium pakette mevcuttur.")

    try:
        assistant = get_voice_assistant()



        # Get user's pantry items if requested
        user_pantry = None
        if request.include_pantry and current_user:
            pantry_items = db.query(UserPantry).filter(
                UserPantry.user_id == current_user.id
            ).all()

            user_pantry = []
            for item in pantry_items:
                ingredient = db.query(Ingredient).filter(
                    Ingredient.id == item.ingredient_id
                ).first()
                if ingredient:
                    user_pantry.append(ingredient.name_tr or ingredient.name)

        # Get user preferences
        user_preferences = {}
        if current_user:
            if current_user.diet_preferences:
                user_preferences["diet"] = current_user.diet_preferences
            if current_user.allergies:
                user_preferences["allergies"] = current_user.allergies.split(",")

        # Process with AI
        result = await assistant.process_voice_input(
            text=request.text,
            user_pantry=user_pantry,
            user_preferences=user_preferences if user_preferences else None,
            recipe_context=request.recipe_context
        )

        return VoiceResponse(**result)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Sesli asistan hatası: {str(e)}"
        )


@router.post("/cooking-tip")
async def get_cooking_tip(
    request: CookingTipRequest,
    current_user: User = Depends(get_current_user)
):
    """Get a helpful tip for a specific cooking step."""
    try:
        assistant = get_voice_assistant()
        tip = await assistant.get_cooking_tip(
            recipe_title=request.recipe_title,
            step_number=request.step_number
        )

        return {"success": True, "tip": tip}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"İpucu alınamadı: {str(e)}"
        )


@router.post("/clear-history")
async def clear_conversation_history(
    current_user: User = Depends(get_current_user)
):
    """Clear the conversation history."""
    assistant = get_voice_assistant()
    assistant.clear_history()

    return {"success": True, "message": "Konuşma geçmişi temizlendi"}
