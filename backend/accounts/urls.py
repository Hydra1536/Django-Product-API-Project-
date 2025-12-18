from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import EmailTokenObtainPairView, UserViewSet

router = DefaultRouter()
router.register("users", UserViewSet, basename="users")

urlpatterns = [
    # path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path(
        "accounts/token/",
        EmailTokenObtainPairView.as_view(),
        name="email_token_obtain_pair",
    ),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("", include(router.urls)),
]
