from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers

from .models import UserProfile

User = get_user_model()

from django.contrib.auth import authenticate

class RegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(
        max_length=150,
    )

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True,
        min_length=8,
        trim_whitespace=False,
        style={"input_type": "password"},
    )

    password_confirm = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
        style={"input_type": "password"},
    )

    phone_number = serializers.CharField(
        max_length=20,
        required=False,
        allow_blank=True,
    )

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("This username is already taken.")

        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": ("The passwords do not match.")}
            )

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        validated_data.pop("password_confirm")

        password = validated_data.pop("password")
        phone_number = validated_data.pop(
            "phone_number",
            "",
        )

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=password,
        )

        UserProfile.objects.create(
            user=user,
            phone_number=phone_number,
            role=UserProfile.Role.CUSTOMER,
        )

        return user

    def to_representation(self, instance):
        profile = instance.profile

        return {
            "id": instance.id,
            "username": instance.username,
            "email": instance.email,
            "phone_number": profile.phone_number,
            "role": profile.role,
        }


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)

    password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
        style={"input_type": "password"},
    )

    def validate(self, attrs):
        request = self.context.get("request")

        user = authenticate(
            request=request,
            username=attrs["username"],
            password=attrs["password"],
        )

        if user is None:
            raise serializers.ValidationError("Invalid username or password.")

        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")

        attrs["user"] = user
        return attrs
