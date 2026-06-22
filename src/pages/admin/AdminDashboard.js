import React, { useState, useEffect } from "react";
import {
  Building2,
  CalendarCheck,
  DollarSign,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import "./AdminDashboard.css";
import { getBookings, getHalls } from "../../services/api";

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
  return (
    <span className={`status-badge status-${s}`}>{status || "Unknown"}</span>
  );
};

const SkeletonRow = () => (
  <tr className="skeleton-row">
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i}>
        <div className="skeleton" />
      </td>
    ))}
  </tr>
);

const VISIBLE_COUNT = 5;

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [error, setError] = useState(null);
  const [hallsWarning, setHallsWarning] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
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
          console.error("Error fetching bookings:", bookingsRes.reason);
          setError("Could not load bookings. Please refresh.");
        }

        if (hallsRes.status === "fulfilled") {
          setHalls(hallsRes.value?.data || []);
        } else {
          console.warn("Could not load halls:", hallsRes.reason);
          // Bug fix: previously this failure was silent — "Total halls" would
          // just show 0 with no indication the request actually failed.
          setHallsWarning(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset "show all" whenever the filter changes, so switching tabs
  // doesn't leave you mid-way through a previous filter's expanded list.
  useEffect(() => {
    setShowAll(false);
  }, [activeFilter]);

  const totalRevenue = bookings.reduce(
    (acc, b) => acc + (Number(b.totalAmount) || 0),
    0,
  );
  const pendingCount = bookings.filter(
    (b) => (b.status || "").toLowerCase() === "pending",
  ).length;

  const filteredBookings =
    activeFilter === "All"
      ? bookings
      : bookings.filter(
          (b) => (b.status || "").toLowerCase() === activeFilter.toLowerCase(),
        );

  const visibleBookings = showAll
    ? filteredBookings
    : filteredBookings.slice(0, VISIBLE_COUNT);
  const hiddenCount = filteredBookings.length - visibleBookings.length;

  return (
    <div className="dashboard">
      {/* Page header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Venue Admin</h1>
          <p className="dash-subtitle">Hall booking overview</p>
        </div>
        <span className="last-updated">
          {loading ? "Loading…" : error ? "⚠ Partial data" : "Up to date"}
        </span>
      </div>

      {/* Error banner — bookings failed */}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Warning banner — halls failed (was previously silent) */}
      {hallsWarning && !error && (
        <div className="error-banner">
          <span>
            Could not load hall count — "Total halls" may be inaccurate.
          </span>
          <button
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon ic-blue">
            <Building2 size={20} />
          </div>
          <div className="stat-body">
            <p className="stat-label">Total halls</p>
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

        <div className="stat-card">
          <div className="stat-icon ic-gold">
            <CalendarCheck size={20} />
          </div>
          <div className="stat-body">
            <p className="stat-label">Total bookings</p>
            <h2 className="stat-value">
              {loading ? (
                <span className="skeleton skeleton-num" />
              ) : (
                bookings.length.toLocaleString()
              )}
            </h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon ic-green">
            <DollarSign size={20} />
          </div>
          <div className="stat-body">
            <p className="stat-label">Revenue</p>
            <h2 className="stat-value">
              {loading ? (
                <span className="skeleton skeleton-num" />
              ) : (
                formatAmount(totalRevenue)
              )}
            </h2>
          </div>
        </div>

        <div className="stat-card stat-card--alert">
          <div className="stat-icon ic-amber">
            <Clock size={20} />
          </div>
          <div className="stat-body">
            <p className="stat-label">Pending approval</p>
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

      {/* Recent bookings */}
      <div className="section-card">
        <div className="section-header">
          <h3 className="section-title">
            {activeFilter === "All"
              ? "Recent bookings"
              : `${activeFilter} bookings`}
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
                          (b.status || "").toLowerCase() === f.toLowerCase(),
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
                <th>Event date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : visibleBookings.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <CalendarCheck size={32} />
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
                // Bug fix: was falling back to Math.random() as a key, which
                // forces React to remount the row every render. Use index as
                // a stable last-resort fallback instead.
                visibleBookings.map((b, i) => (
                  <tr key={b._id ?? b.id ?? `row-${i}`}>
                    <td className="cell-id">{shortId(b._id ?? b.id)}</td>
                    <td className="cell-customer">{b.customerName || "—"}</td>
                    <td>{b.hallName || "—"}</td>
                    <td>{formatDate(b.eventDate)}</td>
                    <td className="cell-amount">
                      {formatAmount(b.totalAmount)}
                    </td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bug fix: filtering+slicing(5) previously had no way to see the
            rest of the filtered results — "Recent bookings" silently hid
            everything past index 5 with zero indication more existed. */}
        {!loading && hiddenCount > 0 && (
          <button className="show-more-btn" onClick={() => setShowAll(true)}>
            Show {hiddenCount} more <ArrowUpRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
