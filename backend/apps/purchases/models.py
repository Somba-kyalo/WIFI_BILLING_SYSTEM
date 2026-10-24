import uuid

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class Purchase(models.Model):
    class PaymentMethod(models.TextChoices):
        MPESA = "mpesa", "M-Pesa"
        SIMULATED = "simulated", "Simulated Payment"

    class PaymentStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        SUCCESSFUL = "successful", "Successful"
        FAILED = "failed", "Failed"
        CANCELLED = "cancelled", "Cancelled"

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="purchases",
    )

    package = models.ForeignKey(
        "packages.InternetPackage",
        on_delete=models.PROTECT,
        related_name="purchases",
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )

    package_duration_hours = models.PositiveIntegerField()

    package_speed_mbps = models.PositiveIntegerField()

    package_data_limit_gb = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        default=PaymentMethod.MPESA,
    )

    payment_status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING,
    )

    reference = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
    )

    provider_reference = models.CharField(
        max_length=100,
        unique=True,
        null=True,
        blank=True,
    )

    checkout_request_id = models.CharField(
        max_length=100,
        blank=True,
    )

    result_description = models.TextField(blank=True)

    paid_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Purchase"
        verbose_name_plural = "Purchases"

    def __str__(self):
        return (
            f"Purchase {self.reference} - "
            f"{self.customer.username} - KES {self.amount}"
        )

