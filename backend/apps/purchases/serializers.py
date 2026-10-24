from rest_framework import serializers

from .models import Purchase

class PurchaseCreateSerializer(serializers.Serializer):
"""
Validate data submitted when a customer creates a purchase.
"""


package_id = serializers.IntegerField(min_value=1)

payment_method = serializers.ChoiceField(
    choices=Purchase.PaymentMethod.choices,
    default=Purchase.PaymentMethod.MPESA,
)


class PurchaseSerializer(serializers.ModelSerializer):
"""
Serialize purchase details for API responses.
"""


package_name = serializers.CharField(
    source="package.name",
    read_only=True,
)

duration_hours = serializers.IntegerField(
    source="package_duration_hours",
    read_only=True,
)

speed_mbps = serializers.IntegerField(
    source="package_speed_mbps",
    read_only=True,
)

data_limit_gb = serializers.DecimalField(
    source="package_data_limit_gb",
    max_digits=10,
    decimal_places=2,
    allow_null=True,
    read_only=True,
)

payment_method_display = serializers.CharField(
    source="get_payment_method_display",
    read_only=True,
)

payment_status_display = serializers.CharField(
    source="get_payment_status_display",
    read_only=True,
)

class Meta:
    model = Purchase
    fields = [
        "reference",
        "package",
        "package_name",
        "amount",
        "duration_hours",
        "speed_mbps",
        "data_limit_gb",
        "payment_method",
        "payment_method_display",
        "payment_status",
        "payment_status_display",
        "provider_reference",
        "paid_at",
        "created_at",
    ]

    read_only_fields = fields

