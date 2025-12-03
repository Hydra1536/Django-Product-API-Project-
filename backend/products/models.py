from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=20, blank=False)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=False)
    category = models.CharField(max_length=20, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
