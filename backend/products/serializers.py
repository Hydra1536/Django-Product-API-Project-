import re

from rest_framework import serializers

from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"
        extra_kwargs = {
            "name": {"error_messages": {"blank": "Name is required."}},
            "category": {"error_messages": {"blank": "Category is required."}},
        }

    # Basic validation
    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name is required.")
        # Check if name contains at least one character
        for i in range(len(value)):
            if not ((65 <= ord(value[i]) <= 90) or (97 <= ord(value[i]) <= 122)):
                if i == len(value) - 1:
                    raise serializers.ValidationError(
                        "Name can not be without charachterrs."
                    )
            else:
                # Name uniqueness check
                if Product.objects.filter(name=value).exists():
                    raise serializers.ValidationError(
                        "Product with this name already exists."
                    )
                return value

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero.")
        return value

    def validate_category(self, value):
        if not value:
            raise serializers.ValidationError("Category is required.")
        # Check if category contains at least one character
        for i in range(len(value)):
            if not ((65 <= ord(value[i]) <= 90) or (97 <= ord(value[i]) <= 122)):
                if i == len(value) - 1:
                    raise serializers.ValidationError(
                        "Category can not be without charachterrs."
                    )
            else:
                return value
