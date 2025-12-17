from django.test import TestCase
from product_api.asgi import application


class ASGITest(TestCase):
    def test_asgi_application_import(self):
        # Test that the ASGI application can be imported
        self.assertIsNotNone(application)
