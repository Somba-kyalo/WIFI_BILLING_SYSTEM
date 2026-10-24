from django.core.exceptions import ValidationError
from django.db import transaction

from apps.packages.selectors import get_package_by_id

from .models import Purchase


@transaction.atomic
def create_purchase(customer, package_id, payment_method="mpesa"):
    """
    Create a pending purchase for an active internet package.

    The purchase amount and package details come from the database.
    Customers cannot submit their own prices.
    """

    package = get_package_by_id(package_id)

    if package is None:
        raise ValidationError(
            "The selected internet package does not exist or is inactive."
        )

    if payment_method not in Purchase.PaymentMethod.values:
        raise ValidationError("The selected payment method is not supported.")

    purchase = Purchase(
        customer=customer,
        package=package,
        amount=package.price,
        package_duration_hours=package.duration_hours,
        package_speed_mbps=package.speed_mbps,
        package_data_limit_gb=package.data_limit_gb,
        payment_method=payment_method,
        payment_status=Purchase.PaymentStatus.PENDING,
    )

    purchase.full_clean()
    purchase.save()

    return purchase
