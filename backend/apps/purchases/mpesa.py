import requests
from django.conf import settings

class MpesaConfigurationError(Exception):
"""Raised when required Daraja configuration is missing or invalid."""

class MpesaAuthenticationError(Exception):
"""Raised when Daraja authentication fails."""

def get_mpesa_access_token():
"""
Obtain an OAuth access token from the configured Daraja environment.


Returns:
    str: The OAuth access token.

Raises:
    MpesaConfigurationError: If configuration is missing or invalid.
    MpesaAuthenticationError: If Daraja authentication fails.
"""
if settings.MPESA_ENVIRONMENT not in {"sandbox", "production"}:
    raise MpesaConfigurationError(
        "The configured M-Pesa environment is invalid."
    )

if not settings.MPESA_CONSUMER_KEY or not settings.MPESA_CONSUMER_SECRET:
    raise MpesaConfigurationError(
        "M-Pesa Consumer Key and Consumer Secret must be configured."
    )

if not settings.MPESA_BASE_URL:
    raise MpesaConfigurationError(
        "The M-Pesa API base URL is not configured."
    )

url = f"{settings.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials"

try:
    response = requests.get(
        url,
        auth=(
            settings.MPESA_CONSUMER_KEY,
            settings.MPESA_CONSUMER_SECRET,
        ),
        headers={"Accept": "application/json"},
        timeout=15,
    )
    response.raise_for_status()
    data = response.json()

except (requests.RequestException, ValueError) as exc:
    raise MpesaAuthenticationError(
        "Unable to obtain an M-Pesa access token."
    ) from exc

access_token = data.get("access_token")

if not isinstance(access_token, str) or not access_token.strip():
    raise MpesaAuthenticationError(
        "Daraja returned an invalid access-token response."
    )

return access_token
