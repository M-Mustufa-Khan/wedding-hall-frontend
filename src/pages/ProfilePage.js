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
  MapPin,
  ShieldCheck,
  Camera,
  Mail,
  Phone,
  BookOpen,
} from "lucide-react";
import "./ProfilePage.css";

/* ─── Password strength helper ─── */
const getStrength = (pwd) => {
  if (!pwd) return { level: 0, label: "", cls: "" };
  if (pwd.length < 6) return { level: 1, label: "Weak", cls: "weak" };
  if (pwd.length < 10) return { level: 2, label: "Fair", cls: "fair" };
  return { level: 3, label: "Strong", cls: "strong" };
};

/* ─── Notification toggle row ─── */
const NotifRow = ({ label, desc, checked, onChange }) => (
  <div className="notif-row">
    <div className="notif-row-text">
      <span className="notif-label">{label}</span>
      {desc && <span className="notif-desc">{desc}</span>}
    </div>
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-slider" />
    </label>
  </div>
);

/* ─── Status banner ─── */
const StatusBanner = ({ status }) => {
  if (!status.msg) return null;
  return (
    <div className={status.type === "success" ? "status-banner success" : "status-banner error"}>
      {status.type === "success" ? <Check size={15} /> : <AlertCircle size={15} />}
      <span>{status.msg}</span>
    </div>
  );
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
const ProfilePage = () => {
  useEffect(() => { document.title = "My Profile — Elegant Celebrations"; }, []);

  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [activeTab, setActiveTab] = useState("profile");
  const [status, setStatus] = useState({ type: "", msg: "" });

  /* ── Profile form state ── */
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    bio: "",
  });

  /* ── Password form state ── */
  const [pwdData, setPwdData] = useState({ current: "", newPwd: "", confirm: "" });
  const [pwdError, setPwdError] = useState("");
  const strength = getStrength(pwdData.newPwd);

  /* ── Notification state ── */
  const NOTIF_DEFAULTS = {
    bookingConfirm: true,
    bookingReminder: true,
    paymentDue: true,
    promotions: false,
    newsletter: false,
    smsBooking: true,
    smsPayment: false,
  };
  const notifKey = `notifs_${user?.email || "guest"}`;
  const [notifs, setNotifs] = useState(() => {
    try {
      const saved = localStorage.getItem(notifKey);
      return saved ? { ...NOTIF_DEFAULTS, ...JSON.parse(saved) } : NOTIF_DEFAULTS;
    } catch {
      return NOTIF_DEFAULTS;
    }
  });

  /* ── Wishlist state ── */
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist") || "[]")
  );

  /* ── Bookings ── */
  const bookings = JSON.parse(localStorage.getItem("myBookings") || "[]");

  /* ── On mount / user change ── */
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      city: user.city || "",
      bio: user.bio || "",
    });
  }, [navigate, user]);

  /* ── Re-read wishlist when wishlist tab opens ── */
  useEffect(() => {
    if (activeTab === "wishlist") {
      setWishlist(JSON.parse(localStorage.getItem("wishlist") || "[]"));
    }
  }, [activeTab]);

  if (!user) return null;

  /* ── Helpers ── */
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
    if (!pwdData.current) { setPwdError("Current password is required."); return; }
    if (pwdData.newPwd.length < 6) { setPwdError("New password must be at least 6 characters."); return; }
    if (pwdData.newPwd !== pwdData.confirm) { setPwdError("Passwords do not match."); return; }
    setPwdData({ current: "", newPwd: "", confirm: "" });
    showStatus("success", "Password updated successfully!");
  };

  const handleRemoveWishlist = (hallID) => {
    const updated = wishlist.filter((h) => String(h.hallID) !== String(hallID));
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  const initials = user.fullName
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  /* ── Sidebar navigation items ── */
  const NAV = [
    { key: "profile",       icon: <User size={17} />,      label: "Profile" },
    { key: "bookings",      icon: <Calendar size={17} />,  label: "My Bookings", badge: bookings.length || null },
    { key: "wishlist",      icon: <Heart size={17} />,     label: "Wishlist",    badge: wishlist.length || null },
    { key: "security",      icon: <ShieldCheck size={17} />, label: "Security" },
    { key: "notifications", icon: <Bell size={17} />,      label: "Notifications" },
  ];

  /* ── Booking status badge helper ── */
  const statusBadge = (s) => {
    if (!s) return { label: "Unknown", cls: "badge-unknown" };
    const lower = s.toLowerCase();
    if (lower === "confirmed" || lower === "approved")
      return { label: "Confirmed", cls: "badge-confirmed" };
    if (lower === "pending")
      return { label: "Pending", cls: "badge-pending" };
    if (lower === "cancelled" || lower === "rejected")
      return { label: "Cancelled", cls: "badge-cancelled" };
    return { label: s, cls: "badge-unknown" };
  };

  /* ════════════════════════════════════
     RENDER
  ════════════════════════════════════ */
  return (
    <div className="profile-page">

      {/* ── Compact page header ── */}
      <header className="profile-header">
        <div className="profile-header-inner">
          <div className="profile-header-left">
            <span className="profile-header-tag">Account</span>
            <h1 className="profile-header-title">My Account</h1>
          </div>
          <div className="profile-header-greeting">
            <span className="greeting-wave">👋</span>
            <span>Welcome back, <strong>{user.fullName?.split(" ")[0] || "there"}</strong></span>
          </div>
        </div>
      </header>

      {/* ── Two-column layout ── */}
      <div className="profile-layout">

        {/* ════ LEFT SIDEBAR ════ */}
        <aside className="profile-sidebar">
          {/* Avatar + identity */}
          <div className="sidebar-identity">
            <div className="sidebar-avatar-wrap">
              <div className="sidebar-avatar">{initials}</div>
              <button className="sidebar-avatar-edit" title="Change photo">
                <Camera size={13} />
              </button>
            </div>
            <h3 className="sidebar-name">{user.fullName}</h3>
            <p className="sidebar-email">{user.email}</p>
            <span className="sidebar-role-badge">{user.role || "Member"}</span>
          </div>

          <div className="sidebar-divider" />

          {/* Navigation */}
          <nav className="sidebar-nav">
            {NAV.map(({ key, icon, label, badge }) => (
              <button
                key={key}
                className={`sidebar-nav-item${activeTab === key ? " active" : ""}`}
                onClick={() => setActiveTab(key)}
              >
                <span className="nav-icon">{icon}</span>
                <span className="nav-label">{label}</span>
                {badge ? <span className="nav-badge">{badge}</span> : null}
              </button>
            ))}
          </nav>

          <div className="sidebar-divider" />

          {/* Logout */}
          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </aside>

        {/* ════ RIGHT CONTENT ════ */}
        <main className="profile-content">

          {/* ══ PROFILE TAB ══ */}
          {activeTab === "profile" && (
            <div className="content-card">
              <div className="card-header">
                <div className="card-header-icon"><User size={18} /></div>
                <div>
                  <h2 className="card-title">Personal Information</h2>
                  <p className="card-subtitle">Update your profile details and preferences</p>
                </div>
              </div>

              <StatusBanner status={status} />

              <form onSubmit={handleSaveProfile}>
                {/* Photo upload area */}
                <div className="photo-upload-area">
                  <div className="photo-upload-avatar">{initials}</div>
                  <div className="photo-upload-text">
                    <p className="photo-upload-title">Profile Photo</p>
                    <p className="photo-upload-hint">JPG, PNG or GIF · max 2 MB</p>
                  </div>
                  <label className="photo-upload-btn">
                    <Camera size={15} />
                    <span>Upload Photo</span>
                    <input type="file" accept="image/*" style={{ display: "none" }} />
                  </label>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="fullName">
                      <User size={13} /> Full Name <span className="req">*</span>
                    </label>
                    <input
                      id="fullName"
                      value={formData.fullName}
                      placeholder="Your full name"
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <Mail size={13} /> Email Address <span className="req">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      placeholder="your@email.com"
                      readOnly
                      className="input-readonly"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      <Phone size={13} /> Phone Number
                    </label>
                    <input
                      id="phone"
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
                    <label htmlFor="city">
                      <MapPin size={13} /> City
                    </label>
                    <input
                      id="city"
                      value={formData.city}
                      placeholder="e.g. Lahore"
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label htmlFor="bio">
                      <BookOpen size={13} /> Bio
                    </label>
                    <textarea
                      id="bio"
                      value={formData.bio}
                      placeholder="Tell us a little about yourself..."
                      rows={3}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    <Check size={15} />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ══ BOOKINGS TAB ══ */}
          {activeTab === "bookings" && (
            <div className="content-card">
              <div className="card-header">
                <div className="card-header-icon"><Calendar size={18} /></div>
                <div>
                  <h2 className="card-title">My Bookings</h2>
                  <p className="card-subtitle">Track all your hall reservations</p>
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <Calendar size={48} strokeWidth={1} />
                  </div>
                  <h3>No bookings yet</h3>
                  <p>When you book a hall it will appear here. Browse our stunning venues to get started.</p>
                  <button className="btn-primary" onClick={() => navigate("/halls")}>
                    Browse Halls
                  </button>
                </div>
              ) : (
                <div className="bookings-list">
                  {bookings.map((b, i) => {
                    const badge = statusBadge(b.status);
                    return (
                      <div key={b.bookingId || i} className="booking-card">
                        <div className="booking-thumb">
                          <img
                            src={b.imageURL || b.hallImageURL || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200"}
                            alt={b.hallName || "Hall"}
                            onError={(e) =>
                              (e.target.src =
                                "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200")
                            }
                          />
                        </div>
                        <div className="booking-info">
                          <h4 className="booking-hall-name">{b.hallName || "Wedding Hall"}</h4>
                          <div className="booking-meta">
                            {b.bookingDate && (
                              <span className="booking-meta-item">
                                <Calendar size={13} />
                                {new Date(b.bookingDate).toLocaleDateString("en-PK", {
                                  day: "numeric", month: "short", year: "numeric",
                                })}
                              </span>
                            )}
                            {b.guestCount && (
                              <span className="booking-meta-item">
                                <User size={13} />
                                {b.guestCount} guests
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="booking-right">
                          <span className={`booking-badge ${badge.cls}`}>{badge.label}</span>
                          {b.totalAmount && (
                            <span className="booking-amount">
                              Rs {Number(b.totalAmount).toLocaleString()}
                            </span>
                          )}
                          <button
                            className="btn-ghost-sm"
                            onClick={() => navigate(`/my-bookings`)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══ WISHLIST TAB ══ */}
          {activeTab === "wishlist" && (
            <div className="content-card">
              <div className="card-header">
                <div className="card-header-icon"><Heart size={18} /></div>
                <div>
                  <h2 className="card-title">
                    Wishlist
                    {wishlist.length > 0 && (
                      <span className="card-title-count">{wishlist.length} saved</span>
                    )}
                  </h2>
                  <p className="card-subtitle">Halls you have saved for later</p>
                </div>
              </div>

              {wishlist.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <Heart size={48} strokeWidth={1} />
                  </div>
                  <h3>No halls saved yet</h3>
                  <p>Browse halls and click the heart icon to save your favourites here.</p>
                  <button className="btn-primary" onClick={() => navigate("/halls")}>
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
                        <button
                          className="wishlist-heart-remove"
                          onClick={() => handleRemoveWishlist(h.hallID)}
                          title="Remove from wishlist"
                        >
                          <Heart size={14} fill="currentColor" />
                        </button>
                      </div>
                      <div className="wishlist-card-body">
                        <h4 className="wishlist-name">{h.name}</h4>
                        {h.location && (
                          <p className="wishlist-location">
                            <MapPin size={12} /> {h.location}
                          </p>
                        )}
                        {h.pricePerDay && (
                          <p className="wishlist-price">
                            Rs {h.pricePerDay?.toLocaleString()}
                            <span className="wishlist-price-unit"> / day</span>
                          </p>
                        )}
                        <div className="wishlist-actions">
                          <button
                            className="btn-primary wishlist-book-btn"
                            onClick={() => navigate(`/halls/${h.hallID}`)}
                          >
                            Book Now
                          </button>
                          <button
                            className="wishlist-remove-btn"
                            onClick={() => handleRemoveWishlist(h.hallID)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ SECURITY TAB ══ */}
          {activeTab === "security" && (
            <div className="content-card">
              <div className="card-header">
                <div className="card-header-icon"><ShieldCheck size={18} /></div>
                <div>
                  <h2 className="card-title">Security</h2>
                  <p className="card-subtitle">Keep your account safe by updating your password</p>
                </div>
              </div>

              <StatusBanner status={status} />

              <form onSubmit={handleChangePassword} className="security-form">
                <div className="form-group">
                  <label htmlFor="currentPwd">
                    <Lock size={13} /> Current Password <span className="req">*</span>
                  </label>
                  <input
                    id="currentPwd"
                    type="password"
                    value={pwdData.current}
                    placeholder="Enter your current password"
                    onChange={(e) => setPwdData({ ...pwdData, current: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPwd">
                    <Lock size={13} /> New Password <span className="req">*</span>
                  </label>
                  <input
                    id="newPwd"
                    type="password"
                    value={pwdData.newPwd}
                    placeholder="At least 6 characters"
                    onChange={(e) => setPwdData({ ...pwdData, newPwd: e.target.value })}
                  />
                </div>

                {pwdData.newPwd && (
                  <div className="strength-wrap">
                    <div className="password-strength">
                      {[1, 2, 3].map((n) => (
                        <div
                          key={n}
                          className={`strength-bar ${n <= strength.level ? strength.cls : "inactive"}`}
                        />
                      ))}
                    </div>
                    <span className={`strength-label ${strength.cls}`}>{strength.label}</span>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="confirmPwd">
                    <Lock size={13} /> Confirm New Password <span className="req">*</span>
                  </label>
                  <input
                    id="confirmPwd"
                    type="password"
                    value={pwdData.confirm}
                    placeholder="Re-enter new password"
                    className={pwdData.confirm && pwdData.confirm !== pwdData.newPwd ? "input-error" : ""}
                    onChange={(e) => setPwdData({ ...pwdData, confirm: e.target.value })}
                  />
                  {pwdData.confirm && pwdData.confirm !== pwdData.newPwd && (
                    <span className="field-error-msg">Passwords do not match</span>
                  )}
                </div>

                {pwdError && (
                  <div className="status-banner error" style={{ marginBottom: 16 }}>
                    <AlertCircle size={15} /> <span>{pwdError}</span>
                  </div>
                )}

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    <Lock size={15} />
                    Update Password
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setPwdData({ current: "", newPwd: "", confirm: "" })}
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ══ NOTIFICATIONS TAB ══ */}
          {activeTab === "notifications" && (
            <div className="content-card">
              <div className="card-header">
                <div className="card-header-icon"><Bell size={18} /></div>
                <div>
                  <h2 className="card-title">Notification Preferences</h2>
                  <p className="card-subtitle">Choose how and when you hear from us</p>
                </div>
              </div>

              <StatusBanner status={status} />

              {/* Email notifications */}
              <div className="notif-section">
                <div className="notif-section-header">
                  <Mail size={15} />
                  <h4>Email Notifications</h4>
                </div>
                <NotifRow
                  label="Booking Confirmation"
                  desc="Receive an email whenever a booking is confirmed"
                  checked={notifs.bookingConfirm}
                  onChange={() => setNotifs((n) => ({ ...n, bookingConfirm: !n.bookingConfirm }))}
                />
                <NotifRow
                  label="Booking Reminder"
                  desc="1-day reminder before your scheduled event"
                  checked={notifs.bookingReminder}
                  onChange={() => setNotifs((n) => ({ ...n, bookingReminder: !n.bookingReminder }))}
                />
                <NotifRow
                  label="Payment Due Reminder"
                  desc="Alerts when a payment deadline is approaching"
                  checked={notifs.paymentDue}
                  onChange={() => setNotifs((n) => ({ ...n, paymentDue: !n.paymentDue }))}
                />
                <NotifRow
                  label="Promotional Offers"
                  desc="Exclusive deals and seasonal discounts"
                  checked={notifs.promotions}
                  onChange={() => setNotifs((n) => ({ ...n, promotions: !n.promotions }))}
                />
                <NotifRow
                  label="Newsletter"
                  desc="Monthly highlights, trends and venue news"
                  checked={notifs.newsletter}
                  onChange={() => setNotifs((n) => ({ ...n, newsletter: !n.newsletter }))}
                />
              </div>

              {/* SMS notifications */}
              <div className="notif-section">
                <div className="notif-section-header">
                  <Phone size={15} />
                  <h4>SMS Notifications</h4>
                </div>
                <NotifRow
                  label="Booking Updates"
                  desc="Status changes sent directly to your phone"
                  checked={notifs.smsBooking}
                  onChange={() => setNotifs((n) => ({ ...n, smsBooking: !n.smsBooking }))}
                />
                <NotifRow
                  label="Payment Alerts"
                  desc="Instant SMS when payment is received or due"
                  checked={notifs.smsPayment}
                  onChange={() => setNotifs((n) => ({ ...n, smsPayment: !n.smsPayment }))}
                />
              </div>

              <div className="form-actions">
                <button
                  className="btn-primary"
                  onClick={() => {
                    localStorage.setItem(notifKey, JSON.stringify(notifs));
                    showStatus("success", "Notification preferences saved!");
                  }}
                >
                  <Check size={15} />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
