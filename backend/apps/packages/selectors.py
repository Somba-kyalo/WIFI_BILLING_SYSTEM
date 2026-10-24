from .models import InternetPackage


def get_active_packages():
    """
    Return all active internet packages.
    """
    return InternetPackage.objects.filter(is_active=True).order_by(
        "price",
        "duration_hours",
    )


def get_package_by_id(package_id):
    """
    Return an active package by its ID.
    Return None if the package does not exist or is inactive.
    """
    return get_active_packages().filter(id=package_id).first()


def get_all_packages():
    """
    Return all internet packages, including inactive ones.
    Intended for administrative operations.
    """
    return InternetPackage.objects.all().order_by(
        "price",
        "duration_hours",
    )
