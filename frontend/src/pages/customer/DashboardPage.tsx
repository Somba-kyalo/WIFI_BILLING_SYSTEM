import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../features/authentication/authService";
import type { AuthUser } from "../../features/authentication/authService";
import { getApiErrorMessage } from "../../api/errors";
import "../../features/authentication/auth.css";

function DashboardPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
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
              "Unable to load your account. Please sign in again.",
            ),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <p className="eyebrow">HOTSPOTHUB</p>
          <h1>Loading your dashboard...</h1>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <p className="eyebrow">ACCOUNT ACCESS</p>
          <h1>Sign in required</h1>
          <p className="auth-description">
            {error || "Please sign in to access your dashboard."}
          </p>
          <button type="button" onClick={() => navigate("/login")}>
            Sign in
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page-container">
      <section className="welcome-card">
        <p className="eyebrow">CUSTOMER DASHBOARD</p>

        <h1>Welcome back, {user.username}!</h1>

        <p>
          Manage your internet packages, monitor your connection, and keep
          your HotspotHub account up to date.
        </p>

        <div className="dashboard-actions">
          <Link to="/packages" className="dashboard-button">
            Explore packages
          </Link>

          <Link to="/profile" className="dashboard-button secondary">
            Manage profile
          </Link>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <p className="dashboard-card-label">INTERNET SUBSCRIPTION</p>
          <h2>No active subscription</h2>
          <p>
            You have not connected an active subscription to this dashboard
            yet.
          </p>
        </article>

        <article className="dashboard-card">
          <p className="dashboard-card-label">DATA USAGE</p>
          <h2>Not available yet</h2>
          <p>
            Your data usage will appear here when network usage tracking is
            implemented.
          </p>
        </article>

        <article className="dashboard-card">
          <p className="dashboard-card-label">ACCOUNT STATUS</p>
          <h2>Account available</h2>
          <p>Your HotspotHub account is ready to manage.</p>
        </article>
      </section>

      <section className="dashboard-bottom">
        <div>
          <h2>Quick access</h2>
          <p>Manage your account and explore HotspotHub services.</p>
        </div>

        <nav className="dashboard-links" aria-label="Customer navigation">
          <Link to="/profile">My profile</Link>
          <Link to="/profile/update">Update details</Link>
          <Link to="/change-password">Change password</Link>
          <Link to="/packages">Browse packages</Link>
        </nav>
      </section>
    </main>
  );
}

export default DashboardPage;