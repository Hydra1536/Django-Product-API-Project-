from django.db import models
from django.contrib.auth.models import AbstractUser, Permission
from django.contrib.contenttypes.models import ContentType
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    first_name = None  # Crucial fix for the ProgrammingError
    last_name = None   # Crucial fix for the ProgrammingError
    class Roles(models.TextChoices):
        ADMIN = "admin", _("Admin")
        SUPER_STAFF = "super_staff", _("Super Staff")
        STAFF = "staff", _("Staff")
        CUSTOMER = "customer", _("Customer")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.CUSTOMER)

    # created_by = models.ForeignKey(
    #     "self",
    #     null=True,
    #     blank=True,
    #     on_delete=models.SET_NULL,
    #     related_name="created_users",
    # )

    def save(self, *args, **kwargs):
        """
        Automatically assign permissions based on role
        """
        if self.role == self.Roles.ADMIN:
            self.is_staff = True
            self.is_superuser = True
        elif self.role == self.Roles.SUPER_STAFF:
            self.is_staff = True
            self.is_superuser = False
        elif self.role == self.Roles.STAFF:
            self.is_staff = True
            self.is_superuser = False
        else:  # customer
            self.is_staff = False
            self.is_superuser = False

        super().save(*args, **kwargs)
        # 3. Assign specific Django permissions AFTER the user is saved
        if self.role in [self.Roles.SUPER_STAFF, self.Roles.STAFF]:
            # You only need to run this if the permissions haven't been assigned yet.
            if not self.has_perm('accounts.view_user'):
                 self._assign_user_admin_read_permissions()
        else:
             # Remove permissions if role is changed to Admin or Customer
             self.user_permissions.clear()
        
        # 🔥 Assign product VIEW permission
        content_type = ContentType.objects.get(app_label="products", model="product")
        view_perm = Permission.objects.get(
            content_type=content_type,
            codename="view_product"
        )

        if self.role in [self.Roles.STAFF, self.Roles.SUPER_STAFF]:
            self.user_permissions.add(view_perm)
        else:
            self.user_permissions.remove(view_perm)     

    def _assign_user_admin_read_permissions(self):
        """
        Allow staff & super_staff to VIEW users in Django admin
        """
        content_type = ContentType.objects.get(app_label="accounts", model="user")
        perms = Permission.objects.filter(
            content_type=content_type,
            codename__in=["view_user"]
        )
        self.user_permissions.add(*perms)

    def __str__(self):
        return f"{self.email} ({self.role})"