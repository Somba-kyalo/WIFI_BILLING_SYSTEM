from decimal import Decimal

from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from apps.packages.models import InternetPackage

User = get_user_model()


class PackageAPITests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="package_admin",
            email="admin@example.com",
            password="StrongTestPass123!",
            is_staff=True,
        )

        self.customer = User.objects.create_user(
            username="package_customer",
            email="customer@example.com",
            password="StrongTestPass123!",
        )

        self.active_package = InternetPackage.objects.create(
            name="Daily Basic",
            description="Affordable daily internet access.",
            price=Decimal("50.00"),
            duration_hours=24,
            speed_mbps=10,
            data_limit_gb=Decimal("5.00"),
            is_active=True,
        )

        self.inactive_package = InternetPackage.objects.create(
            name="Old Package",
            description="An unavailable internet package.",
            price=Decimal("30.00"),
            duration_hours=12,
            speed_mbps=5,
            data_limit_gb=Decimal("2.00"),
            is_active=False,
        )

        self.list_url = reverse("packages:package-list-create")

    def test_public_can_list_active_packages(self):
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Daily Basic")

    def test_customer_cannot_create_package(self):
        self.client.force_authenticate(user=self.customer)

        response = self.client.post(
            self.list_url,
            {
                "name": "Customer Package",
                "description": "Test package",
                "price": "100.00",
                "duration_hours": 24,
                "speed_mbps": 20,
                "data_limit_gb": "10.00",
                "is_active": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_package(self):
        self.client.force_authenticate(user=self.admin)

        response = self.client.post(
            self.list_url,
            {
                "name": "Weekly Plus",
                "description": "Weekly internet access.",
                "price": "250.00",
                "duration_hours": 168,
                "speed_mbps": 20,
                "data_limit_gb": "30.00",
                "is_active": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(InternetPackage.objects.filter(name="Weekly Plus").exists())

    def test_admin_can_update_package(self):
        self.client.force_authenticate(user=self.admin)

        url = reverse(
            "packages:package-detail",
            kwargs={"pk": self.active_package.pk},
        )

        response = self.client.patch(
            url,
            {"price": "75.00"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.active_package.refresh_from_db()
        self.assertEqual(self.active_package.price, Decimal("75.00"))

    def test_admin_can_deactivate_package(self):
        self.client.force_authenticate(user=self.admin)

        url = reverse(
            "packages:package-detail",
            kwargs={"pk": self.active_package.pk},
        )

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.active_package.refresh_from_db()
        self.assertFalse(self.active_package.is_active)

    def test_public_cannot_retrieve_inactive_package(self):
        url = reverse(
            "packages:package-detail",
            kwargs={"pk": self.inactive_package.pk},
        )

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_invalid_package_data_is_rejected(self):
        self.client.force_authenticate(user=self.admin)

        response = self.client.post(
            self.list_url,
            {
                "name": "Invalid Package",
                "description": "Invalid speed",
                "price": "50.00",
                "duration_hours": 24,
                "speed_mbps": 0,
                "data_limit_gb": "5.00",
                "is_active": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
