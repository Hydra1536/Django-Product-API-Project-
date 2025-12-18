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

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name is required.")

        if not any(c.isalpha() for c in value):
            raise serializers.ValidationError(
                "Name must contain at least one character."
            )

        # Unique check except current instance
        qs = Product.objects.filter(name=value)
        if self.instance:
            qs = qs.exclude(id=self.instance.id)

        if qs.exists():
            raise serializers.ValidationError("Product with this name already exists.")

        return value

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero.")
        return value

    def validate_category(self, value):
        if not any(c.isalpha() for c in value):
            raise serializers.ValidationError("Category must contain characters.")
        return value
