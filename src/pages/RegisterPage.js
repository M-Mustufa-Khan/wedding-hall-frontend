import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Phone, User } from "lucide-react";
import { register } from "../services/api";
import "./AuthPages.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");

  const getStrength = (pass) => {
    if (!pass) return { label: "", color: "#333", width: "0%" };
    if (pass.length < 6)
      return { label: "Weak", color: "#e53935", width: "25%" };
    if (pass.length < 8)
      return { label: "Fair", color: "#ffa500", width: "50%" };
    if (pass.length < 12)
      return { label: "Strong", color: "#2ed573", width: "75%" };
    return { label: "Very Strong", color: "#d4af37", width: "100%" };
  };
  const strength = getStrength(form.password);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again.",
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <h2>
            Your Dream Wedding,{" "}
            <span className="highlight">Our Perfect Venue</span>
          </h2>
          <div className="auth-features">
            <div className="auth-feature">✓ Easy Booking Process</div>
            <div className="auth-feature">✓ Secure Payments</div>
            <div className="auth-feature">✓ 24/7 Dedicated Support</div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-logo">💍 Elegant Celebrations</div>
          <h1>Create Account</h1>
          <p className="auth-subtitle">Start planning your perfect day</p>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleRegister}>
            <div className="input-icon-group">
              <User size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Full Name"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>
            <div className="input-icon-group">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="input-icon-group">
              <Phone size={18} className="input-icon" />
              <input
                type="tel"
                placeholder="Phone (+92 300 1234567)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="input-icon-group">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {form.password && (
              <div className="strength-bar-container">
                <div
                  className="strength-bar"
                  style={{ width: strength.width, background: strength.color }}
                ></div>
                <span
                  style={{
                    color: strength.color,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {strength.label}
                </span>
              </div>
            )}

            <label className="checkbox-label" style={{ marginTop: "16px" }}>
              <input type="checkbox" required /> I agree to the Terms &
              Conditions
            </label>

            <button type="submit" className="btn-primary auth-btn">
              Create Account
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
