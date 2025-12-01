from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from products.models import Product
from products.serializers import ProductSerializer


class ProductViewSetTest(APITestCase):

    def setUp(self):
        self.p1 = Product.objects.create(
            name="Phone", price=1000, category="Electronics"
        )
        self.p2 = Product.objects.create(name="Table", price=200, category="Furniture")

        self.list_url = reverse("products:product-list")

    def _results(self, response):
        """Helper to extract paginated results."""
        return (
            response.data["results"]
            if isinstance(response.data, dict)
            else response.data
        )

    def test_list_products(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = self._results(response)
        self.assertEqual(len(results), 2)

    def test_create_product(self):
        data = {"name": "Laptop", "price": 1500, "category": "Electronics"}
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 3)

    def test_retrieve_product(self):
        url = reverse("products:product-detail", args=[self.p1.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Phone")

    def test_update_product(self):
        url = reverse("products:product-detail", args=[self.p1.id])
        data = {"name": "PhoneX", "price": 1100, "category": "Electronics"}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.p1.refresh_from_db()
        self.assertEqual(self.p1.name, "PhoneX")

    def test_delete_product(self):
        url = reverse("products:product-detail", args=[self.p1.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # ----- Filters -----

    def test_filter_by_name_icontains(self):
        response = self.client.get(self.list_url + "?name__icontains=pho")
        results = self._results(response)
        self.assertEqual(len(results), 1)

    def test_filter_by_category(self):
        response = self.client.get(self.list_url + "?category=Furniture")
        results = self._results(response)
        self.assertEqual(len(results), 1)

    def test_filter_by_price_range(self):
        response = self.client.get(self.list_url + "?price__gte=500")
        results = self._results(response)
        self.assertEqual(len(results), 1)

    # ----- Search -----

    def test_search(self):
        response = self.client.get(self.list_url + "?search=Phone")
        results = self._results(response)
        self.assertEqual(len(results), 1)

    # ----- Ordering -----

    def test_ordering(self):
        response = self.client.get(self.list_url + "?ordering=price")
        results = self._results(response)
        prices = [float(p["price"]) for p in results]
        self.assertEqual(prices, sorted(prices))

    def test_name_blank_triggers_error(self):
        data = {"name": "", "price": 100, "category": "Electronics"}
        serializer = ProductSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("name", serializer.errors)

    def test_category_blank_triggers_error(self):
        data = {"name": "ValidName", "price": 100, "category": ""}
        serializer = ProductSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("category", serializer.errors)

    # ----- Bulk Delete -----

    def test_bulk_delete(self):
        url = reverse("products:product-bulk-delete")
        response = self.client.delete(
            url, {"ids": [self.p1.id, self.p2.id]}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["deleted_count"], 2)

    def test_bulk_delete_no_items(self):
        """Covers the else path in bulk_delete (no items found)"""
        url = reverse("products:product-bulk-delete")
        response = self.client.delete(url, {"ids": [999, 1000]}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, "No items found to delete.")
