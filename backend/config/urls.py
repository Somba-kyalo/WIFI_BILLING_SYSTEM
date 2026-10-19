from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def api_root(request):
    return JsonResponse(
        {
            "application": "HotspotHub",
            "version": "1.0.0",
            "status": "running",
            "endpoints": {
                "health": "/api/health/",
                "registration": "/api/accounts/register/",
                "admin": "/admin/",
            },
        }
    )


def health_check(request):
    return JsonResponse(
        {
            "status": "success",
            "application": "HotspotHub",
            "message": "HotspotHub API is running.",
        }
    )


urlpatterns = [
    path("", api_root, name="api-root"),
    path("admin/", admin.site.urls),
    path("api/health/", health_check, name="health-check"),
    path(
        "api/accounts/",
        include("apps.accounts.urls"),
    ),
]
