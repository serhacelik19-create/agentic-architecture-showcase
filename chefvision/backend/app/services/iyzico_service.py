import iyzipay
from app.config import get_settings

settings = get_settings()

class IyzicoService:
    def __init__(self):
        self.options = {
            'api_key': settings.iyzico_api_key,
            'secret_key': settings.iyzico_secret_key,
            'base_url': settings.iyzico_base_url
        }

    def create_checkout_form(self, user_id, user_name, user_email, amount):
        """Create Iyzico Checkout Form for subscription."""
        request = {
            'locale': 'tr',
            'conversationId': str(user_id),
            'price': str(amount),
            'paidPrice': str(amount),
            'currency': 'TRY',
            'basketId': f'B_{user_id}',
            'paymentGroup': 'PRODUCT',
            'callbackUrl': settings.iyzico_callback_url,
            'enabledInstallments': ['1'],
            'buyer': {
                'id': str(user_id),
                'name': user_name.split()[0] if ' ' in user_name else user_name,
                'surname': user_name.split()[-1] if ' ' in user_name else 'Soyad',
                'gsmNumber': '+905320000000',
                'email': user_email,
                'identityNumber': '11111111111',
                'lastLoginDate': '2015-10-05 12:43:35',
                'registrationDate': '2013-04-21 15:12:09',
                'registrationAddress': 'Nisantasi',
                'ip': '85.34.78.112',
                'city': 'Istanbul',
                'country': 'Turkey',
                'zipCode': '34732'
            },
            'shippingAddress': {
                'contactName': user_name,
                'city': 'Istanbul',
                'country': 'Turkey',
                'address': 'Nisantasi',
                'zipCode': '34732'
            },
            'billingAddress': {
                'contactName': user_name,
                'city': 'Istanbul',
                'country': 'Turkey',
                'address': 'Nisantasi',
                'zipCode': '34732'
            },
            'basketItems': [
                {
                    'id': 'PRO_SUB',
                    'name': 'ChefVision AI PRO - 1 Aylık',
                    'category1': 'Abonelik',
                    'itemType': 'VIRTUAL',
                    'price': str(amount)
                }
            ]
        }
        
        checkout_form_initialize = iyzipay.CheckoutFormInitialize().create(request, self.options)
        return checkout_form_initialize.read().decode('utf-8')

    def retrieve_checkout_form_result(self, token):
        """Retrieve the result of a checkout form payment."""
        request = {
            'locale': 'tr',
            'token': token
        }
        checkout_form = iyzipay.CheckoutForm().retrieve(request, self.options)
        return checkout_form.read().decode('utf-8')

iyzico_service = IyzicoService()
