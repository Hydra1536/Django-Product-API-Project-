from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.test import TestCase
from rest_framework.permissions import IsAuthenticated
from rest_framework.test import APIRequestFactory

from accounts.permissions import IsAdmin, IsStaffOrAdmin, IsSuperStaff

User = get_user_model()


class PermissionsTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.admin_user = User.objects.create_user(
            username="admin", email="admin@example.com", password="pass", role="admin"
        )
        self.staff_user = User.objects.create_user(
            username="staff", email="staff@example.com", password="pass", role="staff"
        )
        self.super_staff_user = User.objects.create_user(
            username="superstaff",
            email="superstaff@example.com",
            password="pass",
            role="staff",
            is_super_stuff=True,
        )
        self.customer_user = User.objects.create_user(
            username="customer",
            email="customer@example.com",
            password="pass",
            role="customer",
        )

    def test_is_admin_permission(self):
        permission = IsAdmin()
        request = self.factory.get("/")
        request.user = self.admin_user
        self.assertTrue(permission.has_permission(request, None))

        request.user = self.staff_user
        self.assertFalse(permission.has_permission(request, None))

        request.user = self.customer_user
        self.assertFalse(permission.has_permission(request, None))

    def test_is_staff_or_admin_permission(self):
        permission = IsStaffOrAdmin()
        request = self.factory.get("/")
        request.user = self.admin_user
        self.assertTrue(permission.has_permission(request, None))

        request.user = self.staff_user
        self.assertTrue(permission.has_permission(request, None))

        request.user = self.customer_user
        self.assertFalse(permission.has_permission(request, None))

    def test_is_super_staff_permission(self):
        permission = IsSuperStaff()
        request = self.factory.get("/")
        request.user = self.super_staff_user
        self.assertTrue(permission.has_permission(request, None))

        request.user = self.staff_user
        self.assertFalse(permission.has_permission(request, None))

        request.user = self.admin_user
        self.assertFalse(permission.has_permission(request, None))

        request.user = self.customer_user
        self.assertFalse(permission.has_permission(request, None))

    def test_unauthenticated_user(self):
        permission = IsAdmin()
        request = self.factory.get("/")
        request.user = AnonymousUser()
        # For unauthenticated, is_authenticated is False, so should return False
        self.assertFalse(permission.has_permission(request, None))
