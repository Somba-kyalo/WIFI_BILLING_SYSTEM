from decimal import Decimal

from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from apps.packages.models import InternetPackage
from apps.purchases.models import Purchase


User = get_user_model()


class PurchaseAPITests(APITestCase):
    def setUp(self):
        self.customer = User.objects.create_user(
            username="customer_one",
            email="customer1@example.com",
            password="StrongTestPass123!",
        )

        self.other_customer = User.objects.create_user(
            username="customer_two",
            email="customer2@example.com",
            password="StrongTestPass123!",
        )

        self.active_package = InternetPackage.objects.create(
            name="Daily Basic",
            description="Daily internet access.",
            price=Decimal("50.00"),
            duration_hours=24,
            speed_mbps=10,
            data_limit_gb=Decimal("5.00"),
            is_active=True,
        )

        self.inactive_package = InternetPackage.objects.create(
            name="Unavailable Package",
            description="An inactive internet package.",
            price=Decimal("30.00"),
            duration_hours=12,
            speed_mbps=5,
            data_limit_gb=Decimal("2.00"),
            is_active=False,
        )

        self.list_url = reverse("purchases:purchase-list-create")

    def create_purchase(self, customer, package=None):
        if package is None:
            package = self.active_package

        return Purchase.objects.create(
            customer=customer,
            package=package,
            amount=package.price,
            package_duration_hours=package.duration_hours,
            package_speed_mbps=package.speed_mbps,
            package_data_limit_gb=package.data_limit_gb,
            payment_method=Purchase.PaymentMethod.MPESA,
            payment_status=Purchase.PaymentStatus.PENDING,
        )

    def test_unauthenticated_customer_cannot_list_purchases(self):
        response = self.client.get(self.list_url)

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )

    def test_unauthenticated_customer_cannot_create_purchase(self):
        response = self.client.post(
            self.list_url,
            {"package_id": self.active_package.pk},
            format="json",
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )

    def test_authenticated_customer_can_create_purchase(self):
        self.client.force_authenticate(user=self.customer)

        response = self.client.post(
            self.list_url,
            {
                "package_id": self.active_package.pk,
                "payment_method": "mpesa",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertEqual(response.data["status"], "success")
        self.assertEqual(
            response.data["purchase"]["amount"],
            "50.00",
        )
        self.assertEqual(
            response.data["purchase"]["payment_status"],
            "pending",
        )
        self.assertTrue(
            Purchase.objects.filter(
                customer=self.customer,
                package=self.active_package,
            ).exists()
        )

    def test_customer_cannot_set_purchase_price(self):
        self.client.force_authenticate(user=self.customer)

        response = self.client.post(
            self.list_url,
            {
                "package_id": self.active_package.pk,
                "payment_method": "mpesa",
                "amount": "0.01",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        purchase = Purchase.objects.get(
            reference=response.data["purchase"]["reference"]
        )

        self.assertEqual(purchase.amount, Decimal("50.00"))

    def test_customer_cannot_purchase_inactive_package(self):
        self.client.force_authenticate(user=self.customer)

        response = self.client.post(
            self.list_url,
            {"package_id": self.inactive_package.pk},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertEqual(Purchase.objects.count(), 0)

    def test_customer_cannot_purchase_nonexistent_package(self):
        self.client.force_authenticate(user=self.customer)

        response = self.client.post(
            self.list_url,
            {"package_id": 999999},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertEqual(Purchase.objects.count(), 0)

    def test_customer_can_only_list_their_own_purchases(self):
        own_purchase = self.create_purchase(self.customer)
        self.create_purchase(self.other_customer)

        self.client.force_authenticate(user=self.customer)

        response = self.client.get(self.list_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertEqual(len(response.data), 1)
        self.assertEqual(
            response.data[0]["reference"],
            str(own_purchase.reference),
        )

    def test_customer_can_retrieve_their_own_purchase(self):
        purchase = self.create_purchase(self.customer)

        self.client.force_authenticate(user=self.customer)

        detail_url = reverse(
            "purchases:purchase-detail",
            kwargs={"reference": purchase.reference},
        )

        response = self.client.get(detail_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertEqual(
            response.data["reference"],
            str(purchase.reference),
        )

    def test_customer_cannot_retrieve_another_customers_purchase(self):
        other_purchase = self.create_purchase(self.other_customer)

        self.client.force_authenticate(user=self.customer)

        detail_url = reverse(
            "purchases:purchase-detail",
            kwargs={"reference": other_purchase.reference},
        )

        response = self.client.get(detail_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_new_purchase_remains_pending_until_payment_confirmation(self):
        self.client.force_authenticate(user=self.customer)

        response = self.client.post(
            self.list_url,
            {"package_id": self.active_package.pk},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )
        self.assertEqual(
            response.data["purchase"]["payment_status"],
            Purchase.PaymentStatus.PENDING,
        )
        self.assertIsNone(
            response.data["purchase"]["paid_at"],
        )

