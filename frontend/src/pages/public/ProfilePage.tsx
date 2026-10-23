import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../features/authentication/authService";
import type { AuthUser } from "../../features/authentication/authService";
import { getApiErrorMessage } from "../../api/errors";
import "../../features/authentication/auth.css";

function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const profile = await authService.getProfile();

        if (isMounted) {
          setUser(profile);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(
            getApiErrorMessage(
              err,
              "Unable to load your profile. Please sign in again.",
            ),
          );
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

  async function handleLogout() {
    setError("");
    setIsLoggingOut(true);

    try {
      await authService.logout();
      navigate("/login", { replace: true });
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(
          err,
          "Unable to sign out. Please try again.",
        ),
      );
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (isLoading) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <p className="eyebrow">HOTSPOTHUB ACCOUNT</p>
          <h1>Loading your profile...</h1>
          <p className="auth-description">
            Please wait while we retrieve your account information.
          </p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <p className="eyebrow">ACCOUNT ACCESS</p>
          <h1>Profile unavailable</h1>

          <p className="auth-description">
            {error || "We could not retrieve your account information."}
          </p>

          <Link to="/login" className="auth-home-link">
            Return to sign in
          </Link>

          <p className="auth-footer">
            New to HotspotHub? <Link to="/register">Create an account</Link>
          </p>
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

        <p className="eyebrow">CUSTOMER DASHBOARD</p>

        <h1>Your profile</h1>

        <p className="auth-description">
          View your account information and manage your HotspotHub account.
        </p>

        {error && (
          <div className="auth-alert auth-alert-error" role="alert">
            {error}
          </div>
        )}

        <div className="profile-details">
          <div className="profile-detail">
            <span>Username</span>
            <strong>{user.username}</strong>
          </div>

          <div className="profile-detail">
            <span>Email address</span>
            <strong>{user.email || "Not provided"}</strong>
          </div>

          <div className="profile-detail">
            <span>Phone number</span>
            <strong>{user.phone_number || "Not provided"}</strong>
          </div>

          <div className="profile-detail">
            <span>Account role</span>
            <strong>{user.role}</strong>
          </div>

          <div className="profile-detail">
            <span>Account ID</span>
            <strong>{user.id}</strong>
          </div>
        </div>

        <div className="profile-actions">
          <Link to="/profile/update" className="profile-action-link">
            Update profile
          </Link>

          <Link to="/change-password" className="profile-action-link">
            Change password
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>

        <p className="auth-footer">
          Need help accessing your account?{" "}
          <Link to="/forgot-password">Reset your password</Link>
        </p>
      </section>
    </main>
  );
}

export default ProfilePage;