import React, { useState, useEffect } from "react";
import { Eye, CheckCircle, XCircle, Inbox, RefreshCw } from "lucide-react";
import { getBookings, updateBookingStatus } from "../../services/api";
import "./AdminBookings.css";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Bug fix: track which specific row/action is mid-request so we can
  // disable just that button instead of nothing, preventing double-clicks
  // that would fire updateBookingStatus twice for the same booking.
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBookings();
      setBookings((res.data || []).slice().reverse());
    } catch {
      // Bug fix: previously this silently set bookings to [], which looks
      // identical to "no bookings yet" — no way to tell a real failure
      // from an empty table.
      setError("Could not load bookings. Please check your connection.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateBookingStatus(id, status);
      const res = await getBookings();
      const fresh = (res.data || []).slice().reverse();
      setBookings(fresh);

      // Bug fix: previously patched selectedBooking with only
      // {...selectedBooking, status} — any other field changed server-side
      // wouldn't show. Now pulls the actual updated record from the fresh list.
      if (selectedBooking?.bookingID === id) {
        const updatedRecord = fresh.find((b) => b.bookingID === id);
        setSelectedBooking(updatedRecord || { ...selectedBooking, status });
      }
    } catch {
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="admin-bookings-page">
      <div className="page-header">
        <div>
          <h2>Bookings</h2>
          <p className="page-sub">
            {loading ? "Loading…" : `${bookings.length} total`}
          </p>
        </div>
      </div>

      {/* Error banner — previously failures were invisible */}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button className="retry-btn" onClick={loadBookings}>
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      )}

      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Hall</th>
              <th>Event Date</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Bug fix: no loading state previously — table just looked empty
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="skeleton-row">
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j}>
                      <div className="skeleton" />
                    </td>
                  ))}
                </tr>
              ))
            ) : bookings.length === 0 && !error ? (
              // Bug fix: no empty state previously
              <tr>
                <td colSpan="7">
                  <div className="empty-state">
                    <Inbox size={32} className="empty-icon" />
                    <p className="empty-msg">No bookings yet</p>
                    <span className="empty-hint">
                      New reservations will appear here.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.bookingID}>
                  <td>{b.bookingID}</td>
                  <td>{b.user?.fullName || "—"}</td>
                  <td>{b.hallName || "—"}</td>
                  <td>
                    {b.eventDate
                      ? new Date(b.eventDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>{b.paymentMethod || "—"}</td>
                  <td>
                    <span className={`status-badge ${b.status?.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="action-btns">
                    <button
                      className="icon-btn view"
                      onClick={() => {
                        console.log("Clicked Booking:", b);
                        setSelectedBooking(b);
                      }}
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>
                    {b.status === "Pending" && (
                      <>
                        <button
                          className="icon-btn approve"
                          disabled={updatingId === b.bookingID}
                          onClick={() =>
                            handleStatusUpdate(b.bookingID, "Confirmed")
                          }
                          title="Confirm booking"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          className="icon-btn reject"
                          disabled={updatingId === b.bookingID}
                          onClick={() =>
                            handleStatusUpdate(b.bookingID, "Cancelled")
                          }
                          title="Cancel booking"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL WITH RECEIPT */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div
            className="modal-content admin-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedBooking(null)}
            >
              ✕
            </button>
            <h2>Booking Details</h2>

            <div className="modal-grid">
              <div>
                <strong>Customer:</strong>{" "}
                {selectedBooking.user?.fullName || "—"}
              </div>
              <div>
                <strong>Email:</strong> {selectedBooking.user?.email || "—"}
              </div>
              {/* Bug fix: was reading selectedBooking.customerPhone, which doesn't
                  exist once phone moved under the user object like fullName/email did */}
              <div>
                <strong>Phone:</strong>{" "}
                {selectedBooking.user?.phone ||
                  selectedBooking.customerPhone ||
                  "—"}
              </div>
              <div>
                <strong>CNIC:</strong> {selectedBooking.cnic || "—"}
              </div>
              <div>
                <strong>Hall:</strong> {selectedBooking.hall?.name || "—"}
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {selectedBooking.eventDate
                  ? new Date(selectedBooking.eventDate).toLocaleDateString()
                  : "—"}
              </div>
              <div>
                <strong>Time:</strong> {selectedBooking.timeSlot || "—"}
              </div>
              <div>
                <strong>Guests:</strong>{" "}
                {selectedBooking.guestCount || selectedBooking.guests || "—"}
              </div>
              <div>
                <strong>Package:</strong> {selectedBooking.package?.name || "—"}
              </div>
              <div>
                <strong>Total:</strong> Rs{" "}
                {(selectedBooking.totalPrice || 0).toLocaleString()}
              </div>
              <div>
                <strong>Advance:</strong> Rs{" "}
                {Math.round(
                  (selectedBooking.totalPrice || 0) * 0.3,
                ).toLocaleString()}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <span
                  className={`status-badge ${selectedBooking.status?.toLowerCase()}`}
                >
                  {selectedBooking.status}
                </span>
              </div>
            </div>

            {selectedBooking.receiptImage && (
              <div className="receipt-section">
                <h3>📄 Uploaded Payment Receipt</h3>
                <img
                  src={selectedBooking.receiptImage}
                  alt="Receipt"
                  className="receipt-img"
                />
              </div>
            )}

            {selectedBooking.status === "Pending" && (
              <div className="modal-actions">
                <button
                  className="btn-primary"
                  disabled={updatingId === selectedBooking.bookingID}
                  onClick={() =>
                    handleStatusUpdate(selectedBooking.bookingID, "Confirmed")
                  }
                >
                  ✅{" "}
                  {updatingId === selectedBooking.bookingID
                    ? "Updating…"
                    : "Confirm Booking"}
                </button>
                <button
                  className="btn-secondary"
                  style={{ borderColor: "#e53935", color: "#e53935" }}
                  disabled={updatingId === selectedBooking.bookingID}
                  onClick={() =>
                    handleStatusUpdate(selectedBooking.bookingID, "Cancelled")
                  }
                >
                  ❌{" "}
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
