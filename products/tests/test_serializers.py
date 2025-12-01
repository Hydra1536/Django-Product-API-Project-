from django.test import TestCase

from products.models import Product
from products.serializers import ProductSerializer


class ProductSerializerTest(TestCase):

    def test_valid_data(self):
        data = {"name": "Laptop", "price": 1500, "category": "Electronics"}
        serializer = ProductSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_blank_name(self):
        data = {"name": "", "price": 100, "category": "Electronics"}
        serializer = ProductSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("name", serializer.errors)

    def test_name_unique(self):
        Product.objects.create(name="TV", price=500, category="Home")
        data = {"name": "TV", "price": 600, "category": "Home"}
        serializer = ProductSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("name", serializer.errors)

    def test_price_greater_than_zero(self):
        data = {"name": "Item", "price": -5, "category": "Test"}
        serializer = ProductSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("price", serializer.errors)

    def test_invalid_characters_in_name(self):
        data = {"name": "12345", "price": 10, "category": "ABC"}
        serializer = ProductSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("name", serializer.errors)

    def test_name_without_any_characters(self):
        """Covers the 'Name cannot be without charachterrs' path"""
        data = {"name": "12345", "price": 10, "category": "Electronics"}
        serializer = ProductSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("name", serializer.errors)

    def test_category_without_any_characters(self):
        """Covers the 'Category cannot be without charachterrs' path"""
        data = {"name": "ValidName", "price": 10, "category": "12345"}
        serializer = ProductSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("category", serializer.errors)
