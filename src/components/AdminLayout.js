import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || user.role !== "Admin") {
    return (
      <div className="admin-locked">
        <h2>🔒 Access Denied</h2>
        <p>You must be logged in as an Admin.</p>
        <button className="btn-primary" onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  const menuItems = [
    { path: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    {
      path: "/admin/halls",
      icon: <Building2 size={20} />,
      label: "Manage Halls",
    },
    {
      path: "/admin/bookings",
      icon: <CalendarCheck size={20} />,
      label: "Bookings",
    },
  ];

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <span className="logo-icon">💍</span>
          <h2>Admin Panel</h2>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon} <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <button
          className="sidebar-logout"
          onClick={() => {
            localStorage.clear();
            navigate("/");
            window.location.reload();
          }}
        >
          <LogOut size={20} /> <span>Logout</span>
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button className="topbar-menu" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <h3>
            {menuItems.find((m) => m.path === location.pathname)?.label ||
              "Dashboard"}
          </h3>
          <div className="topbar-user">👤 {user.fullName}</div>
        </header>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
