import { Route, Routes } from "react-router-dom";
import ForgotPasswordPage from "../pages/public/ForgotPasswordPage";
import ResetPasswordPage from "../pages/public/ResetPasswordPage";
import "../features/authentication/auth.css";

import LoginPage from "../pages/public/LoginPage";

import ProfilePage from "../pages/public/ProfilePage";

import RegisterPage from "../pages/public/RegisterPage";

import UpdateProfilePage from "../pages/public/UpdateProfilePage";

import ChangePasswordPage from "../pages/public/ChangePasswordPage";

import DashboardPage from "../pages/customer/DashboardPage";

function HomePage() {
  return (
    <main className="page-container">
      <section className="welcome-card">
        <p className="eyebrow">SMART WI-FI MANAGEMENT</p>
        <h1>Welcome to HotspotHub</h1>
        <p>
          Manage Wi-Fi access, explore internet packages, and stay connected
          with a smarter network experience.
        </p>
      </section>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">404 ERROR</p>
        <h1>Page not found</h1>
        <p className="auth-description">
          The page you are looking for does not exist.
        </p>
        <a href="/" className="auth-home-link">
          Return home
        </a>
      </section>
    </main>
  );
}

function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      <Route path="/profile/update" element={<UpdateProfilePage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}

export default Router;