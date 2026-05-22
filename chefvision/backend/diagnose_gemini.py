import google.generativeai as genai
import os
import traceback
from app.config import get_settings

def diagnose():
    with open("diagnosis.txt", "w", encoding="utf-8") as f:
        try:
            f.write("--- Diagnosis Started ---\n")
            
            # 1. Check API Key
            settings = get_settings()
            key = settings.gemini_api_key
            f.write(f"API Key present: {bool(key)}\n")
            if key:
                f.write(f"API Key start: {key[:5]}...\n")
            
            # 2. Configure
            genai.configure(api_key=key)
            f.write("Configuration successful.\n")
            
            # 3. List Models
            f.write("\n--- Available Models ---\n")
            try:
                found_any = False
                for m in genai.list_models():
                    if 'generateContent' in m.supported_generation_methods:
                        f.write(f"- {m.name}\n")
                        found_any = True
                if not found_any:
                    f.write("No models found with generateContent capability.\n")
            except Exception as e:
                f.write(f"Error listing models: {str(e)}\n")
                f.write(traceback.format_exc() + "\n")
                
            # 4. Test Generation (Simple)
            f.write("\n--- Test Generation (gemini-pro) ---\n")
            try:
                model = genai.GenerativeModel('gemini-pro')
                response = model.generate_content("Hello")
                f.write(f"Response: {response.text}\n")
            except Exception as e:
                f.write(f"Error testing gemini-pro: {str(e)}\n")
                
        except Exception as e:
            f.write(f"\nCRITICAL ERROR: {str(e)}\n")
            f.write(traceback.format_exc())

if __name__ == "__main__":
    diagnose()
