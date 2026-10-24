import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";

import ForgotPasswordPage from "../pages/public/ForgotPasswordPage";
import ResetPasswordPage from "../pages/public/ResetPasswordPage";
import LoginPage from "../pages/public/LoginPage";
import ProfilePage from "../pages/public/ProfilePage";
import RegisterPage from "../pages/public/RegisterPage";
import UpdateProfilePage from "../pages/public/UpdateProfilePage";
import ChangePasswordPage from "../pages/public/ChangePasswordPage";
import DashboardPage from "../pages/customer/DashboardPage";
import PackagesPage from "../pages/customer/PackagesPage";





import "../features/authentication/auth.css";


import "../styles/landing.css";


function HomePage() {
const [menuOpen, setMenuOpen] = useState(false);

const closeMenu = () => setMenuOpen(false);

return ( <div className="landing-page"> <header className="landing-header"> <nav className="landing-nav" aria-label="Main navigation"> <Link to="/" className="landing-brand" onClick={closeMenu}> <span className="brand-icon" aria-hidden="true">
H </span> <span>
Hotspot<span className="brand-highlight">Hub</span> </span> </Link>


      <button
        type="button"
        className="mobile-menu-button"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`landing-nav-content ${menuOpen ? "menu-open" : ""}`}>
        <div className="landing-nav-links">
          <a href="#home" onClick={closeMenu}>Home</a>
          <a href="#features" onClick={closeMenu}>Features</a>
          <a href="#about" onClick={closeMenu}>About</a>
        </div>

        <div className="landing-nav-actions">
          <Link
            to="/login"
            className="nav-login-button"
            onClick={closeMenu}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="nav-register-button"
            onClick={closeMenu}
          >
            Create Account <span aria-hidden="true">â†’</span>
          </Link>
        </div>
      </div>
    </nav>
  </header>

  <main>
    <section className="landing-hero" id="home">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="status-dot" />
          SMART WI-FI BILLING & MANAGEMENT
        </div>

        <h1>
          Your internet.
          <br />
          <span> Your way.</span>
        </h1>

        <p className="hero-description">
          Connect to a smarter internet experience. Explore Wi-Fi
          packages, manage your account, and keep track of your
          connectivity with HotspotHub.
        </p>

        <div className="hero-actions">
          <Link to="/register" className="hero-primary-button">
            Get Started Free <span aria-hidden="true">â†’</span>
          </Link>
          <Link to="/login" className="hero-secondary-button">
            Sign In
          </Link>
        </div>

        <div className="hero-assurance">
          <span aria-hidden="true">âœ“</span>
          Easy account management
          <span className="assurance-divider">Â·</span>
          Convenient access
        </div>
      </div>

      <div className="hero-visual" aria-label="HotspotHub connection preview">
        <div className="visual-glow" />

        <div className="connection-card">
          <div className="connection-card-top">
            <div className="connection-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="30"
                height="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2.5 8.5a14 14 0 0 1 19 0" />
                <path d="M5.5 11.5a9.5 9.5 0 0 1 13 0" />
                <path d="M8.5 14.5a5 5 0 0 1 7 0" />
                <circle cx="12" cy="18" r="1" fill="currentColor" />
              </svg>
            </div>
            <span className="connection-status">
              <span className="status-dot" />
              Smart connectivity
            </span>
          </div>

          <p className="visual-label">WELCOME TO</p>
          <h2>HotspotHub</h2>
          <p className="visual-description">
            A simpler way to manage your Wi-Fi experience.
          </p>

          <div className="visual-divider" />

          <div className="visual-feature">
            <span className="feature-check" aria-hidden="true">âœ“</span>
            <div>
              <strong>Account management</strong>
              <p>Manage your details in one place</p>
            </div>
          </div>

          <div className="visual-feature">
            <span className="feature-check" aria-hidden="true">âœ“</span>
            <div>
              <strong>Wi-Fi packages</strong>
              <p>Explore available internet options</p>
            </div>
          </div>

          <div className="visual-feature">
            <span className="feature-check" aria-hidden="true">âœ“</span>
            <div>
              <strong>Convenient access</strong>
              <p>Your connectivity, made simpler</p>
            </div>
          </div>
        </div>

        <div className="floating-card floating-card-top">
          <span className="floating-icon" aria-hidden="true">âŒ</span>
          <div>
            <strong>Stay connected</strong>
            <span>A smarter online experience</span>
          </div>
        </div>

        <div className="floating-card floating-card-bottom">
          <span className="floating-icon floating-icon-green" aria-hidden="true">âœ“</span>
          <div>
            <strong>Simple & convenient</strong>
            <span>Built around your needs</span>
          </div>
        </div>
      </div>
    </section>

    <section className="landing-features" id="features">
      <div className="section-heading">
        <p className="eyebrow">BUILT FOR CONVENIENCE</p>
        <h2>Everything starts with a better connection.</h2>
        <p>
          Manage your Wi-Fi experience through one straightforward
          platform.
        </p>
      </div>

      <div className="feature-grid">
        <article className="feature-card">
          <div className="feature-card-icon" aria-hidden="true">â—‰</div>
          <h3>Simple Account Access</h3>
          <p>
            Create an account and access your personal space whenever
            you need it.
          </p>
        </article>

        <article className="feature-card">
          <div className="feature-card-icon" aria-hidden="true">âŒ</div>
          <h3>Wi-Fi Management</h3>
          <p>
            Find your way around your internet account and available
            connectivity options.
          </p>
        </article>

        <article className="feature-card">
          <div className="feature-card-icon" aria-hidden="true">â†—</div>
          <h3>Convenient Experience</h3>
          <p>
            Use a clean dashboard designed to make managing your
            account straightforward.
          </p>
        </article>
      </div>
    </section>

    <section className="landing-about" id="about">
      <div>
        <p className="eyebrow">MEET HOTSPOTHUB</p>
        <h2>A smarter approach to Wi-Fi management.</h2>
        <p>
          HotspotHub is being developed to simplify Wi-Fi billing,
          customer accounts, and network management through a unified
          platform.
        </p>
      </div>

      <Link to="/register" className="hero-primary-button">
        Join HotspotHub <span aria-hidden="true">â†’</span>
      </Link>
    </section>

    <section className="landing-cta">
      <p className="eyebrow">READY TO GET STARTED?</p>
      <h2>Your next connection starts here.</h2>
      <p>Create your account or sign in to continue.</p>
      <div className="hero-actions">
        <Link to="/register" className="hero-primary-button">
          Create Account <span aria-hidden="true">â†’</span>
        </Link>
        <Link to="/login" className="hero-secondary-button">
          Login to Your Account
        </Link>
      </div>
    </section>
  </main>

  <footer className="landing-footer">
    <Link to="/" className="landing-brand">
      <span className="brand-icon" aria-hidden="true">H</span>
      <span>
        Hotspot<span className="brand-highlight">Hub</span>
      </span>
    </Link>

    <p>Smarter Wi-Fi management. A simpler connection.</p>

    <span className="footer-copyright">
      Â© {new Date().getFullYear()} HotspotHub
    </span>
  </footer>
</div>


);
}

function NotFoundPage() {
return ( <main className="auth-page"> <section className="auth-card"> <p className="eyebrow">404 ERROR</p> <h1>Page not found</h1> <p className="auth-description">
The page you are looking for does not exist. </p> <Link to="/" className="auth-home-link">
Return home </Link> </section> </main>
);
}

function Router() {
return ( <Routes>
<Route path="/" element={<HomePage />} />
<Route path="/profile" element={<ProfilePage />} />
<Route path="/change-password" element={<ChangePasswordPage />} />
<Route path="/profile/update" element={<UpdateProfilePage />} />
<Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/register" element={<RegisterPage />} />
<Route path="/reset-password" element={<ResetPasswordPage />} />
<Route path="/login" element={<LoginPage />} />
<Route path="/dashboard" element={<DashboardPage />} />
<Route path="/packages" element={<PackagesPage />} />
<Route path="*" element={<NotFoundPage />} /> </Routes>
);
}

export default Router;


