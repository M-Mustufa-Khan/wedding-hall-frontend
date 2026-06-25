import React, { useState, useEffect } from "react";
import {
  Eye,
  CheckCircle,
  XCircle,
  RefreshCw,
  CalendarCheck,
  X,
} from "lucide-react";
import { getBookings, getHalls, updateBookingStatus } from "../../services/api";
import "./AdminBookings.css";

const STATUS_FILTERS = ["All", "Pending", "Confirmed", "Cancelled"];
const PAGE_SIZE = 10;

const AdminBookings = () => {
  useEffect(() => { document.title = "Bookings — Admin | Elegant Celebrations"; }, []);

  const [bookings, setBookings] = useState([]);
  const [halls, setHalls] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [bookingsRes, hallsRes] = await Promise.allSettled([
        getBookings(),
        getHalls(),
      ]);
      if (bookingsRes.status === "fulfilled") {
        setBookings(bookingsRes.value?.data || []);
      } else {
        setError("Could not load bookings. Please check your connection.");
        setBookings([]);
      }
      if (hallsRes.status === "fulfilled") {
        setHalls(hallsRes.value?.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const getHallName = (booking) =>
    booking?.hall?.name ||
    halls.find((h) => h.hallID === booking?.hallID)?.name ||
    "—";

  const getTimeSlot = (notes) => {
    if (!notes) return "—";
    return notes.split(" | ")[0] || "—";
  };

  const getSpecialRequests = (notes) => {
    if (!notes) return null;
    const parts = notes.split(" | ");
    return parts[1] || null;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (val) => {
    if (val == null) return "—";
    return "Rs " + Number(val).toLocaleString();
  };

  const shortId = (id) => {
    if (!id) return "—";
    return "#" + String(id).padStart(4, "0").toUpperCase();
  };

  const isNew = (createdAt) => {
    if (!createdAt) return false;
    return Date.now() - new Date(createdAt).getTime() < 24 * 60 * 60 * 1000;
  };

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateBookingStatus(id, status);
      const res = await getBookings();
      const fresh = res.data || [];
      setBookings(fresh);
      if (selectedBooking?.bookingID === id) {
        const updated = fresh.find((b) => b.bookingID === id);
        setSelectedBooking(updated || { ...selectedBooking, status });
      }
    } catch {
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings =
    statusFilter === "All"
      ? bookings
      : bookings.filter(
          (b) => (b.status || "").toLowerCase() === statusFilter.toLowerCase()
        );

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleBookings = filteredBookings.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const countFor = (f) =>
    bookings.filter(
      (b) => (b.status || "").toLowerCase() === f.toLowerCase()
    ).length;

  const totalAmount =
    selectedBooking?.totalPrice ?? selectedBooking?.totalAmount ?? 0;
  const advanceAmount = Math.round(totalAmount * 0.3);

  return (
    <div className="ab-page">
      {/* ── PAGE HEADER ── */}
      <div className="ab-header">
        <div className="ab-header-left">
          <h2 className="ab-title">Manage Bookings</h2>
          {!loading && (
            <span className="ab-count-chip">{bookings.length} total</span>
          )}
        </div>
        <button className="ab-refresh-btn" onClick={loadData} title="Refresh">
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* ── ERROR BANNER ── */}
      {error && (
        <div className="ab-error-banner">
          <span>{error}</span>
          <button className="ab-retry-btn" onClick={loadData}>
            <RefreshCw size={13} />
            Retry
          </button>
        </div>
      )}

      {/* ── FILTER PILLS ── */}
      <div className="ab-filter-row">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            className={`ab-pill${statusFilter === f ? " ab-pill--active" : ""}`}
            onClick={() => {
              setStatusFilter(f);
              setPage(1);
            }}
          >
            {f}
            {f !== "All" && !loading && (
              <span className="ab-pill-badge">{countFor(f)}</span>
            )}
            {f === "All" && !loading && (
              <span className="ab-pill-badge">{bookings.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── BOOKINGS TABLE ── */}
      <div className="ab-table-card">
        <div className="ab-table-scroll">
          <table className="ab-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Hall</th>
                <th>Booked On</th>
                <th>Event Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skel-${i}`} className="ab-skeleton-row">
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j}>
                        <div
                          className="ab-skeleton"
                          style={{ width: j === 0 ? "60px" : j === 7 ? "80px" : "100%" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredBookings.length === 0 && !error ? (
                <tr>
                  <td colSpan="8">
                    <div className="ab-empty">
                      <CalendarCheck size={44} className="ab-empty-icon" />
                      <p className="ab-empty-heading">
                        {statusFilter === "All"
                          ? "No bookings yet"
                          : `No ${statusFilter.toLowerCase()} bookings`}
                      </p>
                      <span className="ab-empty-hint">
                        {statusFilter === "All"
                          ? "New reservations will appear here once customers book."
                          : "Try selecting a different filter above."}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                visibleBookings.map((b) => (
                  <tr key={b.bookingID} className={`ab-table-row${isNew(b.createdAt) ? " ab-row--new" : ""}`}>
                    <td>
                      <div className="ab-id-cell">
                        <span className="ab-booking-id">{shortId(b.bookingID)}</span>
                        {isNew(b.createdAt) && <span className="ab-new-tag">NEW</span>}
                      </div>
                    </td>
                    <td className="ab-td-name">{b.user?.fullName || "—"}</td>
                    <td>{getHallName(b)}</td>
                    <td className="ab-td-date">{formatDate(b.createdAt)}</td>
                    <td>{formatDate(b.eventDate)}</td>
                    <td>{formatAmount(b.totalPrice ?? b.totalAmount)}</td>
                    <td>
                      <span className={`ab-badge ab-badge--${(b.status || "").toLowerCase()}`}>
                        <span className="ab-badge-dot" />
                        {b.status || "—"}
                      </span>
                    </td>
                    <td>
                      <div className="ab-actions">
                        <button
                          className="adm-btn adm-btn-view"
                          onClick={() => setSelectedBooking(b)}
                          title="View details"
                        >
                          <Eye size={14} />
                        </button>
                        {b.status === "Pending" && (
                          <>
                            <button
                              className="adm-btn adm-btn-approve"
                              disabled={updatingId === b.bookingID}
                              onClick={() =>
                                handleStatusUpdate(b.bookingID, "Confirmed")
                              }
                              title="Confirm booking"
                            >
                              <CheckCircle size={14} />
                            </button>
                            <button
                              className="adm-btn adm-btn-delete"
                              disabled={updatingId === b.bookingID}
                              onClick={() =>
                                handleStatusUpdate(b.bookingID, "Cancelled")
                              }
                              title="Cancel booking"
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

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="ab-pagination">
            <button
              className="ab-page-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
            >
              ‹ Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`ab-page-btn${safePage === p ? " ab-page-btn--active" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}

            <button
              className="ab-page-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
            >
              Next ›
            </button>
          </div>
        )}
      </div>

      {/* ── BOOKING DETAIL MODAL ── */}
      {selectedBooking && (
        <div
          className="ab-modal-overlay"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="ab-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              className="ab-modal-close"
              onClick={() => setSelectedBooking(null)}
              title="Close"
            >
              <X size={16} />
            </button>

            {/* Modal header */}
            <div className="ab-modal-header">
              <div className="ab-modal-title-row">
                <h2 className="ab-modal-title">
                  Booking {shortId(selectedBooking.bookingID)}
                </h2>
                <span
                  className={`ab-badge ab-badge--${(selectedBooking.status || "").toLowerCase()}`}
                >
                  <span className="ab-badge-dot" />
                  {selectedBooking.status || "—"}
                </span>
              </div>
              <p className="ab-modal-sub">Full reservation details</p>
            </div>

            {/* Gold divider */}
            <div className="ab-modal-divider" />

            {/* Info grid */}
            <div className="ab-modal-grid">
              {/* Customer section */}
              <div className="ab-modal-field">
                <span className="ab-modal-label">Customer Name</span>
                <span className="ab-modal-value">
                  {selectedBooking.user?.fullName || "—"}
                </span>
              </div>
              <div className="ab-modal-field">
                <span className="ab-modal-label">Email</span>
                <span className="ab-modal-value">
                  {selectedBooking.user?.email || "—"}
                </span>
              </div>
              <div className="ab-modal-field">
                <span className="ab-modal-label">Phone</span>
                <span className="ab-modal-value">
                  {selectedBooking.customerPhone ||
                    selectedBooking.CustomerPhone ||
                    selectedBooking.user?.phone ||
                    "—"}
                </span>
              </div>
              <div className="ab-modal-field">
                <span className="ab-modal-label">CNIC</span>
                <span className="ab-modal-value ab-monospace">
                  {selectedBooking.cnic ||
                    selectedBooking.cNIC ||
                    selectedBooking.CNIC ||
                    "—"}
                </span>
              </div>

              {/* Event section */}
              <div className="ab-modal-field">
                <span className="ab-modal-label">Hall Name</span>
                <span className="ab-modal-value">{getHallName(selectedBooking)}</span>
              </div>
              <div className="ab-modal-field">
                <span className="ab-modal-label">Event Date</span>
                <span className="ab-modal-value">
                  {formatDate(selectedBooking.eventDate)}
                </span>
              </div>
              <div className="ab-modal-field">
                <span className="ab-modal-label">Time Slot</span>
                <span className="ab-modal-value">
                  {getTimeSlot(selectedBooking.specialNotes)}
                </span>
              </div>
              <div className="ab-modal-field">
                <span className="ab-modal-label">Event Type</span>
                <span className="ab-modal-value">
                  {selectedBooking.eventType || "—"}
                </span>
              </div>

              {/* Booking details */}
              <div className="ab-modal-field">
                <span className="ab-modal-label">Guests</span>
                <span className="ab-modal-value">
                  {selectedBooking.guestCount || "—"}
                </span>
              </div>
              <div className="ab-modal-field">
                <span className="ab-modal-label">Package</span>
                <span className="ab-modal-value">
                  {selectedBooking.package?.name || "No Package"}
                </span>
              </div>
              <div className="ab-modal-field">
                <span className="ab-modal-label">Total Amount</span>
                <span className="ab-modal-value ab-modal-value--gold">
                  {formatAmount(totalAmount)}
                </span>
              </div>
              <div className="ab-modal-field">
                <span className="ab-modal-label">Advance (30%)</span>
                <span className="ab-modal-value ab-modal-value--gold">
                  {formatAmount(advanceAmount)}
                </span>
              </div>
              <div className="ab-modal-field">
                <span className="ab-modal-label">Payment Method</span>
                <span className="ab-modal-value">
                  {selectedBooking.paymentMethod ||
                    selectedBooking.PaymentMethod ||
                    "—"}
                </span>
              </div>

              {/* Special requests — full width */}
              {getSpecialRequests(selectedBooking.specialNotes) && (
                <div className="ab-modal-field ab-modal-field--full">
                  <span className="ab-modal-label">Special Requests</span>
                  <span className="ab-modal-value">
                    {getSpecialRequests(selectedBooking.specialNotes)}
                  </span>
                </div>
              )}
            </div>

            {/* Receipt image */}
            {selectedBooking.receiptImage && (
              <div className="ab-receipt">
                <p className="ab-receipt-label">Uploaded Payment Receipt</p>
                <img
                  src={selectedBooking.receiptImage}
                  alt="Payment Receipt"
                  className="ab-receipt-img"
                />
              </div>
            )}

            {/* Modal action buttons — only when Pending */}
            {selectedBooking.status === "Pending" && (
              <div className="ab-modal-actions">
                <button
                  className="ab-modal-btn ab-modal-btn--confirm"
                  disabled={updatingId === selectedBooking.bookingID}
                  onClick={() =>
                    handleStatusUpdate(selectedBooking.bookingID, "Confirmed")
                  }
                >
                  <CheckCircle size={15} />
                  {updatingId === selectedBooking.bookingID
                    ? "Updating…"
                    : "Confirm Booking"}
                </button>
                <button
                  className="ab-modal-btn ab-modal-btn--cancel"
                  disabled={updatingId === selectedBooking.bookingID}
                  onClick={() =>
                    handleStatusUpdate(selectedBooking.bookingID, "Cancelled")
                  }
                >
                  <XCircle size={15} />
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

export default AdminBookings;
