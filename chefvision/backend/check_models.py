import google.generativeai as genai
import os
from app.config import get_settings

settings = get_settings()
genai.configure(api_key=settings.gemini_api_key)

with open("models.txt", "w") as f:
    f.write("List of available models:\n")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                f.write(f"- {m.name}\n")
    except Exception as e:
        f.write(f"Error listing models: {e}\n")
