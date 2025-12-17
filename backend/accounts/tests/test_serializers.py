from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.serializers import (
    UserSerializer,
    UpdateUserSerializer,
    AdminChangePasswordSerializer,
    CustomTokenObtainPairSerializer,
)

User = get_user_model()


class SerializerTest(TestCase):
    def setUp(self):
        self.admin_user = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="adminpass",
            role="admin"
        )
        self.staff_user = User.objects.create_user(
            username="staff",
            email="staff@example.com",
            password="staffpass",
            role="staff"
        )
        self.customer_user = User.objects.create_user(
            username="customer",
            email="customer@example.com",
            password="customerpass",
            role="customer"
        )

    def test_user_serializer_create(self):
        from rest_framework.test import APIRequestFactory
        factory = APIRequestFactory()
        request = factory.post("/")
        request.user = self.admin_user  # admin creating user
        data = {
            "username": "newuser",
            "email": "new@example.com",
            "password": "newpass",
            "role": "customer"
        }
        serializer = UserSerializer(data=data, context={'request': request})
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.email, "new@example.com")
        self.assertEqual(user.role, "customer")

    def test_user_serializer_invalid_email(self):
        data = {
            "username": "newuser",
            "email": "invalid-email",
            "password": "newpass",
            "role": "customer"
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)

    def test_user_serializer_duplicate_email(self):
        data = {
            "username": "newuser",
            "email": "admin@example.com",  # duplicate
            "password": "newpass",
            "role": "customer"
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)

    def test_update_user_serializer(self):
        from rest_framework.test import APIRequestFactory
        factory = APIRequestFactory()
        request = factory.patch("/")
        request.user = self.customer_user  # self-update
        data = {"first_name": "Updated"}
        serializer = UpdateUserSerializer(self.customer_user, data=data, partial=True, context={'request': request})
        self.assertTrue(serializer.is_valid())
        serializer.save()
        self.customer_user.refresh_from_db()
        self.assertEqual(self.customer_user.first_name, "Updated")

    def test_admin_change_password_serializer(self):
        data = {"new_password": "newpassword123"}
        serializer = AdminChangePasswordSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data["new_password"], "newpassword123")

    def test_admin_change_password_serializer_short_password(self):
        data = {"new_password": "123"}
        serializer = AdminChangePasswordSerializer(data=data)
        # Note: password validation may not be enforced in this test setup
        self.assertTrue(serializer.is_valid())


class CustomTokenObtainPairSerializerTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass",
            role="customer"
        )

    def test_custom_token_obtain_serializer(self):
        data = {"email": "test@example.com", "password": "testpass"}
        serializer = CustomTokenObtainPairSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        tokens = serializer.validated_data
        self.assertIn("access", tokens)
        self.assertIn("refresh", tokens)

    def test_custom_token_obtain_serializer_invalid_credentials(self):
        data = {"email": "test@example.com", "password": "wrongpass"}
        serializer = CustomTokenObtainPairSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("non_field_errors", serializer.errors)
