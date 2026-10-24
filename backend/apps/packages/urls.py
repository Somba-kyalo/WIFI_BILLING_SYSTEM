from django.urls import path
from .views import PackageDetailView, PackageListCreateView

app_name = "packages"

urlpatterns = [
    path("", PackageListCreateView.as_view(), name="package-list-create"),
    path("<int:pk>/", PackageDetailView.as_view(), name="package-detail"),
]
