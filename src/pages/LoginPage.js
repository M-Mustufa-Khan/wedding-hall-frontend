import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { login } from "../services/api";
import "./AuthPages.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(form);

      // Save token and user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("auth-change"));

      // Redirect Admins to Admin Panel, Customers to Home (or previous page)
      const targetPath =
        location.state?.from ||
        (res.data.user.role === "Admin" ? "/admin" : "/");
      navigate(targetPath, { state: location.state?.state, replace: true });
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 400) {
        setError("Invalid email or password. Please try again.");
      } else if (err.response?.status === 404) {
        setError("Account not found. Please register first.");
      } else {
        setError("Network error. Is the backend running?");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── LEFT PANEL ── */}
      <div className="auth-left">
        <div className="auth-left-bg" aria-hidden="true" />
        <div className="auth-left-overlay" aria-hidden="true" />
        <div className="auth-left-content">
          <span className="auth-ring-emoji" role="img" aria-label="ring">
            💍
          </span>

          <div className="auth-wordmark">
            <span className="auth-wordmark-gold">Elegant</span>
            <span className="auth-wordmark-white">Celebrations</span>
          </div>

          <p className="auth-tagline">
            Where every detail tells your love story
          </p>

          <div className="auth-stats">
            <div className="auth-stat-chip">
              <span className="auth-stat-chip-label">500+ Weddings Planned</span>
            </div>
            <div className="auth-stat-chip">
              <span className="auth-stat-chip-label">50+ Premium Halls</span>
            </div>
            <div className="auth-stat-chip">
              <span className="auth-stat-chip-label">4.9★ Average Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right">
        <div className="auth-form-card">
          {/* Card top */}
          <span className="auth-card-ring" role="img" aria-label="ring">
            💍
          </span>
          <h1 className="auth-form-title">Welcome Back</h1>
          <p className="auth-form-subtitle">
            Sign in to manage your bookings
          </p>

          {/* Error message */}
          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleLogin} noValidate>
            {/* Email */}
            <div className="auth-input-group">
              <label className="auth-label" htmlFor="login-email">
                Email Address
              </label>
              <div className="auth-input-wrap">
                <Mail size={17} className="auth-input-icon" />
                <input
                  id="login-email"
                  className="auth-input"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-input-group">
              <label className="auth-label" htmlFor="login-password">
                Password
              </label>
              <div className="auth-input-wrap">
                <Lock size={17} className="auth-input-icon" />
                <input
                  id="login-password"
                  className="auth-input has-eye"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="auth-meta-row">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <a
                href="#forgot"
                className="auth-forgot-link"
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading && <span className="auth-spinner" />}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span className="auth-divider-line" />
            <span className="auth-divider-text">OR</span>
            <span className="auth-divider-line" />
          </div>

          {/* Switch to register */}
          <p className="auth-switch-link">
            Don't have an account?{" "}
            <Link to="/register">Create one now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
