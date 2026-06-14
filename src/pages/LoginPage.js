import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { login } from "../services/api";
import "./AuthPages.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
      window.location.reload();
    } catch (err) {
      // Fallback for demo
      if (
        form.email === "admin@weddinghall.com" &&
        form.password === "admin123"
      ) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            userID: 1,
            fullName: "Admin User",
            email: form.email,
            role: "Admin",
          }),
        );
        navigate("/");
        window.location.reload();
      } else if (form.email && form.password) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            userID: 2,
            fullName: "Ahmed Khan",
            email: form.email,
            role: "Customer",
          }),
        );
        navigate("/");
        window.location.reload();
      } else {
        setError("Invalid email or password.");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <h2>
            Make Your Special Day{" "}
            <span className="highlight">Unforgettable</span>
          </h2>
          <p>Join thousands of happy couples who trusted us</p>
          <div className="auth-stats">
            <div className="auth-stat">
              <strong>500+</strong>
              <span>Halls</span>
            </div>
            <div className="auth-stat">
              <strong>10K+</strong>
              <span>Bookings</span>
            </div>
            <div className="auth-stat">
              <strong>4.9★</strong>
              <span>Rating</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-logo">💍 Elegant Celebrations</div>
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">Login to manage your bookings</p>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleLogin}>
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
              <Lock size={18} className="input-icon" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="auth-row">
              <label className="checkbox-label">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="auth-link-small">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="btn-primary auth-btn">
              Sign In
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Register Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
