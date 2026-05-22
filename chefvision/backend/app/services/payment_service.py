import stripe
from app.config import get_settings

settings = get_settings()
stripe.api_key = settings.stripe_secret_key

class PaymentService:
    def __init__(self):
        # Now fetches from .env via config.py
        self.price_id_monthly = settings.stripe_price_id_monthly

    async def create_customer(self, name: str, email: str) -> str:
        """Create a new Stripe customer."""
        try:
            customer = stripe.Customer.create(
                email=email,
                name=name,
            )
            return customer.id
        except stripe.error.StripeError as e:
            print(f"Stripe Customer Error: {e}")
            raise e

    async def create_monthly_subscription(self, customer_id: str) -> dict:
        """
        Create a monthly subscription for the customer.
        Returns the client_secret for the payment sheet.
        """
        try:
            # 1. Create Subscription
            # payment_behavior='default_incomplete' önemli: Ödeme yapılana kadar aktif olmaz.
            subscription = stripe.Subscription.create(
                customer=customer_id,
                items=[{'price': self.price_id_monthly}],
                payment_behavior='default_incomplete',
                payment_settings={'save_default_payment_method': 'on_subscription'},
                expand=['latest_invoice.payment_intent'],
            )

            # 2. Extract Client Secret
            invoice = subscription.latest_invoice
            payment_intent = invoice.payment_intent
            client_secret = payment_intent.client_secret

            return {
                "subscription_id": subscription.id,
                "client_secret": client_secret,
                "ephemeral_key": self._create_ephemeral_key(customer_id)
            }
        except stripe.error.StripeError as e:
            print(f"Stripe Subscription Error: {e}")
            raise e

    def _create_ephemeral_key(self, customer_id: str) -> str:
        """Create ephemeral key for customer (required for Mobile SDK)."""
        key = stripe.EphemeralKey.create(
            customer=customer_id,
            stripe_version='2023-10-16', # Veya güncel sürüm
        )
        return key.secret

    async def cancel_subscription(self, subscription_id: str):
        """Cancel a subscription immediately."""
        try:
            stripe.Subscription.delete(subscription_id)
            return True
        except stripe.error.StripeError:
            return False

payment_service = PaymentService()
