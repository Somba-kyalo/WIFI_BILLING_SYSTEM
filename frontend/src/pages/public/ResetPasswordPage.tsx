import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authService } from "../../features/authentication/authService";
import { getApiErrorMessage } from "../../api/errors";
import "../../features/authentication/auth.css";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get("uid") ?? "";
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!uid || !token) {
      setError("This password-reset link is incomplete or invalid.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authService.confirmPasswordReset({
        uid,
        token,
        new_password: newPassword,
        new_password_confirm: confirmPassword,
      });

      setMessage(response.message || "Your password has been reset successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(
          err,
          "We could not reset your password. Please request a new reset link.",
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
        <h1>Reset your password</h1>
        <p className="auth-description">
          Choose a new password for your HotspotHub account.
        </p>

        {message && (
          <div className="auth-alert auth-alert-success" role="status">
            {message}
            <p>
              <Link to="/login">Continue to sign in</Link>
            </p>
          </div>
        )}

        {error && (
          <div className="auth-alert auth-alert-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="new-password">New password</label>
          <input
            id="new-password"
            name="new-password"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            minLength={8}
            required
          />

          <label htmlFor="confirm-password">Confirm new password</label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength={8}
            required
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating password..." : "Update password"}
          </button>
        </form>

        <p className="auth-footer">
          Need another reset link? <Link to="/forgot-password">Request one</Link>
        </p>
      </section>
    </main>
  );
}

export default ResetPasswordPage;