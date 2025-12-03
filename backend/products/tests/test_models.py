from django.test import TestCase

from products.models import Product


class ProductModelTest(TestCase):

    def setUp(self):
        self.product = Product.objects.create(
            name="Phone", price=1000, category="Electronics"
        )

    def test_product_creation(self):
        self.assertEqual(self.product.name, "Phone")
        self.assertEqual(self.product.price, 1000)
        self.assertEqual(self.product.category, "Electronics")

    def test_str_method(self):
        self.assertEqual(str(self.product), "Phone")
