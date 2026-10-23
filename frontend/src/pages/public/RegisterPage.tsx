import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../features/authentication/authService";
import { getApiErrorMessage } from "../../api/errors";
import "../../features/authentication/auth.css";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authService.register({
        username: username.trim(),
        email: email.trim(),
        phone_number: phoneNumber.trim(),
        password,
        password_confirm: confirmPassword,
      });

      setMessage(response.message || "Your account was created successfully.");
      setUsername("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(
          err,
          "We could not create your account. Please try again.",
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

        <p className="eyebrow">GET STARTED</p>
        <h1>Create your account</h1>
        <p className="auth-description">
          Join HotspotHub to manage your internet access and stay connected.
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
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="phone-number">Phone number</label>
          <input
            id="phone-number"
            name="phone_number"
            type="tel"
            autoComplete="tel"
            placeholder="e.g. 07XXXXXXXX"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <label htmlFor="confirm-password">Confirm password</label>
          <input
            id="confirm-password"
            name="password_confirm"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;