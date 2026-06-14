import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Calendar, Lock, LogOut } from "lucide-react";
import "./ProfilePage.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
    });
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setStatus("Profile updated successfully!");
    setTimeout(() => setStatus(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-layout">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-avatar">{user.fullName?.charAt(0)}</div>
          <h3>{user.fullName}</h3>
          <p className="profile-role">{user.role}</p>

          <nav className="profile-nav">
            <button
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => setActiveTab("profile")}
            >
              <User size={16} /> My Profile
            </button>
            <button
              className={activeTab === "bookings" ? "active" : ""}
              onClick={() => navigate("/my-bookings")}
            >
              <Calendar size={16} /> My Bookings
            </button>
            <button
              className={activeTab === "password" ? "active" : ""}
              onClick={() => setActiveTab("password")}
            >
              <Lock size={16} /> Change Password
            </button>
            <button className="logout-nav" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="profile-content">
          {activeTab === "profile" && (
            <div className="content-card">
              <h2>My Profile</h2>
              {status && <p className="success-msg">{status}</p>}
              <form onSubmit={handleSave}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === "password" && (
            <div className="content-card">
              <h2>Change Password</h2>
              <form>
                <div className="form-group">
                  <label>Current Password</label>
                  <input type="password" />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input type="password" />
                </div>
                <button type="submit" className="btn-primary">
                  Update Password
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
