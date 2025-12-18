# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    model = User
    list_display = (
        "username",
        "email",
        "role",
        "is_staff",
        "is_active",
        "is_superuser",
    )
    list_filter = ("role", "is_staff", "is_active")
    search_fields = ("username", "email")
    ordering = ("username",)

    fieldsets = (
        (None, {"fields": ("username",)}),
        ("Personal info", {"fields": ("email",)}),
        ("Permissions", {"fields": ("role", "is_staff", "is_active", "is_superuser")}),
        # ("Important dates", {"fields": ("last_login", "date_joined")}),
        # ("Created by", {"fields": ("created_by",)}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "email", "role", "password1", "password2"),
            },
        ),
    )

    def delete_queryset(self, request, queryset):
        # admin can delete anyone now (including other admins)
        super().delete_queryset(request, queryset)
