from django.core.validators import MinValueValidator
from django.db import models


class InternetPackage(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )

    duration_hours = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
    )

    speed_mbps = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
    )

    data_limit_gb = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        help_text="Leave blank for unlimited data.",
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["price", "duration_hours"]
        verbose_name = "Internet Package"
        verbose_name_plural = "Internet Packages"

    def __str__(self):
        return f"{self.name} - KES {self.price}"
