import asyncio
import google.generativeai as genai
import sys
import os

# Set working directory to project root to import settings
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.config import get_settings

async def test_gemini():
    settings = get_settings()
    print(f"Testing with API Key: {settings.gemini_api_key[:10]}...")
    
    genai.configure(api_key=settings.gemini_api_key)
    
    models_to_test = [
        settings.gemini_flash_model, 
        "gemini-2.0-flash", 
        "gemini-1.5-flash"
    ]
    
    for model_name in models_to_test:
        print(f"\n--- Testing Model: {model_name} ---")
        try:
            model = genai.GenerativeModel(model_name)
            print(f"Calling generate_content_async for {model_name}...")
            
            # Simple prompt
            task = model.generate_content_async("Merhaba, nasılsın? Çok kısa bir tarif öner.")
            
            # Wait with a timeout
            try:
                response = await asyncio.wait_for(task, timeout=15.0)
                print(f"SUCCESS: Received response from {model_name}")
                print(f"Response: {response.text[:100]}...")
            except asyncio.TimeoutError:
                print(f"FAILURE: Timeout (15s) reached for {model_name}")
            
        except Exception as e:
            print(f"ERROR with {model_name}: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_gemini())
