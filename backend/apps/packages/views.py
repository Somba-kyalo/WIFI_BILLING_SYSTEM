from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404

from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.response import Response

from .models import InternetPackage
from .selectors import get_active_packages, get_all_packages
from .serializers import InternetPackageSerializer
from .services import (
    create_package,
    deactivate_package,
    update_package,
)


class IsAdministrator(permissions.BasePermission):
    """
    Allow package management only to administrators.
    """

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and request.user.is_staff
        )


class PackageListCreateView(generics.ListCreateAPIView):
    """
    List active packages publicly.
    Allow administrators to create packages.
    """

    serializer_class = InternetPackageSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAdministrator()]

        return [permissions.AllowAny()]

    def get_queryset(self):
        return get_active_packages()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            package = create_package(serializer.validated_data)
        except ValidationError as exc:
            raise DRFValidationError(
                detail=getattr(exc, "message_dict", exc.messages)
            ) from exc

        response_serializer = self.get_serializer(package)

        return Response(
            {
                "status": "success",
                "message": "Internet package created successfully.",
                "package": response_serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class PackageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve an active package publicly.
    Restrict package management to administrators.
    Deactivate packages instead of deleting them permanently.
    """

    serializer_class = InternetPackageSerializer
    lookup_field = "pk"

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [IsAdministrator()]

        return [permissions.AllowAny()]

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return get_all_packages()

        return get_active_packages()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial,
        )
        serializer.is_valid(raise_exception=True)

        try:
            package = update_package(
                instance,
                serializer.validated_data,
            )
        except ValidationError as exc:
            raise DRFValidationError(
                detail=getattr(exc, "message_dict", exc.messages)
            ) from exc

        return Response(
            {
                "status": "success",
                "message": "Internet package updated successfully.",
                "package": self.get_serializer(package).data,
            },
            status=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        try:
            deactivate_package(instance)
        except ValidationError as exc:
            raise DRFValidationError(
                detail=getattr(exc, "message_dict", exc.messages)
            ) from exc

        return Response(
            {
                "status": "success",
                "message": "Internet package deactivated successfully.",
            },
            status=status.HTTP_200_OK,
        )
