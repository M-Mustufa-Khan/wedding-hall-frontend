import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  Lock,
  LogOut,
  Bell,
  Heart,
  Check,
  AlertCircle,
  Trash2,
} from "lucide-react";
import "./ProfilePage.css";

const getStrength = (pwd) => {
  if (!pwd) return { level: 0, label: "", cls: "" };
  if (pwd.length < 6) return { level: 1, label: "Weak", cls: "weak" };
  if (pwd.length < 10) return { level: 2, label: "Fair", cls: "fair" };
  return { level: 3, label: "Strong", cls: "strong" };
};

const NotifRow = ({ label, checked, onChange }) => (
  <div className="notif-row">
    <span>{label}</span>
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-slider" />
    </label>
  </div>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const [activeTab, setActiveTab] = useState("profile");
  const [status, setStatus] = useState({ type: "", msg: "" });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [pwdData, setPwdData] = useState({
    current: "",
    newPwd: "",
    confirm: "",
  });
  const [pwdError, setPwdError] = useState("");
  const strength = getStrength(pwdData.newPwd);

  const [notifs, setNotifs] = useState({
    bookingConfirm: true,
    bookingReminder: true,
    paymentDue: true,
    promotions: false,
    newsletter: false,
    smsBooking: true,
    smsPayment: false,
  });

  // ── WISHLIST: use useState + sync with localStorage ──
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist") || "[]"),
  );

  const bookings = JSON.parse(localStorage.getItem("myBookings") || "[]");

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

  // ── Re-read wishlist from localStorage whenever wishlist tab is opened ──
  useEffect(() => {
    if (activeTab === "wishlist") {
      setWishlist(JSON.parse(localStorage.getItem("wishlist") || "[]"));
    }
  }, [activeTab]);

  if (!user) return null;

  const showStatus = (type, msg) => {
    setStatus({ type, msg });
    setTimeout(() => setStatus({ type: "", msg: "" }), 3500);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      showStatus("error", "Name and email are required.");
      return;
    }
    const updated = { ...user, ...formData };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
    showStatus("success", "Profile updated successfully!");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPwdError("");
    if (!pwdData.current) {
      setPwdError("Current password is required.");
      return;
    }
    if (pwdData.newPwd.length < 6) {
      setPwdError("New password must be at least 6 characters.");
      return;
    }
    if (pwdData.newPwd !== pwdData.confirm) {
      setPwdError("Passwords do not match.");
      return;
    }
    setPwdData({ current: "", newPwd: "", confirm: "" });
    showStatus("success", "Password updated successfully!");
  };

  // ── REMOVE from wishlist — updates both state AND localStorage ──
  const handleRemoveWishlist = (hallID) => {
    const updated = wishlist.filter((h) => String(h.hallID) !== String(hallID));
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  const initials = user.fullName?.charAt(0)?.toUpperCase() || "U";

  const NAV = [
    { key: "profile", icon: <User size={16} />, label: "My Profile" },
    {
      key: "bookings",
      icon: <Calendar size={16} />,
      label: `My Bookings${bookings.length ? ` (${bookings.length})` : ""}`,
    },
    {
      key: "wishlist",
      icon: <Heart size={16} />,
      label: `Wishlist${wishlist.length ? ` (${wishlist.length})` : ""}`,
    },
    { key: "password", icon: <Lock size={16} />, label: "Change Password" },
    { key: "notifications", icon: <Bell size={16} />, label: "Notifications" },
  ];

  return (
    <div className="profile-page">
      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-hero-inner">
          <div className="profile-hero-avatar">{initials}</div>
          <div className="profile-hero-text">
            <h1>{user.fullName}</h1>
            <p>{user.role || "Member"}</p>
          </div>
        </div>
      </div>

      <div className="profile-layout">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-avatar">{initials}</div>
          <h3>{user.fullName}</h3>
          <p className="profile-role">{user.role || "Member"}</p>
          <div className="sidebar-divider" />
          <nav className="profile-nav">
            {NAV.map(({ key, icon, label }) => (
              <button
                key={key}
                className={activeTab === key ? "active" : ""}
                onClick={() =>
                  key === "bookings"
                    ? navigate("/my-bookings")
                    : setActiveTab(key)
                }
              >
                {icon} {label}
              </button>
            ))}
            <button className="logout-nav" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="profile-content">
          {/* MY PROFILE */}
          {activeTab === "profile" && (
            <div className="content-card">
              <h2>My Profile</h2>
              {status.msg && (
                <div
                  className={
                    status.type === "success" ? "success-msg" : "error-banner"
                  }
                >
                  {status.type === "success" ? (
                    <Check size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  {status.msg}
                </div>
              )}
              <form onSubmit={handleSaveProfile}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      value={formData.fullName}
                      placeholder="Your full name"
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      placeholder="your@email.com"
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      value={formData.phone}
                      placeholder="03001234567"
                      maxLength={11}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value.replace(/\D/g, "").slice(0, 11),
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <input
                      value={user.role || "Member"}
                      disabled
                      style={{ opacity: 0.5, cursor: "not-allowed" }}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-save">
                    <Check size={16} /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* WISHLIST */}
          {activeTab === "wishlist" && (
            <div className="content-card">
              <h2>
                My Wishlist{" "}
                {wishlist.length > 0 && (
                  <span className="wishlist-count">
                    {wishlist.length} halls
                  </span>
                )}
              </h2>
              {wishlist.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🤍</div>
                  <h3>No halls saved yet</h3>
                  <p>
                    Browse halls and click the heart icon to save your
                    favourites here.
                  </p>
                  <button
                    className="btn-save"
                    onClick={() => navigate("/halls")}
                  >
                    Browse Halls
                  </button>
                </div>
              ) : (
                <div className="wishlist-grid">
                  {wishlist.map((h) => (
                    <div key={h.hallID} className="wishlist-card">
                      <div className="wishlist-img-wrap">
                        <img
                          src={h.imageURL}
                          alt={h.name}
                          onError={(e) =>
                            (e.target.src =
                              "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400")
                          }
                        />
                      </div>
                      <div className="wishlist-card-body">
                        <h4>{h.name}</h4>
                        <p className="wishlist-location">📍 {h.location}</p>
                        {h.pricePerDay && (
                          <p className="wishlist-price">
                            Rs {h.pricePerDay?.toLocaleString()} / day
                          </p>
                        )}
                        <div className="wishlist-actions">
                          <button
                            className="wishlist-view-btn"
                            onClick={() => navigate(`/halls/${h.hallID}`)}
                          >
                            View Hall
                          </button>
                          <button
                            className="wishlist-remove-btn"
                            onClick={() => handleRemoveWishlist(h.hallID)}
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CHANGE PASSWORD */}
          {activeTab === "password" && (
            <div className="content-card">
              <h2>Change Password</h2>
              {status.msg && (
                <div
                  className={
                    status.type === "success" ? "success-msg" : "error-banner"
                  }
                >
                  {status.type === "success" ? (
                    <Check size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  {status.msg}
                </div>
              )}
              <form onSubmit={handleChangePassword}>
                <div className="form-group" style={{ marginBottom: 18 }}>
                  <label>Current Password *</label>
                  <input
                    type="password"
                    value={pwdData.current}
                    placeholder="Enter current password"
                    onChange={(e) =>
                      setPwdData({ ...pwdData, current: e.target.value })
                    }
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 6 }}>
                  <label>New Password *</label>
                  <input
                    type="password"
                    value={pwdData.newPwd}
                    placeholder="At least 6 characters"
                    onChange={(e) =>
                      setPwdData({ ...pwdData, newPwd: e.target.value })
                    }
                  />
                </div>
                {pwdData.newPwd && (
                  <>
                    <div className="password-strength">
                      {[1, 2, 3].map((n) => (
                        <div
                          key={n}
                          className={`strength-bar ${n <= strength.level ? strength.cls : "inactive"}`}
                        />
                      ))}
                    </div>
                    <p
                      className={`strength-label ${strength.cls}`}
                      style={{ marginBottom: 18 }}
                    >
                      {strength.label}
                    </p>
                  </>
                )}
                <div className="form-group" style={{ marginBottom: 18 }}>
                  <label>Confirm New Password *</label>
                  <input
                    type="password"
                    value={pwdData.confirm}
                    placeholder="Re-enter new password"
                    className={
                      pwdData.confirm && pwdData.confirm !== pwdData.newPwd
                        ? "error"
                        : ""
                    }
                    onChange={(e) =>
                      setPwdData({ ...pwdData, confirm: e.target.value })
                    }
                  />
                  {pwdData.confirm && pwdData.confirm !== pwdData.newPwd && (
                    <span className="error-msg">Passwords do not match</span>
                  )}
                </div>
                {pwdError && (
                  <div className="error-banner" style={{ marginBottom: 16 }}>
                    <AlertCircle size={16} /> {pwdError}
                  </div>
                )}
                <div className="form-actions">
                  <button type="submit" className="btn-save">
                    <Lock size={16} /> Update Password
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() =>
                      setPwdData({ current: "", newPwd: "", confirm: "" })
                    }
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="content-card">
              <h2>Notification Settings</h2>
              <div className="notif-group">
                <h4>📧 Email Notifications</h4>
                <NotifRow
                  label="Booking Confirmation"
                  checked={notifs.bookingConfirm}
                  onChange={() =>
                    setNotifs((n) => ({
                      ...n,
                      bookingConfirm: !n.bookingConfirm,
                    }))
                  }
                />
                <NotifRow
                  label="Booking Reminder (1 day before)"
                  checked={notifs.bookingReminder}
                  onChange={() =>
                    setNotifs((n) => ({
                      ...n,
                      bookingReminder: !n.bookingReminder,
                    }))
                  }
                />
                <NotifRow
                  label="Payment Due Reminder"
                  checked={notifs.paymentDue}
                  onChange={() =>
                    setNotifs((n) => ({ ...n, paymentDue: !n.paymentDue }))
                  }
                />
                <NotifRow
                  label="Promotional Offers"
                  checked={notifs.promotions}
                  onChange={() =>
                    setNotifs((n) => ({ ...n, promotions: !n.promotions }))
                  }
                />
                <NotifRow
                  label="Newsletter"
                  checked={notifs.newsletter}
                  onChange={() =>
                    setNotifs((n) => ({ ...n, newsletter: !n.newsletter }))
                  }
                />
              </div>
              <div className="notif-group">
                <h4>📱 SMS Notifications</h4>
                <NotifRow
                  label="Booking Updates"
                  checked={notifs.smsBooking}
                  onChange={() =>
                    setNotifs((n) => ({ ...n, smsBooking: !n.smsBooking }))
                  }
                />
                <NotifRow
                  label="Payment Alerts"
                  checked={notifs.smsPayment}
                  onChange={() =>
                    setNotifs((n) => ({ ...n, smsPayment: !n.smsPayment }))
                  }
                />
              </div>
              <div className="form-actions">
                <button
                  className="btn-save"
                  onClick={() =>
                    showStatus("success", "Notification preferences saved!")
                  }
                >
                  <Check size={16} /> Save Preferences
                </button>
              </div>
              {status.msg && (
                <div className="success-msg" style={{ marginTop: 16 }}>
                  <Check size={16} /> {status.msg}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
