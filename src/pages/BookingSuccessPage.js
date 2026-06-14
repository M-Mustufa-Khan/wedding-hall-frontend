import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Home, Calendar } from "lucide-react";
import "./BookingSuccessPage.css";

const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    navigate("/");
    return null;
  }

  const formattedDate = booking.eventDate
    ? new Date(booking.eventDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="success-page">
      <div className="success-container">
        {/* ── Animated Checkmark ── */}
        <div className="success-animation">
          <CheckCircle size={88} />
        </div>

        <h1>Booking Confirmed!</h1>
        <p>Your hall has been successfully reserved. Details below.</p>

        {/* ── Booking ID ── */}
        <div className="booking-id-box">Booking ID: {booking.id}</div>

        {/* ── Summary Card ── */}
        <div className="success-summary">
          <h3>Booking Summary</h3>

          <div className="summary-row">
            <span>🏛️ Hall</span>
            <span>{booking.hallName}</span>
          </div>
          <div className="summary-row">
            <span>📍 Location</span>
            <span>{booking.hallLocation}</span>
          </div>
          <div className="summary-row">
            <span>📅 Event Date</span>
            <span>{formattedDate}</span>
          </div>
          <div className="summary-row">
            <span>🕐 Time Slot</span>
            <span>{booking.timeSlot}</span>
          </div>
          <div className="summary-row">
            <span>👥 Guests</span>
            <span>{booking.guests}</span>
          </div>
          <div className="summary-row">
            <span>📦 Package</span>
            <span>{booking.packageName}</span>
          </div>
          <div className="summary-row">
            <span>💳 Payment</span>
            <span>{booking.paymentMethod}</span>
          </div>
          <div className="summary-row highlight">
            <span>💰 Total Amount</span>
            <span>Rs {booking.totalAmount?.toLocaleString()}</span>
          </div>
          <div className="summary-row green">
            <span>✅ Advance Paid</span>
            <span>Rs {booking.advancePaid?.toLocaleString()}</span>
          </div>
          <div className="summary-row orange">
            <span>⏳ Balance Due</span>
            <span>Rs {booking.balanceDue?.toLocaleString()}</span>
          </div>
        </div>

        {/* ── Next Steps ── */}
        <div className="next-steps">
          <h3>What happens next?</h3>
          <ol>
            <li>
              We have received your booking request and it is under review.
            </li>
            <li>Your payment receipt is being verified by our team.</li>
            <li>A confirmation SMS and email will be sent within 24 hours.</li>
            <li>Show up and enjoy your special event! 🎉</li>
          </ol>
        </div>

        {/* ── Action Buttons ── */}
        <div className="success-actions">
          <button
            className="btn-primary"
            onClick={() => navigate("/my-bookings")}
          >
            <Calendar size={18} /> View My Bookings
          </button>
          <button className="btn-secondary" onClick={() => navigate("/")}>
            <Home size={18} /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
