import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Lock,
} from "lucide-react";
import { getContacts } from "../services/api";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadMsgs, setUnreadMsgs] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    getContacts()
      .then((res) => setUnreadMsgs((res.data || []).filter((c) => !c.isRead).length))
      .catch(() => {});
  }, [location.pathname]); // re-check when navigating between admin pages

  if (!user || user.role !== "Admin") {
    return (
      <div className="admin-locked-wrap">
        <div className="admin-locked">
          <div className="locked-icon-wrap">
            <Lock size={38} />
          </div>
          <h2 className="locked-heading">Access Denied</h2>
          <p className="locked-sub">You must be logged in as an Admin to view this page.</p>
          <button className="locked-cta" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { path: "/admin",          icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/admin/halls",    icon: <Building2 size={20} />,       label: "Manage Halls" },
    { path: "/admin/bookings", icon: <CalendarCheck size={20} />,   label: "Bookings" },
    { path: "/admin/contacts", icon: <MessageSquare size={20} />,   label: "Messages", badge: unreadMsgs },
  ];

  const currentLabel = menuItems.find((m) => m.path === location.pathname)?.label || "Dashboard";

  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "A";

  return (
    <div className="admin-layout">
      {/* Overlay backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`admin-sidebar${sidebarOpen ? " open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-inner">
            <span className="sidebar-logo-ring">💍</span>
            <div className="sidebar-wordmark">
              <span className="wordmark-elegant">ELEGANT</span>
              <span className="wordmark-celebrations">Celebrations</span>
            </div>
          </div>
          <span className="sidebar-admin-chip">Admin Panel</span>
          {/* Close button — mobile only */}
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link${isActive ? " active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span className="sidebar-link-label">{item.label}</span>
                {item.badge > 0 && (
                  <span className="sidebar-badge">{item.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="sidebar-logout-wrap">
          <button
            className="sidebar-logout"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.dispatchEvent(new Event("auth-change"));
              navigate("/");
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              className="topbar-menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            <span className="topbar-title">{currentLabel}</span>
          </div>
          <div className="topbar-right">
            <div className="topbar-user">
              <div className="topbar-avatar">{initials}</div>
              <span className="topbar-name">{user.fullName}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
