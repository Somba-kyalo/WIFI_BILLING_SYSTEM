from django.core.exceptions import ValidationError
from django.db import transaction

from .models import InternetPackage


@transaction.atomic
def create_package(validated_data):
    """
    Create a new internet package.
    """
    package = InternetPackage(**validated_data)
    package.full_clean()
    package.save()

    return package


@transaction.atomic
def update_package(package, validated_data):
    """
    Update an existing internet package.
    """
    for field, value in validated_data.items():
        setattr(package, field, value)

    package.full_clean()
    package.save()

    return package


@transaction.atomic
def deactivate_package(package):
    """
    Deactivate a package without deleting its history.
    """
    if not package.is_active:
        raise ValidationError("This package is already inactive.")

    package.is_active = False
    package.save(update_fields=["is_active", "updated_at"])

    return package
