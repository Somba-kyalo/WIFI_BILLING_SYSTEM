import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../features/authentication/authService";
import type { AuthUser } from "../../features/authentication/authService";
import apiClient from "../../api/client";
import API_ENDPOINTS from "../../api/endpoints";
import { getApiErrorMessage } from "../../api/errors";
import "../../features/authentication/auth.css";

function UpdateProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        await apiClient.get("/csrf/");
        const profile = await authService.getProfile();

        if (isMounted) {
          setUser(profile);
          setUsername(profile.username);
          setEmail(profile.email);
          setPhoneNumber(profile.phone_number || "");
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(getApiErrorMessage(err, "Unable to load your profile."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await apiClient.patch<AuthUser>(
        API_ENDPOINTS.accounts.updateProfile,
        {
          username: username.trim(),
          email: email.trim(),
          phone_number: phoneNumber.trim(),
        },
      );

      setUser(response.data);
      setMessage("Your profile was updated successfully.");
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(err, "Unable to update your profile. Try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <h1>Loading profile...</h1>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <h1>Profile unavailable</h1>
          <p className="auth-description">
            {error || "Please sign in to update your profile."}
          </p>
          <Link to="/login" className="auth-home-link">
            Sign in
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-brand">
          HotspotHub
        </Link>

        <p className="eyebrow">ACCOUNT SETTINGS</p>
        <h1>Update your profile</h1>

        <p className="auth-description">
          Keep your account information accurate and up to date.
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
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="phone-number">Phone number</label>
          <input
            id="phone-number"
            type="tel"
            autoComplete="tel"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            required
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving changes..." : "Save changes"}
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

export default UpdateProfilePage;