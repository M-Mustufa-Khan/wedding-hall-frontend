import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Phone, User, Eye, EyeOff } from "lucide-react";
import { register } from "../services/api";
import "./AuthPages.css";

/* ── Password strength helpers ── */
const getStrengthLevel = (pass) => {
  if (!pass) return 0;
  if (pass.length < 6) return 1;   // Weak
  if (pass.length < 8) return 2;   // Fair
  if (pass.length < 12) return 3;  // Strong
  return 4;                         // Very Strong
};

const STRENGTH_META = {
  0: { label: "",            cls: "" },
  1: { label: "Weak",        cls: "strength-1" },
  2: { label: "Fair",        cls: "strength-2" },
  3: { label: "Strong",      cls: "strength-3" },
  4: { label: "Very Strong", cls: "strength-4" },
};

const RegisterPage = () => {
  useEffect(() => { document.title = "Create Account — Elegant Celebrations"; }, []);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strengthLevel = getStrengthLevel(form.password);
  const strengthMeta = STRENGTH_META[strengthLevel];

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);
    try {
      // Pass only the fields the API expects
      const { confirmPassword, ...payload } = form;
      await register(payload);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* Segment helper: returns the active color class if this segment should be lit */
  const segClass = (segIndex) => {
    if (strengthLevel >= segIndex) return `active-${strengthLevel}`;
    return "";
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
            Your dream wedding, our perfect venue
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
          <h1 className="auth-form-title">Create Account</h1>
          <p className="auth-form-subtitle">
            Start planning your perfect day
          </p>

          {/* Error message */}
          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleRegister} noValidate>
            {/* Full Name */}
            <div className="auth-input-group">
              <label className="auth-label" htmlFor="reg-fullname">
                Full Name
              </label>
              <div className="auth-input-wrap">
                <User size={17} className="auth-input-icon" />
                <input
                  id="reg-fullname"
                  className="auth-input"
                  type="text"
                  placeholder="Sarah & Ahmed"
                  required
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Email */}
            <div className="auth-input-group">
              <label className="auth-label" htmlFor="reg-email">
                Email Address
              </label>
              <div className="auth-input-wrap">
                <Mail size={17} className="auth-input-icon" />
                <input
                  id="reg-email"
                  className="auth-input"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Phone (optional) */}
            <div className="auth-input-group">
              <label className="auth-label" htmlFor="reg-phone">
                Phone{" "}
                <span
                  style={{
                    fontWeight: 400,
                    textTransform: "none",
                    letterSpacing: 0,
                    color: "rgba(170,165,155,0.45)",
                  }}
                >
                  (optional)
                </span>
              </label>
              <div className="auth-input-wrap">
                <Phone size={17} className="auth-input-icon" />
                <input
                  id="reg-phone"
                  className="auth-input"
                  type="tel"
                  placeholder="+92 300 1234567"
                  autoComplete="tel"
                  maxLength={11}
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value.replace(/\D/g, "").slice(0, 11),
                    })
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-input-group">
              <label className="auth-label" htmlFor="reg-password">
                Password
              </label>
              <div className="auth-input-wrap">
                <Lock size={17} className="auth-input-icon" />
                <input
                  id="reg-password"
                  className="auth-input has-eye"
                  type={showPass ? "text" : "password"}
                  placeholder="Create a strong password"
                  required
                  autoComplete="new-password"
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

              {/* Strength bar — 4 segments */}
              {form.password && (
                <div className="password-strength-wrap">
                  <div className="password-strength-bar">
                    <span className={`psb-seg ${segClass(1)}`} />
                    <span className={`psb-seg ${segClass(2)}`} />
                    <span className={`psb-seg ${segClass(3)}`} />
                    <span className={`psb-seg ${segClass(4)}`} />
                  </div>
                  <span
                    className={`password-strength-label ${strengthMeta.cls}`}
                  >
                    {strengthMeta.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="auth-input-group">
              <label className="auth-label" htmlFor="reg-confirm">
                Confirm Password
              </label>
              <div className="auth-input-wrap">
                <Lock size={17} className="auth-input-icon" />
                <input
                  id="reg-confirm"
                  className="auth-input has-eye"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  required
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={
                    showConfirm
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="auth-terms-row">
              <label className="auth-checkbox-label">
                <input type="checkbox" required />
                I agree to the{" "}
                <a
                  href="#terms"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    color: "#d4af37",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Terms &amp; Conditions
                </a>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading && <span className="auth-spinner" />}
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          {/* Switch to login */}
          <p className="auth-switch-link" style={{ marginTop: "22px" }}>
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
