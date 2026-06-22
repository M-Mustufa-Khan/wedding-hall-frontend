import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Eye, XCircle } from "lucide-react";
import { getUserBookings, cancelBooking } from "../services/api";
import "./MyBookingsPage.css";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      navigate("/login");
      return;
    }
    loadBookings(user.userID);
  }, [navigate]);

  const loadBookings = async (userId) => {
    try {
      const res = await getUserBookings(userId);
      setBookings(res.data.reverse());
    } catch (err) {
      console.log("Failed to fetch bookings");
      setBookings([]);
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await cancelBooking(id);
        const user = JSON.parse(localStorage.getItem("user"));
        loadBookings(user.userID);
        setSelectedBooking(null);
      } catch (err) {
        alert("Failed to cancel booking");
      }
    }
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
        {["All", "Pending", "Confirmed", "Cancelled"].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="empty-state">
          <Calendar size={64} color="#333" />
          <h2>No bookings found</h2>
          <p>You haven't made any bookings yet.</p>
          <button className="btn-primary" onClick={() => navigate("/halls")}>
            Browse Halls
          </button>
        </div>
      ) : (
        <div className="bookings-list">
          {filteredBookings.map((b) => (
            <div key={b.bookingID} className="booking-card">
              <img
                src={
                  b.hall?.imageURL ||
                  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200"
                }
                alt={b.hall?.name}
                className="booking-img"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200";
                }}
              />
              <div className="booking-info">
                <h3>{b.hall?.name || "Hall"}</h3>
                <p>📍 {b.hall?.location}</p>
                <p>
                  📅 {new Date(b.eventDate).toLocaleDateString()} | 🕐{" "}
                  {b.specialNotes?.split(" | ")[0] || "N/A"}
                </p>
                <p>📦 {b.package?.name || "No Package"}</p>
              </div>
              <div className="booking-financials">
                <span className={`status-badge ${b.status?.toLowerCase()}`}>
                  {b.status === "Pending"
                    ? "⏳"
                    : b.status === "Confirmed"
                      ? "✅"
                      : "❌"}{" "}
                  {b.status}
                </span>
                <p className="total-amt">Rs {b.totalPrice?.toLocaleString()}</p>
              </div>
              <div className="booking-actions">
                <button
                  className="icon-btn"
                  onClick={() => setSelectedBooking(b)}
                >
                  <Eye size={18} /> Details
                </button>
                {b.status === "Pending" && (
                  <button
                    className="icon-btn cancel"
                    onClick={() => handleCancelBooking(b.bookingID)}
                  >
                    <XCircle size={18} /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedBooking(null)}
            >
              ✕
            </button>
            <h2>Booking Details</h2>
            <div className="modal-grid">
              <div>
                <strong>Booking ID:</strong> #{selectedBooking.bookingID}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <span
                  className={`status-badge ${selectedBooking.status?.toLowerCase()}`}
                >
                  {selectedBooking.status}
                </span>
              </div>
              <div>
                <strong>Hall:</strong> {selectedBooking.hall?.name}
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {new Date(selectedBooking.eventDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Time:</strong>{" "}
                {selectedBooking.specialNotes?.split(" | ")[0] || "N/A"}
              </div>
              <div>
                <strong>Guests:</strong> {selectedBooking.guestCount}
              </div>
              <div>
                <strong>Package:</strong>{" "}
                {selectedBooking.package?.name || "N/A"}
              </div>
              <div>
                <strong>Total:</strong> Rs{" "}
                {selectedBooking.totalPrice?.toLocaleString()}
              </div>
            </div>
            <div className="modal-timeline">
              <h3>Timeline</h3>
              <div className="timeline-item done">● Booking Submitted ✅</div>
              <div
                className={`timeline-item ${selectedBooking.status === "Pending" ? "active" : "done"}`}
              >
                ● Payment Verification{" "}
                {selectedBooking.status === "Pending" ? "⏳" : "✅"}
              </div>
              <div
                className={`timeline-item ${selectedBooking.status === "Confirmed" ? "active" : ""}`}
              >
                ● Booking Confirmed{" "}
                {selectedBooking.status === "Confirmed" ? "⏳" : "⬜"}
              </div>
              <div className="timeline-item">● Event Day ⬜</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
