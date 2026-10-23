from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth import login as django_login
from django.contrib.auth import logout as django_logout
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    ChangePasswordSerializer,
    LoginSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    RegistrationSerializer,
    UpdateProfileSerializer,
)

User = get_user_model()

class RegistrationView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return Response(
            {
                "status": "success",
                "message": "Your account has been created successfully.",
                "user": serializer.to_representation(user),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(
            data=request.data,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        django_login(request._request, user)

        profile = getattr(user, "profile", None)

        if profile is not None:
            role = profile.role
            phone_number = profile.phone_number
        elif user.is_staff:
            role = "admin"
            phone_number = ""
        else:
            role = "customer"
            phone_number = ""

        return Response(
            {
                "status": "success",
                "message": "Login successful.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "phone_number": phone_number,
                    "role": role,
                },
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        django_logout(request._request)

        return Response(
            {
                "status": "success",
                "message": "Logout successful.",
            },
            status=status.HTTP_200_OK,
        )


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = getattr(user, "profile", None)

        if profile is not None:
            role = profile.role
            phone_number = profile.phone_number
        elif user.is_staff:
            role = "admin"
            phone_number = ""
        else:
            role = "customer"
            phone_number = ""

        return Response(
            {
                "status": "success",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "phone_number": phone_number,
                    "role": role,
                },
            },
            status=status.HTTP_200_OK,
        )


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)

        user = request.user
        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])

        return Response(
            {
                "status": "success",
                "message": "Your password has been changed successfully.",
            },
            status=status.HTTP_200_OK,
        )


class UpdateProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        serializer = UpdateProfileSerializer(
            instance=request.user,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(
            {
                "status": "success",
                "message": "Your profile has been updated successfully.",
                "user": serializer.to_representation(user),
            },
            status=status.HTTP_200_OK,
        )


class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        users = User.objects.filter(
            email__iexact=email,
            is_active=True,
        )

        for user in users:
            print("PASSWORD RESET: Matching user found:", user.username)
            if not user.has_usable_password():
                continue

            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            reset_link = (
                f"http://localhost:5173/reset-password/" f"?uid={uid}&token={token}"
            )

            send_mail(
                subject="HotspotHub Password Reset",
                message=(
                    f"Hello {user.username},\n\n"
                    "We received a request to reset your HotspotHub password.\n\n"
                    f"Use this link to reset your password:\n{reset_link}\n\n"
                    "If you did not request this reset, you can ignore this email."
                ),
                from_email=getattr(
                    settings,
                    "DEFAULT_FROM_EMAIL",
                    "noreply@hotspothub.local",
                ),
                recipient_list=[user.email],
                fail_silently=False,
            )
            print("PASSWORD RESET: Email send completed for:", user.email)

        return Response(
            {
                "success": True,
                "message": (
                    "If an account exists with that email address, "
                    "password reset instructions have been sent."
                ),
            },
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        new_password = serializer.validated_data["new_password"]

        user.set_password(new_password)
        user.save(update_fields=["password"])

        return Response(
            {
                "success": True,
                "message": "Your password has been reset successfully.",
            },
            status=status.HTTP_200_OK,
        )
