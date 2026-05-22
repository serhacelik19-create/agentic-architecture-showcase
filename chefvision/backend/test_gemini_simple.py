import google.generativeai as genai
import os
import sys

# API Key from config
API_KEY = "YOUR_GEMINI_API_KEY_HERE"

genai.configure(api_key=API_KEY)

print(f"Python version: {sys.version}")
try:
    print(f"google-generativeai version: {genai.__version__}")
except AttributeError:
    print("google-generativeai version: (Unknown, too old?)")

print(f"\nTesting Gemini API check...")

print("\n--- Listing Available Models ---")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
except Exception as e:
    print(f"Error listing models: {e}")

print("\n--- Trying gemini-pro (fallback) ---")
try:
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Hello")
    print(f"SUCCESS! Response: {response.text}")
except Exception as e:
    print(f"FAILED: {e}")
