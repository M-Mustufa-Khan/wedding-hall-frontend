import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu, X, Calendar, User, Home, Building2, Package,
  Images, Info, Mail, Shield, LogOut, ChevronDown,
} from "lucide-react";
import "./Navbar.css";

const NAV_LINKS = [
  { to: "/",        label: "Home",     icon: <Home size={16} />,     exact: true },
  { to: "/halls",   label: "Halls",    icon: <Building2 size={16} /> },
  { to: "/packages",label: "Packages", icon: <Package size={16} />   },
  { to: "/gallery", label: "Gallery",  icon: <Images size={16} />    },
  { to: "/about",   label: "About Us", icon: <Info size={16} />      },
  { to: "/contact", label: "Contact",  icon: <Mail size={16} />      },
];

const Navbar = () => {
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const drawerRef   = useRef(null);
  const toggleRef   = useRef(null);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));

  const isActive = (to, exact) =>
    exact
      ? location.pathname === to
      : to !== "/" && location.pathname.startsWith(to);

  useEffect(() => {
    const onAuth = () => setUser(JSON.parse(localStorage.getItem("user") || "null"));
    window.addEventListener("auth-change", onAuth);
    return () => window.removeEventListener("auth-change", onAuth);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onOutside = (e) => {
      if (
        drawerRef.current && !drawerRef.current.contains(e.target) &&
        toggleRef.current && !toggleRef.current.contains(e.target)
      ) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [menuOpen]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const onOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
    close();
    setDropdownOpen(false);
    navigate("/");
  };

  const initials = user?.fullName?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">

          {/* ── Logo ── */}
          <Link to="/" className="nav-logo" onClick={close}>
            <span className="logo-ring">💍</span>
            <div className="logo-wordmark">
              <span className="logo-elegant">Elegant</span>
              <span className="logo-celebrations">Celebrations</span>
            </div>
          </Link>

          {/* ── Desktop Links ── */}
          <nav className="nav-links">
            {NAV_LINKS.map(({ to, label, exact }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link ${isActive(to, exact) ? "active" : ""}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Desktop Actions ── */}
          <div className="nav-actions">
            {user ? (
              <>
                <Link to="/my-bookings" className="nav-ghost-btn">
                  <Calendar size={15} />
                  <span>My Bookings</span>
                </Link>

                {/* Avatar dropdown */}
                <div className="nav-avatar-wrap" ref={dropdownRef}>
                  <button
                    className={`nav-avatar-btn ${dropdownOpen ? "open" : ""}`}
                    onClick={() => setDropdownOpen((p) => !p)}
                    aria-label="User menu"
                  >
                    <span className="nav-avatar-circle">{initials}</span>
                    <ChevronDown size={13} className="avatar-chevron" />
                  </button>

                  <div className={`nav-dropdown ${dropdownOpen ? "open" : ""}`}>
                    <div className="nav-dd-header">
                      <div className="nav-dd-avatar">{initials}</div>
                      <div>
                        <div className="nav-dd-name">{user.fullName}</div>
                        <div className="nav-dd-role">{user.role || "Member"}</div>
                      </div>
                    </div>
                    <div className="nav-dd-divider" />
                    <Link to="/profile" className="nav-dd-item" onClick={() => setDropdownOpen(false)}>
                      <User size={15} /> My Profile
                    </Link>
                    <Link to="/my-bookings" className="nav-dd-item" onClick={() => setDropdownOpen(false)}>
                      <Calendar size={15} /> My Bookings
                    </Link>
                    {user.role === "Admin" && (
                      <Link to="/admin" className="nav-dd-item nav-dd-admin" onClick={() => setDropdownOpen(false)}>
                        <Shield size={15} /> Admin Panel
                      </Link>
                    )}
                    <div className="nav-dd-divider" />
                    <button className="nav-dd-item nav-dd-logout" onClick={handleLogout}>
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-ghost-btn">Login</Link>
                <Link to="/halls" className="nav-cta-btn">Book Now</Link>
              </>
            )}
          </div>

          {/* ── Hamburger ── */}
          <button
            ref={toggleRef}
            className={`nav-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
        </div>
      </nav>

      {/* ── Backdrop ── */}
      <div className={`drawer-backdrop ${menuOpen ? "open" : ""}`} onClick={close} />

      {/* ── Mobile Drawer (right slide) ── */}
      <aside
        ref={drawerRef}
        className={`mobile-drawer ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        {/* Close button */}
        <button className="drawer-close" onClick={close} aria-label="Close">
          <X size={20} />
        </button>

        {/* User / Guest card */}
        {user ? (
          <div className="drawer-user-card">
            <div className="drawer-user-avatar">{initials}</div>
            <div className="drawer-user-info">
              <span className="drawer-user-name">{user.fullName}</span>
              <span className="drawer-user-role">{user.role || "Member"}</span>
            </div>
          </div>
        ) : (
          <div className="drawer-guest-card">
            <span className="drawer-guest-icon">💍</span>
            <span className="drawer-guest-label">Elegant Celebrations</span>
          </div>
        )}

        {/* Nav links */}
        <nav className="drawer-nav">
          {NAV_LINKS.map(({ to, label, icon, exact }) => (
            <Link
              key={to}
              to={to}
              className={`drawer-link ${isActive(to, exact) ? "active" : ""}`}
              onClick={close}
            >
              <span className="drawer-link-icon">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="drawer-sep" />

        {/* Auth actions */}
        <div className="drawer-auth">
          {user ? (
            <>
              <Link to="/my-bookings" className="drawer-util-link" onClick={close}>
                <Calendar size={15} /> My Bookings
              </Link>
              <Link to="/profile" className="drawer-util-link" onClick={close}>
                <User size={15} /> My Profile
              </Link>
              {user.role === "Admin" && (
                <Link to="/admin" className="drawer-util-link drawer-admin" onClick={close}>
                  <Shield size={15} /> Admin Panel
                </Link>
              )}
              <button className="drawer-logout" onClick={handleLogout}>
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <div className="drawer-cta-row">
              <Link to="/login" className="drawer-login" onClick={close}>Login</Link>
              <Link to="/halls" className="drawer-booknow" onClick={close}>Book Now</Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
