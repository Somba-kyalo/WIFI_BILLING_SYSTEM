import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/client";
import API_ENDPOINTS from "../../api/endpoints";
import { getApiErrorMessage } from "../../api/errors";
import "../../features/authentication/auth.css";

function ChangePasswordPage() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Your new passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("Your new password must differ from your current password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.post<{ message: string }>(
        API_ENDPOINTS.accounts.changePassword,
        {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirm: confirmPassword,
        },
      );

      setMessage(response.data.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(
          err,
          "Unable to change your password. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-brand">
          HotspotHub
        </Link>

        <p className="eyebrow">ACCOUNT SECURITY</p>
        <h1>Change your password</h1>

        <p className="auth-description">
          Use your current password to set a new password for your account.
        </p>

        {message && (
          <div className="auth-alert auth-alert-success" role="status">
            {message}
          </div>
        )}

        {error && (
          <div className="auth-alert auth-alert-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="current-password">Current password</label>
          <input
            id="current-password"
            name="current_password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
          />

          <label htmlFor="new-password">New password</label>
          <input
            id="new-password"
            name="new_password"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
          />

          <label htmlFor="confirm-password">Confirm new password</label>
          <input
            id="confirm-password"
            name="new_password_confirm"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating password..." : "Change password"}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/profile">Back to your profile</Link>
        </p>

        <button
          type="button"
          className="secondary-action"
          onClick={() => navigate("/profile")}
        >
          Cancel
        </button>
      </section>
    </main>
  );
}

export default ChangePasswordPage;