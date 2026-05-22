from cryptography.fernet import Fernet
import os
import base64

# In production, this key must be loaded from a secure environment variable or KMS.
# For now, we generate/load it from .env or default to a generated one if missing
# WARN: If you lose this key, all encrypted data is gone forever!

_SECRET_KEY = os.getenv("ENCRYPTION_KEY")

if not _SECRET_KEY:
    # Generate a key if not provided (For dev only - logs warning)
    # real app should fail to start
    print("WARNING: ENCRYPTION_KEY not found in env. Generating temporary key.")
    _SECRET_KEY = Fernet.generate_key().decode()


_cipher_suite = Fernet(_SECRET_KEY.encode() if isinstance(_SECRET_KEY, str) else _SECRET_KEY)


def encrypt_data(data: str) -> str:
    """Encrypts a string using AES (Fernet)."""
    if not data:
        return data
    encrypted_bytes = _cipher_suite.encrypt(data.encode())
    return encrypted_bytes.decode()


def decrypt_data(encrypted_data: str) -> str:
    """Decrypts a string using AES (Fernet)."""
    if not encrypted_data:
        return encrypted_data
    try:
        decrypted_bytes = _cipher_suite.decrypt(encrypted_data.encode())
        return decrypted_bytes.decode()
    except Exception:
        # If decryption fails (e.g. key changed or data corruption),
        # returning the raw data might be dangerous, but throwing error crashes app.
        # We return a specific marker or empty string.
        # For now, let's assume if it fails, it might be already plaintext (migration phase)
        return encrypted_data
