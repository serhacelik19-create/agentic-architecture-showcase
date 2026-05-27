<!-- 
BU SKİLL DOSYASI: API entegrasyonlarında yapay zekanın olmayan (hallucinated) metot veya parametreleri 
uydurmasını engellemek, API rotalarında eksik bırakılan yetkilendirme (authorization) ve güvenlik kontrollerini 
tamamlamak ve dış servis entegrasyonlarında (Gemini, Firebase, Redis vb.) try-catch/timeout sınırlarını kurmak amacıyla hazırlanmıştır.
-->

# Backend API Hallucinations, Authorization, and Integration Rules

This guide defines strict rules for preventing API hallucinations, ensuring explicit authorization checks on all endpoints, and configuring secure external service integrations (e.g., Gemini, Firebase).

## The Rule

> [!IMPORTANT]
> **ALWAYS** verify third-party library versions (do not accept hallucinated API methods). Never leave empty `// TODO: auth` or `pass` placeholders on sensitive endpoints, and wrap all external API calls (such as Gemini or Firebase) in robust exception-handling blocks with connection timeouts.

---

## 1. Preventing API Hallucinations (SDK Validation)

### The Problem
AI coding agents commonly guess methods on third-party SDKs (such as Google GenAI, Firebase Admin, or Stripe) using patterns from other languages or completely hallucinating function signatures.

### Incorrect Pattern
```python
import google.generativeai as genai

# CRITICAL ERROR: The AI guessed "generate_image_and_text" which does not exist
response = genai.generate_image_and_text(
    prompt="Identify ingredients",
    image=raw_image
)
```

### Correct Pattern
Verify the correct SDK signature based on target versions. For Gemini integration, use the established structure:
```python
import google.generativeai as genai

async def analyze_ingredients(image_data):
    try:
        # Correct official structure for Gemini Vision / multimodal API
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = await model.generate_content_async(
            contents=["Identify the raw food ingredients in this image.", image_data]
        )
        return response.text
    except Exception as e:
        print(f"Gemini API failure: {e}")
        return None
```

---

## 2. Explicit Endpoint Authorization Guards

### The Problem
AI agents will often scaffold CRUD endpoints but omit the actual user authorization check, leaving comments like `# TODO: Check auth` or `pass`. This leaves admin routes or private data wide open.

### Incorrect Pattern
```python
@app.delete("/recipes/{recipe_id}")
async def delete_recipe(recipe_id: int, db: AsyncSession = Depends(get_db)):
    # CRITICAL SECURITY HOLE: AI omitted auth validation
    # TODO: Implement admin auth check
    recipe = await db.get(Recipe, recipe_id)
    await db.delete(recipe)
    await db.commit()
    return {"status": "deleted"}
```

### Correct Pattern
Always inject authorization dependencies and verify roles before completing destructive actions.
```python
from app.auth import get_current_admin_user

@app.delete("/recipes/{recipe_id}")
async def delete_recipe(
    recipe_id: int, 
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user) # Enforce validation at boundary
):
    recipe = await db.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
        
    await db.delete(recipe)
    await db.commit()
    return {"status": "deleted"}
```

---

## 3. Robust Third-Party Fail-Safes (Try-Catch & Timeouts)

### The Problem
Calling external services (like Firebase Auth token verification or Redis caching) without timeouts or exception handling. If the external service goes down or experiences latency, your backend hangs or crashes.

### Correct Pattern (Firebase Auth Verification)
Wrap auth checks and external requests in try-catch structures with connection safety.
```python
from firebase_admin import auth

async def verify_token_safely(token: str):
    try:
        # Verify token with external Firebase server
        decoded_token = auth.verify_id_token(token, check_revoked=True)
        return decoded_token
    except auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        # Fallback for general network/connectivity errors to Firebase
        raise HTTPException(status_code=503, detail="Auth service temporarily unavailable")
```
