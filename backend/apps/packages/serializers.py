from rest_framework import serializers

from .models import InternetPackage


class InternetPackageSerializer(serializers.ModelSerializer):
    duration_display = serializers.SerializerMethodField()
    data_limit_display = serializers.SerializerMethodField()

    class Meta:
        model = InternetPackage
        fields = [
            "id",
            "name",
            "description",
            "price",
            "duration_hours",
            "duration_display",
            "speed_mbps",
            "data_limit_gb",
            "data_limit_display",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def get_duration_display(self, obj):
        if obj.duration_hours < 24:
            return f"{obj.duration_hours} hour(s)"

        days = obj.duration_hours // 24
        remaining_hours = obj.duration_hours % 24

        if remaining_hours:
            return f"{days} day(s) " f"{remaining_hours} hour(s)"

        return f"{days} day(s)"

    def get_data_limit_display(self, obj):
        if obj.data_limit_gb is None:
            return "Unlimited"

        return f"{obj.data_limit_gb} GB"
