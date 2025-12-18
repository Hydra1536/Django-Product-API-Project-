from django.core.exceptions import ValidationError
from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=20, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if not any(c.isalpha() for c in self.name):
            raise ValidationError({"name": "Name must contain letters."})

        if not any(c.isalpha() for c in self.category):
            raise ValidationError({"category": "Category must contain letters."})

        if self.price <= 0:
            raise ValidationError({"price": "Price must be greater than zero."})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
