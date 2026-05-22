import httpx
import json
import asyncio
from openai import OpenAI

async def test_local_llm():
    print("Testing Local LLM connection (LM Studio)...")
    base_url = "http://localhost:1234/v1"
    model_name = "turkish-gemma-9b-t1"
    
    client = OpenAI(base_url=base_url, api_key="not-needed")
    
    try:
        print(f"Connecting to {base_url}...")
        response = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": "Sen yardımcı bir aşçısın."},
                {"role": "user", "content": "Kısaca menemen nasıl yapılır?"}
            ],
            temperature=0.7,
            max_tokens=2048
        )
        print("\n--- Response ---")
        print(response.choices[0].message.content)
        print("\nSuccess! Backend can communicate with LM Studio.")
        
    except Exception as e:
        print(f"\nError: {e}")
        print("\nMake sure LM Studio is running, the 'Local Server' is ON, and the model is loaded.")

if __name__ == "__main__":
    asyncio.run(test_local_llm())
