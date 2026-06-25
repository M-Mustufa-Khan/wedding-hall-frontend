import React, { useState, useEffect } from "react";
import {
  Building2,
  CalendarCheck,
  DollarSign,
  Clock,
  ArrowUpRight,
  Eye,
  CheckCircle,
  XCircle,
  X,
  RefreshCw,
} from "lucide-react";
import "./AdminDashboard.css";
import { getBookings, getHalls, updateBookingStatus } from "../../services/api";

const STATUS_FILTERS = ["All", "Pending", "Confirmed", "Cancelled"];

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatAmount = (amount) => {
  if (amount == null || isNaN(amount)) return "—";
  return `Rs ${Number(amount).toLocaleString("en-PK")}`;
};

const shortId = (id) => {
  if (!id) return "—";
  const str = String(id);
  return str.length > 8 ? `#${str.slice(-6).toUpperCase()}` : `#${str}`;
};

const StatusBadge = ({ status }) => {
  const s = (status || "").toLowerCase();
  const dotMap = {
    confirmed: "#4caf50",
    pending: "#f59e0b",
    cancelled: "#ef4444",
  };
  const dotColor = dotMap[s] || "rgba(170,165,155,0.5)";
  return (
    <span className={`status-badge status-${s}`}>
      <span className="badge-dot" style={{ background: dotColor }} />
      {status || "Unknown"}
    </span>
  );
};

const SkeletonRow = () => (
  <tr className="skeleton-row">
    {Array.from({ length: 7 }).map((_, i) => (
      <td key={i}>
        <div className="skeleton" style={{ width: `${55 + (i % 3) * 15}%` }} />
      </td>
    ))}
  </tr>
);

const VISIBLE_COUNT = 5;

const AdminDashboard = () => {
  useEffect(() => { document.title = "Dashboard — Admin | Elegant Celebrations"; }, []);

  const [bookings, setBookings] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [error, setError] = useState(null);
  const [hallsWarning, setHallsWarning] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setShowAll(false);
  }, [activeFilter]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setHallsWarning(false);
    try {
      const [bookingsRes, hallsRes] = await Promise.allSettled([
        getBookings(),
        getHalls(),
      ]);

      if (bookingsRes.status === "fulfilled") {
        setBookings((bookingsRes.value?.data || []).slice().reverse());
      } else {
        setError("Could not load bookings. Please refresh.");
      }

      if (hallsRes.status === "fulfilled") {
        setHalls(hallsRes.value?.data || []);
      } else {
        setHallsWarning(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const getHallName = (b) =>
    b?.hall?.name || halls.find((h) => h.hallID === b?.hallID)?.name || "—";

  const getTimeSlot = (notes) => {
    if (!notes) return "—";
    return notes.split(" | ")[0] || "—";
  };

  const getSpecialRequests = (notes) => {
    if (!notes) return null;
    const parts = notes.split(" | ");
    return parts[1] || null;
  };

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateBookingStatus(id, status);
      const fresh = (await getBookings()).data || [];
      const sorted = fresh.slice().reverse();
      setBookings(sorted);
      if (selectedBooking?.bookingID === id) {
        const updated = sorted.find((b) => b.bookingID === id);
        setSelectedBooking(updated || { ...selectedBooking, status });
      }
    } catch {
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalRevenue = bookings.reduce(
    (acc, b) => acc + (Number(b.totalAmount ?? b.totalPrice) || 0),
    0
  );
  const pendingCount = bookings.filter(
    (b) => (b.status || "").toLowerCase() === "pending"
  ).length;

  const filteredBookings =
    activeFilter === "All"
      ? bookings
      : bookings.filter(
          (b) =>
            (b.status || "").toLowerCase() === activeFilter.toLowerCase()
        );

  const visibleBookings = showAll
    ? filteredBookings
    : filteredBookings.slice(0, VISIBLE_COUNT);
  const hiddenCount = filteredBookings.length - visibleBookings.length;

  /* ── Status chip in header ── */
  const statusChipClass = loading
    ? "hdr-chip hdr-chip--loading"
    : error || hallsWarning
    ? "hdr-chip hdr-chip--warn"
    : "hdr-chip hdr-chip--ok";
  const statusChipText = loading
    ? "Loading…"
    : error || hallsWarning
    ? "⚠ Partial data"
    : "Up to date";

  return (
    <div className="dashboard">
      {/* ── Page header ── */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-subtitle">
            Manage bookings, halls, and revenue at a glance
          </p>
        </div>
        <div className="dash-header-right">
          <span className={statusChipClass}>{statusChipText}</span>
          <button
            className="hdr-refresh-btn"
            onClick={fetchData}
            disabled={loading}
            title="Refresh data"
          >
            <RefreshCw size={15} className={loading ? "spin" : ""} />
          </button>
        </div>
      </div>

      {/* ── Error banners ── */}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button className="retry-btn" onClick={fetchData}>
            Retry
          </button>
        </div>
      )}

      {hallsWarning && !error && (
        <div className="error-banner">
          <span>
            Could not load hall count — "Total halls" may be inaccurate.
          </span>
          <button className="retry-btn" onClick={fetchData}>
            Retry
          </button>
        </div>
      )}

      {/* ── Stats grid ── */}
      <div className="stats-grid">
        {/* Total Halls */}
        <div className="stat-card stat-card--blue">
          <div className="stat-icon ic-blue">
            <Building2 size={20} />
          </div>
          <div className="stat-body">
            <p className="stat-label">Total Halls</p>
            <h2 className="stat-value">
              {loading ? (
                <span className="skeleton skeleton-num" />
              ) : hallsWarning ? (
                "—"
              ) : (
                halls.length
              )}
            </h2>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="stat-card stat-card--gold">
          <div className="stat-icon ic-gold">
            <CalendarCheck size={20} />
          </div>
          <div className="stat-body">
            <p className="stat-label">Total Bookings</p>
            <h2 className="stat-value">
              {loading ? (
                <span className="skeleton skeleton-num" />
              ) : (
                bookings.length.toLocaleString()
              )}
            </h2>
          </div>
        </div>

        {/* Revenue */}
        <div className="stat-card stat-card--green">
          <div className="stat-icon ic-green">
            <DollarSign size={20} />
          </div>
          <div className="stat-body">
            <p className="stat-label">Revenue</p>
            <h2 className="stat-value stat-value--sm">
              {loading ? (
                <span className="skeleton skeleton-num" />
              ) : (
                formatAmount(totalRevenue)
              )}
            </h2>
          </div>
        </div>

        {/* Pending */}
        <div className="stat-card stat-card--amber">
          <div className="stat-icon ic-amber">
            <Clock size={20} />
          </div>
          <div className="stat-body">
            <p className="stat-label">Pending Approval</p>
            <h2 className="stat-value">
              {loading ? (
                <span className="skeleton skeleton-num" />
              ) : (
                pendingCount
              )}
            </h2>
            {!loading && pendingCount > 0 && (
              <p className="stat-alert-hint">Needs attention</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Bookings section card ── */}
      <div className="section-card">
        <div className="section-header">
          <h3 className="adash-section-title">
            {activeFilter === "All"
              ? "Recent Bookings"
              : `${activeFilter} Bookings`}
          </h3>

          <div className="filter-pills">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                className={`pill${activeFilter === f ? " pill--active" : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
                {f !== "All" && !loading && (
                  <span className="pill-count">
                    {
                      bookings.filter(
                        (b) =>
                          (b.status || "").toLowerCase() === f.toLowerCase()
                      ).length
                    }
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Hall</th>
                <th>Event Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              ) : visibleBookings.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <CalendarCheck size={28} />
                      </div>
                      <p className="empty-msg">
                        {activeFilter === "All"
                          ? "No bookings yet"
                          : `No ${activeFilter.toLowerCase()} bookings`}
                      </p>
                      <p className="empty-hint">
                        {activeFilter === "All"
                          ? "Bookings will appear here once customers make reservations."
                          : "Try a different filter above."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                visibleBookings.map((b, i) => (
                  <tr key={b.bookingID ?? b._id ?? b.id ?? `row-${i}`}>
                    <td className="cell-id">
                      {shortId(b.bookingID ?? b._id ?? b.id)}
                    </td>
                    <td className="cell-customer">
                      {b.user?.fullName || "—"}
                    </td>
                    <td>{getHallName(b)}</td>
                    <td>{formatDate(b.eventDate)}</td>
                    <td className="cell-amount">
                      {formatAmount(b.totalAmount ?? b.totalPrice)}
                    </td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                    <td>
                      <div className="adm-btns">
                        <button
                          className="adm-btn adm-btn-view"
                          title="View details"
                          onClick={() => setSelectedBooking(b)}
                        >
                          <Eye size={14} />
                        </button>
                        {b.status === "Pending" && (
                          <>
                            <button
                              className="adm-btn adm-btn-approve"
                              title="Confirm booking"
                              disabled={updatingId === b.bookingID}
                              onClick={() =>
                                handleStatusUpdate(b.bookingID, "Confirmed")
                              }
                            >
                              <CheckCircle size={14} />
                            </button>
                            <button
                              className="adm-btn adm-btn-delete"
                              title="Cancel booking"
                              disabled={updatingId === b.bookingID}
                              onClick={() =>
                                handleStatusUpdate(b.bookingID, "Cancelled")
                              }
                            >
                              <XCircle size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && hiddenCount > 0 && (
          <button className="show-more-btn" onClick={() => setShowAll(true)}>
            Show {hiddenCount} more <ArrowUpRight size={14} />
          </button>
        )}
      </div>

      {/* ── BOOKING DETAIL MODAL ── */}
      {selectedBooking && (
        <div
          className="dash-modal-overlay"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="dash-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="dash-modal-close"
              onClick={() => setSelectedBooking(null)}
              title="Close"
            >
              <X size={16} />
            </button>

            <div className="dash-modal-hdr">
              <h2 className="dash-modal-title">
                Booking {shortId(selectedBooking.bookingID)}
              </h2>
              <StatusBadge status={selectedBooking.status} />
            </div>
            <p className="dash-modal-sub">Booking details and management</p>
            <div className="dash-modal-divider" />

            <div className="dash-modal-grid">
              <div className="dm-field">
                <span className="dm-label">Customer</span>
                <span className="dm-val">
                  {selectedBooking.user?.fullName || "—"}
                </span>
              </div>
              <div className="dm-field">
                <span className="dm-label">Email</span>
                <span className="dm-val">
                  {selectedBooking.user?.email || "—"}
                </span>
              </div>
              <div className="dm-field">
                <span className="dm-label">Phone</span>
                <span className="dm-val">
                  {selectedBooking.customerPhone ||
                    selectedBooking.CustomerPhone ||
                    selectedBooking.user?.phone ||
                    "—"}
                </span>
              </div>
              <div className="dm-field">
                <span className="dm-label">CNIC</span>
                <span className="dm-val">
                  {selectedBooking.cnic ||
                    selectedBooking.cNIC ||
                    selectedBooking.CNIC ||
                    "—"}
                </span>
              </div>
              <div className="dm-field">
                <span className="dm-label">Hall</span>
                <span className="dm-val">{getHallName(selectedBooking)}</span>
              </div>
              <div className="dm-field">
                <span className="dm-label">Event Date</span>
                <span className="dm-val">
                  {formatDate(selectedBooking.eventDate)}
                </span>
              </div>
              <div className="dm-field">
                <span className="dm-label">Time Slot</span>
                <span className="dm-val">
                  {getTimeSlot(selectedBooking.specialNotes)}
                </span>
              </div>
              <div className="dm-field">
                <span className="dm-label">Event Type</span>
                <span className="dm-val">
                  {selectedBooking.eventType || "—"}
                </span>
              </div>
              <div className="dm-field">
                <span className="dm-label">Guests</span>
                <span className="dm-val">
                  {selectedBooking.guestCount || "—"}
                </span>
              </div>
              <div className="dm-field">
                <span className="dm-label">Package</span>
                <span className="dm-val">
                  {selectedBooking.package?.name || "No Package"}
                </span>
              </div>
              <div className="dm-field">
                <span className="dm-label">Total</span>
                <span className="dm-val dm-gold">
                  {formatAmount(
                    selectedBooking.totalPrice ?? selectedBooking.totalAmount
                  )}
                </span>
              </div>
              <div className="dm-field">
                <span className="dm-label">Advance (30%)</span>
                <span className="dm-val dm-gold">
                  {formatAmount(
                    Math.round(
                      (selectedBooking.totalPrice ??
                        selectedBooking.totalAmount ??
                        0) * 0.3
                    )
                  )}
                </span>
              </div>
              <div className="dm-field dm-full">
                <span className="dm-label">Payment</span>
                <span className="dm-val">
                  {selectedBooking.paymentMethod ||
                    selectedBooking.PaymentMethod ||
                    "—"}
                </span>
              </div>
              {getSpecialRequests(selectedBooking.specialNotes) && (
                <div className="dm-field dm-full">
                  <span className="dm-label">Special Requests</span>
                  <span className="dm-val">
                    {getSpecialRequests(selectedBooking.specialNotes)}
                  </span>
                </div>
              )}
            </div>

            {selectedBooking.receiptImage && (
              <div className="dash-receipt">
                <p className="dm-label">Payment Receipt</p>
                <img
                  src={selectedBooking.receiptImage}
                  alt="Receipt"
                  className="dash-receipt-img"
                />
              </div>
            )}

            {selectedBooking.status === "Pending" && (
              <div className="dash-modal-actions">
                <button
                  className="dash-btn-confirm"
                  disabled={updatingId === selectedBooking.bookingID}
                  onClick={() =>
                    handleStatusUpdate(selectedBooking.bookingID, "Confirmed")
                  }
                >
                  <CheckCircle size={16} />
                  {updatingId === selectedBooking.bookingID
                    ? "Updating…"
                    : "Confirm Booking"}
                </button>
                <button
                  className="dash-btn-cancel"
                  disabled={updatingId === selectedBooking.bookingID}
                  onClick={() =>
                    handleStatusUpdate(selectedBooking.bookingID, "Cancelled")
                  }
                >
                  <XCircle size={16} />
                  {updatingId === selectedBooking.bookingID
                    ? "Updating…"
                    : "Cancel Booking"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
