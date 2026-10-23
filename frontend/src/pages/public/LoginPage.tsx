import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../features/authentication/authService";
import { getApiErrorMessage } from "../../api/errors";
import "../../features/authentication/auth.css";

function LoginPage() {
const navigate = useNavigate();

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
event.preventDefault();


setError("");
setIsSubmitting(true);

try {
  await authService.login({
    username: username.trim(),
    password,
  });

  navigate("/profile", { replace: true });
} catch (err: unknown) {
  setError(
    getApiErrorMessage(
      err,
      "Login failed. Please check your credentials and try again.",
    ),
  );
} finally {
  setIsSubmitting(false);
}


}

return ( <main className="auth-page"> <section className="auth-card"> <Link to="/" className="auth-brand">
HotspotHub </Link>


    <p className="eyebrow">WELCOME BACK</p>

    <h1>Sign in to your account</h1>

    <p className="auth-description">
      Access your account and manage your internet connection.
    </p>

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
        placeholder="Enter your username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        required
      />

      <label htmlFor="password">Password</label>

      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter your password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <div className="auth-form-options">
        <Link to="/forgot-password">Forgot password?</Link>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>

    <p className="auth-footer">
      Don't have an account? <Link to="/register">Create one</Link>
    </p>
  </section>
</main>


);
}

export default LoginPage;
