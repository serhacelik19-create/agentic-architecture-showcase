from fastapi import APIRouter, Depends, HTTPException, status, Request, Header
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from typing import Any, List, Optional
import os
import json
import base64
import hashlib
import jwt
import requests
from cryptography import x509
from cryptography.hazmat.primitives.asymmetric import ec, padding, rsa
from app.config import get_settings
from app.database import get_db
from app.schemas.schemas import (
    SubscriptionResponse, SubscriptionHistoryResponse, PaymentIntentResponse,
    SubscriptionCreateRequest, SubscriptionVerifyRequest
)
from app.models.models import User, UserSubscriptionHistory
from app.routers.auth import get_current_user
from app.core.rate_limiter import limiter # Import Rate Limiter

router = APIRouter(prefix="/subscription", tags=["subscription"])

IOS_TIER_MAP = {
    'com.chefvision.plus': 'plus',
    'com.chefvision.pro': 'pro',
    'com.chefvision.premium': 'premium',
}

GOOGLE_ACTIVE_NOTIFICATION_TYPES = {1, 2, 4}
GOOGLE_INACTIVE_NOTIFICATION_TYPES = {3, 12, 13}


def _decode_jws_payload(signed_value: str) -> dict[str, Any]:
    parts = signed_value.split('.')
    if len(parts) != 3:
        raise ValueError("Invalid JWS format.")

    payload_b64_url = parts[1]
    payload_b64_url += "=" * ((4 - len(payload_b64_url) % 4) % 4)
    decoded_bytes = base64.urlsafe_b64decode(payload_b64_url)
    return json.loads(decoded_bytes.decode('utf-8'))


def _verify_cert_signature(cert: x509.Certificate, issuer_cert: x509.Certificate) -> None:
    issuer_public_key = issuer_cert.public_key()

    if isinstance(issuer_public_key, rsa.RSAPublicKey):
        issuer_public_key.verify(
            cert.signature,
            cert.tbs_certificate_bytes,
            padding.PKCS1v15(),
            cert.signature_hash_algorithm,
        )
    elif isinstance(issuer_public_key, ec.EllipticCurvePublicKey):
        issuer_public_key.verify(
            cert.signature,
            cert.tbs_certificate_bytes,
            ec.ECDSA(cert.signature_hash_algorithm),
        )
    else:
        raise ValueError("Unsupported certificate public key type.")


def _decode_and_verify_apple_jws(signed_value: str) -> dict[str, Any]:
    header = jwt.get_unverified_header(signed_value)
    if header.get("alg") != "ES256":
        raise ValueError("Unexpected Apple JWS algorithm.")

    x5c_chain = header.get("x5c")
    if not x5c_chain or len(x5c_chain) < 2:
        raise ValueError("Apple JWS certificate chain is missing.")

    certificates = [
        x509.load_der_x509_certificate(base64.b64decode(cert_b64))
        for cert_b64 in x5c_chain
    ]
    now = datetime.now(timezone.utc)

    for cert in certificates:
        not_before = cert.not_valid_before_utc
        not_after = cert.not_valid_after_utc
        if now < not_before or now > not_after:
            raise ValueError("Apple JWS certificate is outside its validity period.")

    for index in range(len(certificates) - 1):
        _verify_cert_signature(certificates[index], certificates[index + 1])

    root_cert = certificates[-1]
    _verify_cert_signature(root_cert, root_cert)

    subject = root_cert.subject.rfc4514_string()
    issuer = root_cert.issuer.rfc4514_string()
    if "Apple Root CA" not in subject or subject != issuer:
        raise ValueError("Apple JWS root certificate is not trusted.")

    return jwt.decode(
        signed_value,
        certificates[0].public_key(),
        algorithms=["ES256"],
        options={"verify_aud": False},
    )


def _build_apple_server_api_token(settings) -> Optional[str]:
    if not all([
        settings.apple_key_id,
        settings.apple_issuer_id,
        settings.apple_private_key,
    ]):
        return None

    issued_at = int(datetime.now(timezone.utc).timestamp())
    payload = {
        "iss": settings.apple_issuer_id,
        "iat": issued_at,
        "exp": issued_at + 300,
        "aud": "appstoreconnect-v1",
        "bid": settings.apple_bundle_id,
    }
    headers = {
        "alg": "ES256",
        "kid": settings.apple_key_id,
        "typ": "JWT",
    }
    private_key = settings.apple_private_key.replace("\\n", "\n")
    return jwt.encode(
        payload,
        private_key,
        algorithm="ES256",
        headers=headers,
    )


def _fetch_apple_transaction_payload(
    transaction_id: str,
    environment: Optional[str],
    settings,
) -> Optional[dict[str, Any]]:
    if not transaction_id:
        return None

    bearer_token = _build_apple_server_api_token(settings)
    if not bearer_token:
        return None

    is_sandbox = (environment or "").lower() == "sandbox"
    base_url = (
        "https://api.storekit-sandbox.itunes.apple.com"
        if is_sandbox
        else "https://api.storekit.itunes.apple.com"
    )

    response = requests.get(
        f"{base_url}/inApps/v1/transactions/{transaction_id}",
        headers={"Authorization": f"Bearer {bearer_token}"},
        timeout=10,
    )

    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="err_apple_receipt_failed")

    signed_transaction_info = response.json().get('signedTransactionInfo')
    if not signed_transaction_info:
        raise HTTPException(status_code=400, detail="err_apple_receipt_failed")

    return _decode_and_verify_apple_jws(signed_transaction_info)


def _parse_expiry_timestamp(value: Any) -> Optional[datetime]:
    if value in (None, "", 0, "0"):
        return None
    return datetime.fromtimestamp(int(value) / 1000.0, tz=timezone.utc)


def _build_ios_transaction_id(product_id: str, receipt_data: str) -> str:
    receipt_hash = hashlib.sha256(receipt_data.encode()).hexdigest()
    return f"{product_id}_{receipt_hash[:20]}"


def _find_user_by_android_purchase_token(db: Session, purchase_token: str) -> Optional[User]:
    candidates = (
        db.query(User)
        .filter(User.platform == 'android')
        .all()
    )
    for candidate in candidates:
        try:
            if candidate.purchase_token == purchase_token:
                return candidate
        except Exception:
            continue
    return None

@router.post("/verify", response_model=SubscriptionResponse)
@limiter.limit("5/minute")
async def verify_subscription(
    request: Request,
    body: SubscriptionVerifyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Verify In-App Purchase receipt from Google Play or App Store.
    Implements a Real Verification Stub (Production Ready Logic Pattern).
    """
    if not body.receipt_data:
        raise HTTPException(status_code=400, detail="err_receipt_missing")

    # --- CROSS-PLATFORM CHECK ---
    # Eğer adam Pro ise ama başka bir platformdan (android/ios vs) üye olduysa Apple üzerinden almasını/yenilemesini engelle
    is_valid_promo = getattr(current_user, 'promotional_expires_at', None) and current_user.promotional_expires_at > datetime.now(timezone.utc)
    if current_user.is_pro and current_user.platform and current_user.platform != body.platform and not is_valid_promo:
        if current_user.subscription_expires_at and current_user.subscription_expires_at > datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="err_already_pro_other_platform")

    # 2. Real Verification Logic
    verified_tier = None
    verified_expiry = None
    original_transaction_id = None
    transaction_id = None
    
    settings = get_settings()
    
    try:
        if body.platform == 'android':
            from google.oauth2 import service_account
            from googleapiclient.discovery import build
            
            # --- Android Verification ---
            # Requires GOOGLE_APPLICATION_CREDENTIALS to be set or passed explicitly
            # Scopes: https://www.googleapis.com/auth/androidpublisher
            
            if not settings.google_application_credentials or not os.path.exists(settings.google_application_credentials):
                 # Fallback for dev without creds: Pass if "android.test"
                 if "android.test" in body.product_id and settings.allow_test_purchase_bypass:
                     verified_tier = 'pro' # Mock
                     verified_expiry = datetime.now(timezone.utc) + timedelta(days=30)
                 else:
                    raise HTTPException(status_code=500, detail="err_google_credentials_missing")
            else:
                credentials = service_account.Credentials.from_service_account_file(
                    settings.google_application_credentials,
                    scopes=['https://www.googleapis.com/auth/androidpublisher']
                )
                
                service = build('androidpublisher', 'v3', credentials=credentials)
                
                # We need package_name, subscription_id (product_id), and token (receipt_data)
                # receipt_data from client should be the 'purchaseToken'
                
                try:
                    # Purchases.subscriptions.get
                    # Note: product_id might be 'com.chefvision.pro', but Google console ID might be just 'pro' 
                    # dependent on how you set it up. Assuming exact match for now.
                    
                    sub_status = service.purchases().subscriptions().get(
                        packageName=settings.google_play_package_name,
                        subscriptionId=body.product_id, # e.g. com.chefvision.pro
                        token=body.receipt_data
                    ).execute()
                    
                    # Check paymentState
                    # 0. Payment pending
                    # 1. Payment received
                    # 2. Free trial
                    # 3. Differed
                    
                    # expiryTimeMillis
                    
                    if 'expiryTimeMillis' in sub_status:
                        try:
                            expiry_ms = int(sub_status['expiryTimeMillis'])
                            verified_expiry = datetime.fromtimestamp(expiry_ms / 1000.0, tz=timezone.utc)
                            receipt_hash = hashlib.sha256(body.receipt_data.encode()).hexdigest()
                            
                            # Validate if expired
                            if verified_expiry < datetime.now(timezone.utc):
                                raise HTTPException(status_code=400, detail="err_subscription_expired")
                                
                            # Check payment state (Optional robustness check)
                            # 0: Pending, 1: Active, 2: Trial
                            payment_state = sub_status.get('paymentState')
                            if payment_state == 0:
                                raise HTTPException(status_code=400, detail="err_verification_failed") # Pending payment
                            
                            # Grant Tier
                            verified_tier = IOS_TIER_MAP.get(body.product_id)
                            transaction_id = sub_status.get('orderId') or f"{body.product_id}_{receipt_hash[:20]}"
                            original_transaction_id = transaction_id
                        except ValueError:
                            raise HTTPException(status_code=400, detail="err_google_receipt_invalid")
                        
                    else:
                         raise HTTPException(status_code=400, detail="err_google_receipt_invalid")
                         
                except Exception as e:
                     raise HTTPException(status_code=400, detail="err_google_verification_failed")

        elif body.platform == 'ios':
            # --- iOS Verification ---
            if body.receipt_data.startswith("eyJ"):
                try:
                    decoded_payload = _decode_and_verify_apple_jws(body.receipt_data)
                    server_payload = _fetch_apple_transaction_payload(
                        transaction_id=str(decoded_payload.get('transactionId') or decoded_payload.get('id') or ''),
                        environment=decoded_payload.get('environment'),
                        settings=settings,
                    )
                    verified_payload = server_payload or decoded_payload

                    product_id = verified_payload.get('productId')
                    bundle_id = verified_payload.get('bundleId')
                    if bundle_id and bundle_id != settings.apple_bundle_id:
                        raise HTTPException(status_code=400, detail="err_apple_receipt_failed")
                    if product_id != body.product_id:
                        raise HTTPException(status_code=400, detail="err_apple_receipt_failed")

                    verified_tier = IOS_TIER_MAP.get(product_id)
                    transaction_id = (
                        str(verified_payload.get('transactionId') or verified_payload.get('id') or '')
                        or _build_ios_transaction_id(product_id, body.receipt_data)
                    )
                    original_transaction_id = str(
                        verified_payload.get('originalTransactionId')
                        or transaction_id
                    )
                    verified_expiry = _parse_expiry_timestamp(
                        verified_payload.get('expiresDate')
                    ) or (datetime.now(timezone.utc) + timedelta(days=30))

                    if verified_expiry < datetime.now(timezone.utc):
                        raise HTTPException(status_code=400, detail="err_subscription_expired")

                except Exception as parse_err:
                    print(f"IAP StoreKit 2 Native Parse Error: {parse_err}")
                    raise HTTPException(status_code=400, detail="err_apple_receipt_failed")

            else:
                # --- StoreKit 1 (Legacy Base64) Verification ---
                # Apple'ın Önerdiği Üretim (Production) Algoritması: 
                # Önce Production URL'sine gönderilir, 21007 (Sandbox makbuzu) dönerse Sandbox URL'sine yönlendirilir.
                
                if not getattr(settings, 'apple_shared_secret', None):
                    raise HTTPException(status_code=500, detail="err_verification_service")

                url = "https://buy.itunes.apple.com/verifyReceipt"
                
                payload = {
                    "receipt-data": body.receipt_data,
                    "password": settings.apple_shared_secret
                }
                
                print(f"IAP Apple Request: Sending to {url}")
                response = requests.post(url, json=payload, timeout=10)
                data = response.json()
                
                # Eğer makbuz sandbox ortamından geliyorsa (21007), isteği Sandbox URL'ine yönlendir.
                if data.get('status') == 21007:
                    print("IAP Apple Request: 21007 received, App Store Reviewer or Sandbox Test detected. Retrying with Sandbox URL...")
                    url = "https://sandbox.itunes.apple.com/verifyReceipt"
                    response = requests.post(url, json=payload, timeout=10)
                    data = response.json()
                    
                print(f"IAP Apple Response Status: {data.get('status')}")
                
                if data.get('status') == 0:
                    # Doğrulama Başarılı
                    receipt_bundle_id = data.get('receipt', {}).get('bundle_id')
                    if receipt_bundle_id and receipt_bundle_id != settings.apple_bundle_id:
                        raise HTTPException(status_code=400, detail="err_apple_receipt_failed")

                    latest_info = data.get('latest_receipt_info', [])
                    if not latest_info and 'receipt' in data and 'in_app' in data['receipt']:
                        latest_info = data['receipt']['in_app']

                    matching_receipts = [
                        item for item in latest_info
                        if item.get('product_id') == body.product_id
                    ]
                    if not matching_receipts:
                        raise HTTPException(status_code=400, detail="err_apple_receipt_failed")

                    latest_sub = sorted(
                        matching_receipts,
                        key=lambda x: int(x.get('expires_date_ms', 0) or 0),
                        reverse=True,
                    )[0]

                    verified_tier = IOS_TIER_MAP.get(body.product_id)
                    transaction_id = latest_sub.get('transaction_id') or _build_ios_transaction_id(
                        body.product_id,
                        body.receipt_data,
                    )
                    original_transaction_id = latest_sub.get('original_transaction_id') or transaction_id

                    if latest_sub.get('cancellation_date_ms'):
                        raise HTTPException(status_code=400, detail="err_subscription_expired")

                    verified_expiry = _parse_expiry_timestamp(
                        latest_sub.get('expires_date_ms')
                    ) or (datetime.now(timezone.utc) + timedelta(days=30))

                    if verified_expiry < datetime.now(timezone.utc):
                        raise HTTPException(status_code=400, detail="err_subscription_expired")
                        
                else:
                    print(f"IAP Error Response from Apple: {data}")
                    raise HTTPException(status_code=400, detail="err_apple_receipt_failed")

        else:
             raise HTTPException(status_code=400, detail="err_platform_not_supported")

    except Exception as e:
        # If it was a known http exception (verification failure), re-raise
        if isinstance(e, HTTPException):
            raise e
        # Otherwise log and fail securely
        print(f"IAP Verification Critical Error: {e}")
        raise HTTPException(status_code=500, detail="err_verification_service")

    # 3. Determine Product and Grant Subscription
    if not verified_tier:
         raise HTTPException(status_code=400, detail="err_verification_failed")

    if not transaction_id:
        if body.platform == 'ios':
            transaction_id = _build_ios_transaction_id(body.product_id, body.receipt_data)
        else:
            receipt_hash = hashlib.sha256(body.receipt_data.encode()).hexdigest()
            transaction_id = f"{body.product_id}_{receipt_hash[:20]}"

    if not original_transaction_id:
        original_transaction_id = transaction_id

    existing_history = db.query(UserSubscriptionHistory).filter(
        UserSubscriptionHistory.transaction_id == transaction_id,
        UserSubscriptionHistory.action == 'iap_verify_success'
    ).first()

    if existing_history:
        if existing_history.user_id == current_user.id:
             return SubscriptionResponse(
                is_pro=current_user.is_pro,
                subscription_tier=current_user.subscription_tier or 'free',
                plan=current_user.subscription_tier,
                expires_at=current_user.subscription_expires_at,
                payment_last4="IAP"
            )
        raise HTTPException(status_code=400, detail="err_receipt_used_by_another_user")

    tier = verified_tier
        
    # 4. Execute Update
    try:
        current_user.is_pro = True
        current_user.subscription_tier = tier
        if verified_expiry:
            current_user.subscription_expires_at = verified_expiry
        else:
            # Fallback
            current_user.subscription_expires_at = datetime.now(timezone.utc) + timedelta(days=30)
        
        # Save IAP details
        current_user.platform = body.platform
        current_user.purchase_token = body.receipt_data
        current_user.original_transaction_id = original_transaction_id
        
        # Log History
        history = UserSubscriptionHistory(
            user_id=current_user.id,
            action='iap_verify_success',
            plan=tier,
            amount=body.price or 0.0,
            platform=body.platform,
            transaction_id=transaction_id,
            payment_last4="IAP"
        )
        db.add(history)
        db.commit()
        db.refresh(current_user)
        
        return SubscriptionResponse(
            is_pro=current_user.is_pro,
            subscription_tier=current_user.subscription_tier,
            plan=current_user.subscription_tier,
            expires_at=current_user.subscription_expires_at,
            payment_last4="IAP"
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="err_database_update")

@router.post("/create-subscription", response_model=PaymentIntentResponse)
async def create_subscription(
    request: SubscriptionCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Store-managed subscriptions must be created via App Store / Google Play.
    """
    raise HTTPException(
        status_code=410,
        detail="Subscriptions must be purchased through the store.",
    )


@router.post("/cancel", response_model=SubscriptionResponse)
async def cancel_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Store subscriptions must be cancelled in the store settings."""
    raise HTTPException(
        status_code=410,
        detail="Use App Store or Google Play subscription settings to cancel.",
    )

@router.get("/history", response_model=List[SubscriptionHistoryResponse])
async def get_subscription_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get subscription history."""
    history = (
        db.query(UserSubscriptionHistory)
        .filter(UserSubscriptionHistory.user_id == current_user.id)
        .order_by(UserSubscriptionHistory.created_at.desc())
        .limit(20)
        .all()
    )
    return [SubscriptionHistoryResponse.model_validate(h) for h in history]


@router.post("/apple-webhook", status_code=status.HTTP_200_OK)
async def apple_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Apple App Store Server Notifications Webhook.
    Receives events like DID_RENEW, CANCEL, EXPIRED.
    """
    try:
        body = await request.json()
        print(f"Apple Webhook Received: {body}")
        
        # Apple sends V2 notifications as a signed JWT encoded in 'signedPayload'
        signed_payload = body.get('signedPayload')
        
        if signed_payload:
            try:
                decoded = _decode_and_verify_apple_jws(signed_payload)
                notification_type = decoded.get('notificationType')
                data = decoded.get('data', {})
                signed_transaction_info = data.get('signedTransactionInfo')
                
                if signed_transaction_info:
                    transaction_data = _decode_and_verify_apple_jws(signed_transaction_info)
                    original_transaction_id = transaction_data.get('originalTransactionId')
                    expires_date = transaction_data.get('expiresDate') # in milliseconds
                    product_id = transaction_data.get('productId') # Find which product renewed
                    
                    if not original_transaction_id:
                        return {"status": "success"}

                    # Find user by original_transaction_id
                    user = db.query(User).filter(User.original_transaction_id == original_transaction_id).first()
                    if not user:
                        return {"status": "success", "message": "User not found"}
                        
                    if notification_type in ['DID_RENEW', 'SUBSCRIBED']:
                        user.is_pro = True
                        
                        if product_id:
                            # Assign the correct tier based on product ID
                            tier_map = {
                                'com.chefvision.plus': 'plus',
                                'com.chefvision.pro': 'pro',
                                'com.chefvision.premium': 'premium'
                            }
                            mapped_tier = tier_map.get(product_id)
                            if not mapped_tier:
                                return {"status": "success", "message": "Unknown product"}
                            user.subscription_tier = mapped_tier
                        
                        if expires_date:
                            user.subscription_expires_at = datetime.fromtimestamp(expires_date / 1000.0, tz=timezone.utc)
                            
                        # Log Renew History
                        history = UserSubscriptionHistory(
                            user_id=user.id,
                            action='iap_apple_renew',
                            plan=user.subscription_tier,
                            platform='ios',
                            transaction_id=transaction_data.get('transactionId')
                        )
                        db.add(history)
                        
                    elif notification_type in ['CANCEL', 'EXPIRED', 'DID_FAIL_TO_RENEW']:
                        user.is_pro = False
                        user.subscription_tier = 'free'
                        user.subscription_expires_at = None
                        
                        # Log Cancel History
                        history = UserSubscriptionHistory(
                            user_id=user.id,
                            action='iap_apple_cancel',
                            plan=None,
                            platform='ios',
                            transaction_id=transaction_data.get('transactionId')
                        )
                        db.add(history)
                        
                    db.commit()

            except Exception as jwt_e:
                print(f"Failed to decode Apple JWT: {jwt_e}")

        # Always return 200 OK so Apple knows we received it
        return {"status": "success"}

    except Exception as e:
        print(f"Apple webhook error: {e}")
        # Return 200 even on error to prevent Apple from retrying endlessly if it's our bug
        return {"status": "success"}


@router.post("/google-webhook", status_code=status.HTTP_200_OK)
async def google_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Google Play Real-Time Developer Notifications (RTDN).
    Receives base64 encoded JSON messages from Google Cloud Pub/Sub.
    """
    try:
        body = await request.json()
        print(f"Google Webhook Received: {body}")
        
        # Google sends a Pub/Sub message
        message = body.get('message', {})
        data_b64 = message.get('data')
        
        if data_b64:
            import base64
            import json
            
            try:
                decoded_bytes = base64.b64decode(data_b64)
                decoded_str = decoded_bytes.decode('utf-8')
                developer_notification = json.loads(decoded_str)
                
                subscription_notification = developer_notification.get('subscriptionNotification')
                if subscription_notification:
                    notification_type = subscription_notification.get('notificationType')
                    purchase_token = subscription_notification.get('purchaseToken')
                    subscription_id = subscription_notification.get('subscriptionId')
                    
                    # 1 = RECOVERED, 2 = RENEWED, 3 = CANCELED, 12 = REVOKED, 13 = EXPIRED
                    
                    if purchase_token:
                        user = _find_user_by_android_purchase_token(db, purchase_token)
                        if not user:
                            return {"status": "success", "message": "User not found"}

                        tier_map = {
                            'com.chefvision.plus': 'plus',
                            'com.chefvision.pro': 'pro',
                            'com.chefvision.premium': 'premium',
                            'plus': 'plus',
                            'pro': 'pro',
                            'premium': 'premium'
                        }
                        mapped_tier = tier_map.get(subscription_id)
                        if not mapped_tier:
                            return {"status": "success", "message": "Unknown product"}

                        if not settings.google_application_credentials or not os.path.exists(settings.google_application_credentials):
                            raise RuntimeError("Google credentials missing for RTDN processing.")

                        from google.oauth2 import service_account
                        from googleapiclient.discovery import build

                        credentials = service_account.Credentials.from_service_account_file(
                            settings.google_application_credentials,
                            scopes=['https://www.googleapis.com/auth/androidpublisher']
                        )
                        service = build('androidpublisher', 'v3', credentials=credentials)

                        if notification_type in GOOGLE_ACTIVE_NOTIFICATION_TYPES:
                            sub_status = service.purchases().subscriptions().get(
                                packageName=settings.google_play_package_name,
                                subscriptionId=subscription_id,
                                token=purchase_token
                            ).execute()
                            expiry_ms = int(sub_status.get('expiryTimeMillis', 0) or 0)
                            if expiry_ms <= 0:
                                raise RuntimeError("Missing Google subscription expiry.")

                            user.is_pro = True
                            user.subscription_tier = mapped_tier
                            user.subscription_expires_at = datetime.fromtimestamp(
                                expiry_ms / 1000.0,
                                tz=timezone.utc,
                            )

                            history = UserSubscriptionHistory(
                                user_id=user.id,
                                action='iap_google_renew',
                                plan=user.subscription_tier,
                                platform='android',
                                transaction_id=purchase_token[:64],
                            )
                            db.add(history)
                            db.commit()

                        elif notification_type in GOOGLE_INACTIVE_NOTIFICATION_TYPES:
                            user.is_pro = False
                            user.subscription_tier = 'free'
                            user.subscription_expires_at = None

                            history = UserSubscriptionHistory(
                                user_id=user.id,
                                action='iap_google_cancel',
                                plan=None,
                                platform='android',
                                transaction_id=purchase_token[:64],
                            )
                            db.add(history)
                            db.commit()
                        
            except Exception as decode_e:
                print(f"Failed to decode Google RTDN: {decode_e}")

        return {"status": "success"}

    except Exception as e:
        print(f"Google webhook error: {e}")
        return {"status": "success"}

