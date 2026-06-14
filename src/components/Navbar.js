import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Calendar,
  User,
  Home,
  Building2,
  Package,
  Images,
  Info,
  Mail,
} from "lucide-react";
import "./Navbar.css";

const NAV_LINKS = [
  { to: "/", label: "Home", icon: <Home size={16} /> },
  { to: "/halls", label: "Halls", icon: <Building2 size={16} /> },
  { to: "/packages", label: "Packages", icon: <Package size={16} /> },
  { to: "/gallery", label: "Gallery", icon: <Images size={16} /> },
  { to: "/about", label: "About Us", icon: <Info size={16} /> },
  { to: "/contact", label: "Contact", icon: <Mail size={16} /> },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef(null);
  const toggleRef = useRef(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  /* ── scroll listener ── */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── close drawer on outside click ── */
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  /* ── lock body scroll when drawer is open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* ── close drawer on route change ── */
  const close = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    close();
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          {/* ── Logo ── */}
          <Link to="/" className="nav-logo" onClick={close}>
            <span className="logo-icon">💍</span>
            <span className="logo-text">Elegant Celebrations</span>
          </Link>

          {/* ── Desktop Links ── */}
          <div className="nav-links">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to}>
                {label}
              </Link>
            ))}
          </div>

          {/* ── Desktop Actions ── */}
          <div className="nav-actions">
            {user ? (
              <>
                <Link to="/my-bookings" className="nav-link-small">
                  <Calendar size={15} /> My Bookings
                </Link>
                <Link to="/profile" className="nav-link-small">
                  <User size={15} /> Profile
                </Link>
                <button className="nav-btn logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-btn">
                  Login
                </Link>
                <Link to="/halls" className="nav-btn register-btn">
                  Book Now
                </Link>
              </>
            )}
          </div>

          {/* ── Hamburger ── */}
          <button
            ref={toggleRef}
            className="nav-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer (separate from navbar flow) ── */}
      <div
        ref={drawerRef}
        className={`mobile-drawer ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-drawer-inner">
          {/* Nav Links */}
          <nav className="drawer-links">
            {NAV_LINKS.map(({ to, label, icon }) => (
              <Link key={to} to={to} onClick={close}>
                {icon}
                {label}
              </Link>
            ))}
          </nav>

          <div className="drawer-divider" />

          {/* Auth Actions */}
          <div className="drawer-actions">
            {user ? (
              <>
                <Link
                  to="/my-bookings"
                  className="nav-link-small"
                  onClick={close}
                >
                  <Calendar size={16} /> My Bookings
                </Link>
                <Link to="/profile" className="nav-link-small" onClick={close}>
                  <User size={16} /> Profile
                </Link>
                <button className="nav-btn logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-btn" onClick={close}>
                  Login
                </Link>
                <Link
                  to="/halls"
                  className="nav-btn register-btn"
                  onClick={close}
                >
                  Book Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
