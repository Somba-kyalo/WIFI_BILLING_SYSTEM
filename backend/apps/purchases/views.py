from django.core.exceptions import ValidationError as DjangoValidationError

from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.response import Response

from .selectors import get_customer_purchases
from .serializers import PurchaseCreateSerializer, PurchaseSerializer
from .services import create_purchase


class PurchaseListCreateView(generics.ListCreateAPIView):
    """
    Allow authenticated customers to create purchases
    and view only their own purchase history.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return get_customer_purchases(self.request.user)

    def get_serializer_class(self):
        if self.request.method == "POST":
            return PurchaseCreateSerializer

        return PurchaseSerializer

    def create(self, request, *args, **kwargs):
        request_serializer = self.get_serializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)

        try:
            purchase = create_purchase(
                customer=request.user,
                package_id=request_serializer.validated_data["package_id"],
                payment_method=request_serializer.validated_data["payment_method"],
            )
        except DjangoValidationError as exc:
            detail = getattr(exc, "message_dict", None)

            if detail is None:
                detail = exc.messages

            raise DRFValidationError(detail=detail) from exc

        response_serializer = PurchaseSerializer(
            purchase,
            context=self.get_serializer_context(),
        )

        return Response(
            {
                "status": "success",
                "message": "Purchase created. Payment is pending confirmation.",
                "purchase": response_serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class PurchaseDetailView(generics.RetrieveAPIView):
    """
    Allow customers to retrieve only their own purchases.
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PurchaseSerializer
    lookup_field = "reference"
    lookup_url_kwarg = "reference"

    def get_queryset(self):
        return get_customer_purchases(self.request.user)
