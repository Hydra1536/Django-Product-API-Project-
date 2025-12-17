from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import User

User = get_user_model()


class UserAPITestCase(APITestCase):
    def setUp(self):
        # Create test users
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
        self.super_staff_user = User.objects.create_user(
            username="superstaff",
            email="superstaff@example.com",
            password="superstaffpass",
            role="staff",
            is_super_stuff=True
        )
        self.customer_user = User.objects.create_user(
            username="customer",
            email="customer@example.com",
            password="customerpass",
            role="customer"
        )

        # URLs
        self.users_list_url = reverse("accounts:users-list")
        self.users_search_url = reverse("accounts:users-search")
        self.me_url = reverse("accounts:users-me")

    def get_token(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    def test_admin_can_list_users(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token(self.admin_user)}')
        response = self.client.get(self.users_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)  # 4 users created

    def test_staff_cannot_list_users(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token(self.staff_user)}')
        response = self.client.get(self.users_list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_customer_cannot_list_users(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token(self.customer_user)}')
        response = self.client.get(self.users_list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_cannot_list_users(self):
        response = self.client.get(self.users_list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_create_user(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token(self.admin_user)}')
        data = {
            "username": "newuser",
            "email": "new@example.com",
            "password": "newpass",
            "role": "customer"
        }
        response = self.client.post(self.users_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 5)

    def test_staff_cannot_create_user(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token(self.staff_user)}')
        data = {
            "username": "newuser",
            "email": "new@example.com",
            "password": "newpass",
            "role": "customer"
        }
        response = self.client.post(self.users_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_retrieve_user(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token(self.admin_user)}')
        url = reverse("accounts:users-detail", kwargs={"pk": self.staff_user.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "staff@example.com")

    def test_admin_can_update_user(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token(self.admin_user)}')
        url = reverse("accounts:users-detail", kwargs={"pk": self.staff_user.pk})
        data = {"first_name": "Updated"}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.staff_user.refresh_from_db()
        self.assertEqual(self.staff_user.first_name, "Updated")

    def test_admin_cannot_delete_admin_user(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token(self.admin_user)}')
        url = reverse("accounts:users-detail", kwargs={"pk": self.admin_user.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_delete_non_admin_user(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token(self.admin_user)}')
        url = reverse("accounts:users-detail", kwargs={"pk": self.staff_user.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(User.objects.count(), 3)

    def test_bulk_delete_users(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token(self.admin_user)}')
        url = reverse("accounts:users-bulk-delete")
        data = {"ids": [self.staff_user.pk, self.customer_user.pk]}
        response = self.client.delete(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["deleted"], 2)
        self.assertEqual(User.objects.count(), 2)  # admin and super_staff remain

    def test_search_users(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token(self.admin_user)}')
        response = self.client.get(self.users_search_url, {"q": "staff"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # staff and superstaff

    def test_me_endpoint_get(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token(self.customer_user)}')
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "customer@example.com")

    def test_me_endpoint_patch(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token(self.customer_user)}')
        data = {"first_name": "Updated Name"}
        response = self.client.patch(self.me_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.customer_user.refresh_from_db()
        self.assertEqual(self.customer_user.first_name, "Updated Name")

    def test_change_password(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token(self.admin_user)}')
        url = reverse("accounts:users-change-password", kwargs={"pk": self.staff_user.pk})
        data = {"new_password": "newpassword123"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.staff_user.refresh_from_db()
        self.assertTrue(self.staff_user.check_password("newpassword123"))


    def test_change_my_password(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token(self.customer_user)}')
        url = reverse("accounts:users-change-my-password")
        data = {"new_password": "newpassword123"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.customer_user.refresh_from_db()
        self.assertTrue(self.customer_user.check_password("newpassword123"))
