from django.db.models import Q
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.views import TokenObtainPairView

from product_api.permissions import IsAdmin, IsAdminOrSuperStaffOrReadOnlyStaff

from .models import User
from .serializers import (
    AdminChangePasswordSerializer,
    EmailTokenObtainPairSerializer,
    UpdateUserSerializer,
    UserSerializer,
)


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


class UserViewSet(ModelViewSet):
    queryset = User.objects.all().order_by("-id")
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrSuperStaffOrReadOnlyStaff]

    def get_serializer_class(self):
        if self.action in ["update", "partial_update"]:
            return UpdateUserSerializer
        return UserSerializer

    def destroy(self, request, *args, **kwargs):
        if request.user.role != "admin":
            return Response({"detail": "Only admin can delete users"}, status=403)
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=["delete"], permission_classes=[IsAdmin])
    def bulk_delete(self, request):
        ids = request.data.get("ids", [])
        deleted, _ = User.objects.filter(id__in=ids).delete()
        return Response({"deleted": deleted})

    # @action(detail=True, methods=["post"], permission_classes=[IsAdmin])
    # def change_password(self, request, pk=None):
    #     # serializer = AdminChangePasswordSerializer(data=request.data)
    #     # serializer.is_valid(raise_exception=True)
    #     # user = self.get_object()
    #     # user.set_password(serializer.validated_data["new_password"])
    #     # user.save()
    #     return Response({"message": "Not permited"}, status=403)

    @action(detail=False, methods=["get"])
    def search(self, request):
        q = request.query_params.get("q", "")
        users = User.objects.filter(
            Q(username__icontains=q) | Q(email__icontains=q) | Q(role__icontains=q)
        )
        return Response(UserSerializer(users, many=True).data)

    @action(detail=False, methods=["get", "patch"])
    def me(self, request):
        if request.method == "GET":
            return Response(UserSerializer(request.user).data)

        serializer = UpdateUserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def change_my_password(self, request):
        serializer = AdminChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save()
        return Response({"message": "Password updated"})
