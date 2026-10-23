import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../features/authentication/authService";
import { getApiErrorMessage } from "../../api/errors";
import "../../features/authentication/auth.css";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const response = await authService.requestPasswordReset({ email });
      setMessage(
        response.message ||
          "If an account matches that email, a reset link will be sent.",
      );
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(
          err,
          "We could not process your request. Please try again.",
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

        <p className="eyebrow">ACCOUNT RECOVERY</p>
        <h1>Forgot your password?</h1>
        <p className="auth-description">
          Enter the email address associated with your account. We'll help you
          get back in.
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
          <label htmlFor="reset-email">Email address</label>
          <input
            id="reset-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending request..." : "Reset password"}
          </button>
        </form>

        <p className="auth-footer">
          Remember your password? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

export default ForgotPasswordPage;