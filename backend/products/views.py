from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.response import Response

from .models import Product
from .serializers import ProductSerializer
from product_api.permissions import ProductPermission


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by("-created_at")
    serializer_class = ProductSerializer
    permission_classes = [ProductPermission]

    # Filtering + Searching
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    filterset_fields = {
        "name": ["icontains"],
        "category": ["exact"],
        "price": ["gte", "lte"],
    }

    search_fields = ["name", "category"]
    ordering_fields = ["id", "name", "price", "created_at"]
    ordering = ["id"]

    # # ❌ REMOVE SINGLE DELETE
    # def destroy(self, request, *args, **kwargs):
    #     return Response(
    #         {"detail": "Single delete is disabled. Use bulk_delete."},
    #         status=405,
    #     )

    # ✅ BULK DELETE ONLY
    @action(detail=False, methods=["delete"])
    def bulk_delete(self, request):
        ids = request.data.get("ids", [])
        if not ids:
            return Response({"detail": "No IDs provided"}, status=400)

        deleted, _ = Product.objects.filter(id__in=ids).delete()
        return Response({"deleted_count": deleted})
