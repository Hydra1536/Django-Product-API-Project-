from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = "__all__"
        read_only_fields = ["is_staff", "is_superuser"]  # , "created_by"

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        # user.created_by = self.context["request"].user
        user.save()
        return user


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "role"]


class AdminChangePasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(min_length=8)


# ---------------- JWT ---------------- #


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user
        data["user"] = {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "role": user.role,
        }
        return data
