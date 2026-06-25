import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Eye, XCircle, X } from "lucide-react";
import { getUserBookings, cancelBooking } from "../services/api";
import "./MyBookingsPage.css";

const TABS = ["All", "Pending", "Confirmed", "Cancelled"];

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-PK", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const formatAmt = (n) =>
  n == null ? "—" : `Rs ${Number(n).toLocaleString("en-PK")}`;

const MyBookingsPage = () => {
  useEffect(() => { document.title = "My Bookings — Elegant Celebrations"; }, []);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) { navigate("/login"); return; }
    loadBookings(user.userID);
  }, [navigate]);

  const loadBookings = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserBookings(userId);
      setBookings((res.data || []).reverse());
    } catch {
      setError("Could not load your bookings. Please try again.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking(id);
      const user = JSON.parse(localStorage.getItem("user"));
      await loadBookings(user.userID);
      setSelectedBooking(null);
    } catch {
      alert("Failed to cancel booking. Please try again.");
    }
  };

  const getTimeSlot = (notes) => notes?.split(" | ")[0] || "—";
  const getSpecialRequests = (notes) => {
    if (!notes) return null;
    const parts = notes.split(" | ");
    return parts[1] || null;
  };

  const filteredBookings =
    activeTab === "All"
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  return (
    <div className="mybookings-page">
      <h1>My Bookings</h1>
      <p className="subtitle">Track and manage your reservations</p>

      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {tab !== "All" && !loading && (
              <span className="tab-count">
                {bookings.filter((b) => b.status === tab).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="bookings-error">
          <span>{error}</span>
          <button onClick={() => {
            const u = JSON.parse(localStorage.getItem("user"));
            if (u) loadBookings(u.userID);
          }}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="bookings-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="booking-card skeleton-card">
              <div className="skeleton-img" />
              <div className="skeleton-body">
                <div className="skeleton-line wide" />
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="empty-state">
          <Calendar size={64} color="#333" />
          <h2>{activeTab === "All" ? "No bookings yet" : `No ${activeTab.toLowerCase()} bookings`}</h2>
          <p>
            {activeTab === "All"
              ? "You haven't made any bookings yet."
              : "Try a different tab above."}
          </p>
          {activeTab === "All" && (
            <button className="btn-primary" onClick={() => navigate("/halls")}>
              Browse Halls
            </button>
          )}
        </div>
      ) : (
        <div className="bookings-list">
          {filteredBookings.map((b) => (
            <div key={b.bookingID} className="booking-card">
              <img
                src={b.hall?.imageURL || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200"}
                alt={b.hall?.name || "Hall"}
                className="booking-img"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200";
                }}
              />
              <div className="booking-info">
                <h3>{b.hall?.name || "Hall"}</h3>
                <p>📍 {b.hall?.location || "—"}</p>
                <p>📅 {formatDate(b.eventDate)} &nbsp;|&nbsp; 🕐 {getTimeSlot(b.specialNotes)}</p>
                <p>📦 {b.package?.name || "No Package"}</p>
              </div>
              <div className="booking-financials">
                <span className={`status-badge ${b.status?.toLowerCase()}`}>
                  {b.status === "Pending" ? "⏳" : b.status === "Confirmed" ? "✅" : "❌"} {b.status}
                </span>
                <p className="total-amt">{formatAmt(b.totalPrice)}</p>
                <p className="advance-amt">Advance: {formatAmt(Math.round((b.totalPrice ?? 0) * 0.3))}</p>
              </div>
              <div className="booking-actions">
                <button className="icon-btn" onClick={() => setSelectedBooking(b)}>
                  <Eye size={18} /> Details
                </button>
                {b.status === "Pending" && (
                  <button className="icon-btn cancel" onClick={() => handleCancelBooking(b.bookingID)}>
                    <XCircle size={18} /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── DETAIL MODAL ── */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedBooking(null)}>
              <X size={18} />
            </button>
            <h2>Booking #{selectedBooking.bookingID}</h2>
            <span className={`status-badge ${selectedBooking.status?.toLowerCase()}`}>
              {selectedBooking.status}
            </span>

            <div className="modal-grid">
              <div><strong>Hall</strong><span>{selectedBooking.hall?.name || "—"}</span></div>
              <div><strong>Location</strong><span>{selectedBooking.hall?.location || "—"}</span></div>
              <div><strong>Event Date</strong><span>{formatDate(selectedBooking.eventDate)}</span></div>
              <div><strong>Time Slot</strong><span>{getTimeSlot(selectedBooking.specialNotes)}</span></div>
              <div><strong>Event Type</strong><span>{selectedBooking.eventType || "—"}</span></div>
              <div><strong>Guests</strong><span>{selectedBooking.guestCount || "—"}</span></div>
              <div><strong>Package</strong><span>{selectedBooking.package?.name || "No Package"}</span></div>
              <div><strong>Payment Method</strong><span className="modal-highlight">{selectedBooking.paymentMethod || "—"}</span></div>
              <div><strong>Phone</strong><span>{selectedBooking.customerPhone || "—"}</span></div>
              <div><strong>CNIC</strong><span>{selectedBooking.cnic || selectedBooking.cNIC || selectedBooking.CNIC || "—"}</span></div>
              {selectedBooking.transactionRef && (
                <div><strong>Transaction Ref</strong><span>{selectedBooking.transactionRef}</span></div>
              )}
              <div><strong>Total Amount</strong><span className="modal-gold">{formatAmt(selectedBooking.totalPrice)}</span></div>
              <div><strong>Advance (30%)</strong><span className="modal-gold">{formatAmt(Math.round((selectedBooking.totalPrice ?? 0) * 0.3))}</span></div>
              <div><strong>Balance Due</strong><span>{formatAmt(Math.round((selectedBooking.totalPrice ?? 0) * 0.7))}</span></div>
            </div>

            {getSpecialRequests(selectedBooking.specialNotes) && (
              <div className="modal-special">
                <strong>Special Requests</strong>
                <p>{getSpecialRequests(selectedBooking.specialNotes)}</p>
              </div>
            )}

            {selectedBooking.receiptImage && (
              <div className="modal-receipt">
                <strong>Payment Receipt</strong>
                <img src={selectedBooking.receiptImage} alt="Receipt" className="receipt-img" />
              </div>
            )}

            <div className="modal-timeline">
              <h3>Booking Timeline</h3>
              <div className="timeline-item done">● Booking Submitted ✅</div>
              <div className={`timeline-item ${selectedBooking.status === "Pending" ? "active" : selectedBooking.status !== "Cancelled" ? "done" : ""}`}>
                ● Payment Verification {selectedBooking.status === "Pending" ? "⏳" : selectedBooking.status === "Confirmed" ? "✅" : "❌"}
              </div>
              <div className={`timeline-item ${selectedBooking.status === "Confirmed" ? "active" : ""}`}>
                ● Booking Confirmed {selectedBooking.status === "Confirmed" ? "✅" : "⬜"}
              </div>
              <div className="timeline-item">● Event Day ⬜</div>
            </div>

            {selectedBooking.status === "Pending" && (
              <button
                className="cancel-btn-modal"
                onClick={() => handleCancelBooking(selectedBooking.bookingID)}
              >
                <XCircle size={16} /> Cancel Booking
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
