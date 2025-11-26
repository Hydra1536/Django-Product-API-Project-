from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Product
from .serializers import ProductSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer

    # Filtering + Searching
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    # Filtering options
    filterset_fields = {
        'name': ['icontains'],       # /api/products/?name__icontains=phone
        'category': ['exact'],       # /api/products/?category=Electronics
        'price': ['gte', 'lte'],     # /api/products/?price__gte=500
    }

    # Search options
    search_fields = ['name', 'category']
    
    # Optional ordering support
    ordering_fields = ['name', 'price', 'created_at']
    ordering = ['id']
    
    @action(detail=False, methods=['delete'])
    def bulk_delete(self, request):
        items_to_delete = self.get_queryset().filter(pk__in=request.data.get('ids', []))
        if items_to_delete.exists():
            return Response({"deleted_count": items_to_delete.delete()[0]})
        return Response("No items found to delete.")
        
