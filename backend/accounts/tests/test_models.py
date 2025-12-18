from django.contrib.auth import get_user_model
from django.test import TestCase

User = get_user_model()


class UserModelTest(TestCase):
    def test_user_creation(self):
        user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass",
            role="customer",
        )
        self.assertEqual(user.email, "test@example.com")
        self.assertEqual(user.role, "customer")
        self.assertTrue(user.check_password("testpass"))

    def test_roles_choices(self):
        self.assertEqual(User.Roles.ADMIN, "admin")
        self.assertEqual(User.Roles.STAFF, "staff")
        self.assertEqual(User.Roles.CUSTOMER, "customer")

    def test_is_admin_method(self):
        admin_user = User.objects.create_user(
            username="admin", email="admin@example.com", password="pass", role="admin"
        )
        self.assertTrue(admin_user.is_admin())

        staff_user = User.objects.create_user(
            username="staff", email="staff@example.com", password="pass", role="staff"
        )
        self.assertFalse(staff_user.is_admin())

    def test_is_staff_method(self):
        staff_user = User.objects.create_user(
            username="staff", email="staff@example.com", password="pass", role="staff"
        )
        self.assertTrue(staff_user.is_staff)

        customer_user = User.objects.create_user(
            username="customer",
            email="customer@example.com",
            password="pass",
            role="customer",
        )
        self.assertFalse(customer_user.is_staff)

    def test_is_customer_role_method(self):
        customer_user = User.objects.create_user(
            username="customer",
            email="customer@example.com",
            password="pass",
            role="customer",
        )
        self.assertTrue(customer_user.is_customer_role())

        admin_user = User.objects.create_user(
            username="admin", email="admin@example.com", password="pass", role="admin"
        )
        self.assertFalse(admin_user.is_customer_role())

    def test_save_sets_is_staff_for_admin_and_staff(self):
        admin_user = User.objects.create_user(
            username="admin", email="admin@example.com", password="pass", role="admin"
        )
        admin_user.save()
        self.assertTrue(admin_user.is_staff)

        staff_user = User.objects.create_user(
            username="staff", email="staff@example.com", password="pass", role="staff"
        )
        staff_user.save()
        self.assertTrue(staff_user.is_staff)

        customer_user = User.objects.create_user(
            username="customer",
            email="customer@example.com",
            password="pass",
            role="customer",
        )
        customer_user.save()
        self.assertFalse(customer_user.is_staff)

    def test_super_staff_flag(self):
        super_staff_user = User.objects.create_user(
            username="superstaff",
            email="superstaff@example.com",
            password="pass",
            role="staff",
            is_super_stuff=True,
        )
        self.assertTrue(super_staff_user.is_super_stuff)

    def test_str_method(self):
        user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="pass",
            role="customer",
        )
        self.assertEqual(str(user), "test@example.com (customer)")

    def test_created_by_field(self):
        admin_user = User.objects.create_user(
            username="admin", email="admin@example.com", password="pass", role="admin"
        )
        staff_user = User.objects.create_user(
            username="staff",
            email="staff@example.com",
            password="pass",
            role="staff",
            created_by=admin_user,
        )
        self.assertEqual(staff_user.created_by, admin_user)
