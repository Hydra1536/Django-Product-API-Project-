<h1>📦 Product API – Django REST Framework + PostgreSQL</h1>

<p>
A complete backend API for managing products using Django, DRF, PostgreSQL, filtering, searching,
pagination, rate limiting, and Swagger documentation.
</p>

<hr>

<div class="section">
<h2>🚀 Project Features</h2>
<ul>
    <li>Full CRUD API (Create, Read, Update, Delete)</li>
    <li>PostgreSQL database</li>
    <li>Environment variable configuration</li>
    <li>Filtering (name, category, min/max price)</li>
    <li>Search (name, category)</li>
    <li>Limit/Offset Pagination</li>
    <li>API Rate Limiting (30 req/min)</li>
    <li>Swagger API Documentation</li>
</ul>
</div>

<div class="section">
<h2>📁 Project Structure</h2>
<pre>
product_api/
│
├── product_api/
│   ├── settings.py
│   ├── urls.py
│   └── ...
│
├── products/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── ...
│
├── .env
└── manage.py
</pre>
</div>


<div class="section">
<h2>🛠 Installation & Setup</h2>

<h3>1️⃣ Create virtual environment</h3>
<pre>
python -m venv venv
venv/Scripts/activate  (Windows)
source venv/bin/activate (Linux/Mac)
</pre>

<h3>2️⃣ Install dependencies</h3>
<pre>
pip install django djangorestframework psycopg2-binary python-decouple django-filter drf-yasg
</pre>

<h3>3️⃣ Create Django project & app</h3>
<pre>
django-admin startproject product_api
cd product_api
python manage.py startapp products
</pre>
</div>



<div class="section">
<h2>🗄 PostgreSQL Environment Variables</h2>

Create a <code>.env</code> file:

<pre>
DB_NAME=your_database
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
</pre>

Update <code>settings.py</code>:

<pre>
from decouple import config

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT'),
    }
}
</pre>
</div>



<div class="section">
<h2>📦 Product Model</h2>

<pre>
from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
</pre>
</div>


<div class="section">
<h2>🧩 Serializer</h2>

<pre>
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

    # Basic validation
    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero.")
        return value
</pre>
</div>



<div class="section">
<h2>⚙️ ViewSet (CRUD + Filters + Search)</h2>

<pre>
from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    filterset_fields = {
        'name': ['icontains'],
        'category': ['exact'],
        'price': ['gte', 'lte'],
    }

    search_fields = ['name', 'category']

    ordering_fields = ['name', 'price', 'created_at']
    ordering = ['id']
</pre>
</div>



<div class="section">
<h2>🛣 API Routes</h2>

<h3>products/urls.py</h3>
<pre>
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

router = DefaultRouter()
router.register('products', ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
</pre>

<h3>project urls.py</h3>
<pre>
urlpatterns = [
    path('api/', include('products.urls')),
]
</pre>
</div>



<div class="section">
<h2>🔍 Filtering Examples</h2>
<ul>
    <li><code>/api/products/?name__icontains=phone</code></li>
    <li><code>/api/products/?category=Electronics</code></li>
    <li><code>/api/products/?price__gte=100</code></li>
    <li><code>/api/products/?price__lte=500</code></li>
</ul>
</div>



<div class="section">
<h2>🔎 Searching</h2>
<p>
Searching works using DRF's SearchFilter:
</p>

<pre>/api/products/?search=phone</pre>
</div>



<div class="section">
<h2>📄 Pagination (Limit/Offset)</h2>

Enabled in <code>settings.py</code>:

<pre>
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 10,
}
</pre>

Examples:
<pre>
/api/products/?limit=5&offset=0
/api/products/?limit=3&offset=10
</pre>
</div>



<div class="section">
<h2>⏳ API Rate Limiting</h2>

<pre>
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '30/min',
        'user': '30/min',
    }
}
</pre>

If limit exceeded:
<pre>
429 Too Many Requests
</pre>
</div>



<div class="section">
<h2>📘 Swagger Documentation</h2>

<h3>Install:</h3>
<pre>pip install drf-yasg</pre>

<h3>Add to urls.py:</h3>
<pre>
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Product API",
        default_version='v1',
        description="API documentation for Product CRUD operations",
    ),
    public=True,
)
</pre>

<h3>Swagger URLs:</h3>
<pre>
path('docs/', schema_view.with_ui('swagger', cache_timeout=0)),
path('redoc/', schema_view.with_ui('redoc', cache_timeout=0)),
</pre>

<p>
✔ Open Swagger UI: <code>http://127.0.0.1:8000/docs/</code><br>
✔ Open Redoc: <code>http://127.0.0.1:8000/redoc/</code>
</p>
</div>



<div class="section">
<h2>🧪 Run the Server</h2>

<pre>
python manage.py runserver
</pre>

Visit API:

<pre>http://127.0.0.1:8000/api/products/</pre>
</div>

<div class="section"> <h2>🧪 Run the Server & Test API</h2> <h3>1️⃣ Run the Django development server</h3> <pre> python manage.py runserver </pre>

Visit API:

<pre>http://127.0.0.1:8000/api/products/</pre>
<h3>2️⃣ Test API Endpoints using curl or Postman</h3>

Create a product (POST):

<pre> POST /api/products/ Content-Type: application/json { "name": "iPhone 15", "price": 999.99, "category": "Electronics" } </pre>

List products (GET):

<pre> GET /api/products/ GET /api/products/?search=phone GET /api/products/?category=Electronics GET /api/products/?price__gte=100&price__lte=1000 </pre>

Retrieve product by ID (GET):

<pre> GET /api/products/1/ </pre>

Update product (PUT / PATCH):

<pre> PUT /api/products/1/ Content-Type: application/json { "name": "iPhone 15 Pro", "price": 1099.99, "category": "Electronics" } </pre>

Delete product (DELETE):

<pre> DELETE /api/products/1/ </pre>
<h3>3️⃣ Test Pagination</h3> <pre> GET /api/products/?limit=5&offset=0 GET /api/products/?limit=3&offset=10 </pre>
<h3>4️⃣ Test Filtering & Searching</h3> <pre> # Filter by name containing 'phone' GET /api/products/?name__icontains=phone
Filter by category

GET /api/products/?category=Electronics

Filter by price range

GET /api/products/?price__gte=100&price__lte=500

Search by name or category

GET /api/products/?search=phone
</pre>

<h3>5️⃣ Test Rate Limiting</h3> <pre> # Make more than 30 requests per minute from the same user/IP # Response: 429 Too Many Requests </pre>
<h3>6️⃣ Run Automated Tests (Optional)</h3>

If you write Django test cases (in tests.py in your app), run:

<pre> python manage.py test </pre>

This will run all test cases for your products app and show results for API endpoints.

<h3>7️⃣ Swagger / Redoc Documentation</h3> <pre> # Swagger UI http://127.0.0.1:8000/docs/
Redoc

http://127.0.0.1:8000/redoc/

</pre>

<p> With these instructions, you can fully test the API endpoints manually using Postman/curl or automatically using Django tests. </p> </div>

<div class="section">
<h2>📌 Conclusion</h2>
<p>
This project provides a clean and scalable backend using Django REST Framework, suitable for e-commerce,
inventory systems, or any product management solution. It includes CRUD operations, PostgreSQL setup,
filters, search, pagination, throttling, and full Swagger documentation.
</p>
</div>

</body>
</html>
