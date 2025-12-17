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
├── accounts/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── admin.py
│   └── ...
│
├── products/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── admin.py
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
pip install -r requirements.txt
</pre>


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

<pre>python manage.py test 
coverage run --source='products' manage.py test
coverage report -m
</pre>

This will run all test cases for your products app and show results for API endpoints.

<h3>7️⃣ Swagger / Redoc Documentation</h3> <pre> # Swagger UI http://127.0.0.1:8000/docs/
Redoc

http://127.0.0.1:8000/redoc/

</pre>

<p> With these instructions, you can fully test the API endpoints manually using Postman/curl or automatically using Django tests. </p> </div>

<div class="section">
<h2>📌 Conclusion</h2>
<p>
This project provides a complete backend API using Django REST Framework, featuring both product management
and user authentication. It's suitable for e-commerce platforms, inventory systems, or any application requiring
secure user management and product CRUD operations. Includes PostgreSQL database, JWT authentication,
role-based permissions, filtering, search, pagination, rate limiting, and comprehensive Swagger documentation.
</p>
</div>

</body>
</html>
