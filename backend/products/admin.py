from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "price", "category", "created_at")
    search_fields = ("name", "category")

    def has_view_permission(self, request, obj=None):
        return request.user.role in ["admin", "super_staff", "staff"]

    def has_add_permission(self, request):
        return request.user.role in ["admin", "super_staff"]

    def has_change_permission(self, request, obj=None):
        return request.user.role in ["admin", "super_staff"]

    def has_delete_permission(self, request, obj=None):
        return request.user.role in ["admin", "super_staff"]
