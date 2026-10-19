from rest_framework import generics, permissions, status
from rest_framework.response import Response

from .serializers import RegistrationSerializer


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
