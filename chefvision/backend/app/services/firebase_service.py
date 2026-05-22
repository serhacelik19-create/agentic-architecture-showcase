import httpx
from fastapi import HTTPException, status
from app.config import get_settings

class FirebaseService:
    def __init__(self):
        self.settings = get_settings()
        self.api_key = self.settings.firebase_api_key
        self.base_url = "https://identitytoolkit.googleapis.com/v1/accounts"

    def _get_url(self, endpoint: str) -> str:
        return f"{self.base_url}:{endpoint}?key={self.api_key}"

    async def create_user(self, email: str, password: str) -> tuple[str, str]:
        """
        Create a new user in Firebase Auth.
        Returns: (localId, idToken) -> (firebase_uid, id_token)
        """
        url = self._get_url("signUp")
        payload = {
            "email": email,
            "password": password,
            "returnSecureToken": True
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            data = response.json()
        
        if response.status_code != 200:
            error_msg = data.get('error', {}).get('message', 'Firebase User Creation Failed')
            # Map common errors
            if error_msg == "EMAIL_EXISTS":
                error_msg = "Bu email adresi zaten kullanımda (Firebase)."
                
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )
            
        return data.get("localId"), data.get("idToken")

    async def send_verification_email(self, id_token: str) -> bool:
        """
        Send email verification code (OOB code) to the user.
        """
        url = self._get_url("sendOobCode")
        payload = {
            "requestType": "VERIFY_EMAIL",
            "idToken": id_token
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            data = response.json()
        
        if response.status_code != 200:
            print(f"Failed to send verification email: {data}")
            return False
            
        return True

    async def send_password_reset_email(self, email: str) -> bool:
        """
        Send password reset email to the user.
        """
        url = self._get_url("sendOobCode")
        payload = {
            "requestType": "PASSWORD_RESET",
            "email": email
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            data = response.json()
            
        if response.status_code != 200:
            print(f"Failed to send password reset email: {data}")
            # We verify the email exists in our DB first, so this might be a Firebase limit or config issue
            return False
            
        return True

    async def get_user_info(self, id_token: str) -> dict:
        """Get user info using ID Token to check emailVerified status"""
        url = self._get_url("lookup")
        payload = {"idToken": id_token}
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            data = response.json()
        
        if response.status_code != 200:
            return None
            
        users = data.get("users", [])
        if not users:
            return None
            
        return users[0]
        
    async def sign_in_with_password(self, email: str, password: str) -> dict:
        """
        Sign in with password to get ID Token (needed for lookup if we don't have one).
        Use this during login to check verification status.
        """
        url = self._get_url("signInWithPassword")
        payload = {
            "email": email,
            "password": password,
            "returnSecureToken": True
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            data = response.json()
            
        if response.status_code != 200:
            return None
            
        return data

    async def update_email(self, id_token: str, new_email: str) -> bool:
        """
        Update user's email in Firebase.
        """
        url = self._get_url("update")
        payload = {
            "idToken": id_token,
            "email": new_email,
            "returnSecureToken": True
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            data = response.json()
            
        if response.status_code != 200:
            print(f"Failed to update email: {data}")
            return False
            
        return True

    async def delete_user(self, id_token: str) -> bool:
        """
        Delete a user account from Firebase using their ID Token.
        """
        url = self._get_url("delete")
        payload = {
            "idToken": id_token
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            
        if response.status_code != 200:
            data = response.json()
            print(f"Failed to delete Firebase user: {data}")
            return False
            
        return True

# Singleton instance
firebase_service = FirebaseService()
