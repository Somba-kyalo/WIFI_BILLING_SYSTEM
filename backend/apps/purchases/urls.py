from django.urls import path

from .views import PurchaseDetailView, PurchaseListCreateView

app_name = "purchases"

urlpatterns = [
    path("", PurchaseListCreateView.as_view(), name="purchase-list-create"),
    path("<uuid:reference>/", PurchaseDetailView.as_view(), name="purchase-detail"),
]
