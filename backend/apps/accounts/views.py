from django.contrib.auth import login as django_login
from django.contrib.auth import logout as django_logout

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import LoginSerializer, RegistrationSerializer


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
