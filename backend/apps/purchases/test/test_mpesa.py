from unittest.mock import Mock, patch

from django.test import SimpleTestCase, override_settings

from apps.purchases.mpesa import (
MpesaAuthenticationError,
MpesaConfigurationError,
get_mpesa_access_token,
)

@override_settings(
MPESA_ENVIRONMENT="sandbox",
MPESA_BASE_URL="https://sandbox.safaricom.co.ke",
MPESA_CONSUMER_KEY="test-consumer-key",
MPESA_CONSUMER_SECRET="test-consumer-secret",
)
class MpesaOAuthTests(SimpleTestCase):


@patch("apps.purchases.mpesa.requests.get")
def test_returns_access_token(self, mock_get):
    mock_response = Mock()
    mock_response.json.return_value = {
        "access_token": "test-access-token",
        "expires_in": "3599",
    }
    mock_response.raise_for_status.return_value = None
    mock_get.return_value = mock_response

    token = get_mpesa_access_token()

    self.assertEqual(token, "test-access-token")
    mock_get.assert_called_once_with(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate"
        "?grant_type=client_credentials",
        auth=("test-consumer-key", "test-consumer-secret"),
        headers={"Accept": "application/json"},
        timeout=15,
    )

@override_settings(
    MPESA_CONSUMER_KEY="",
    MPESA_CONSUMER_SECRET="",
)
def test_rejects_missing_credentials(self):
    with self.assertRaises(MpesaConfigurationError):
        get_mpesa_access_token()

@override_settings(MPESA_ENVIRONMENT="invalid")
def test_rejects_invalid_environment(self):
    with self.assertRaises(MpesaConfigurationError):
        get_mpesa_access_token()

@patch("apps.purchases.mpesa.requests.get")
def test_handles_http_error(self, mock_get):
    import requests

    mock_get.side_effect = requests.Timeout("Timed out")

    with self.assertRaises(MpesaAuthenticationError):
        get_mpesa_access_token()

@patch("apps.purchases.mpesa.requests.get")
def test_rejects_missing_access_token(self, mock_get):
    mock_response = Mock()
    mock_response.json.return_value = {"expires_in": "3599"}
    mock_response.raise_for_status.return_value = None
    mock_get.return_value = mock_response

    with self.assertRaises(MpesaAuthenticationError):
        get_mpesa_access_token()
