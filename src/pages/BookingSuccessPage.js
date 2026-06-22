import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Home, Calendar } from "lucide-react";
import "./BookingSuccessPage.css";

const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  // Bug fix: navigate() was being called directly in the render body when
  // booking was missing. Calling navigate() during render (not inside an
  // effect or event handler) can trigger "Cannot update a component while
  // rendering a different component" warnings/race conditions in React.
  useEffect(() => {
    if (!booking) navigate("/", { replace: true });
  }, [booking, navigate]);

  if (!booking) return null;

  const formattedDate = booking.eventDate
    ? new Date(booking.eventDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  // Bug fix: BookingPage.js's createBooking() returns data from the ASP.NET
  // API, which uses `bookingID` (matching AdminBookings.js's b.bookingID),
  // not `id`. This was always rendering "Booking ID: undefined".
  const displayId = booking.bookingID ?? booking.id ?? "—";

  // Bug fix: hallLocation, timeSlot, guests, packageName, paymentMethod,
  // and balanceDue were never actually passed through navigate() from
  // BookingPage.js — only hallName, hallImage, advancePaid, and
  // totalAmount were spread alongside the raw API response. Every other
  // field rendered blank or as literal "undefined". Now falls back
  // gracefully instead of showing broken text.
  const safe = (val, fallback = "—") =>
    val === undefined || val === null || val === "" ? fallback : val;

  const balanceDue =
    booking.balanceDue ??
    (booking.totalAmount && booking.advancePaid
      ? booking.totalAmount - booking.advancePaid
      : null);

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-animation">
          <CheckCircle size={88} />
        </div>

        <h1>Booking Confirmed!</h1>
        <p>Your hall has been successfully reserved. Details below.</p>

        <div className="booking-id-box">Booking ID: {displayId}</div>

        <div className="success-summary">
          <h3>Booking Summary</h3>

          <div className="summary-row">
            <span>🏛️ Hall</span>
            <span>{safe(booking.hallName)}</span>
          </div>
          <div className="summary-row">
            <span>📍 Location</span>
            <span>{safe(booking.hallLocation)}</span>
          </div>
          <div className="summary-row">
            <span>📅 Event Date</span>
            <span>{formattedDate}</span>
          </div>
          <div className="summary-row">
            <span>🕐 Time Slot</span>
            <span>{safe(booking.timeSlot)}</span>
          </div>
          <div className="summary-row">
            <span>👥 Guests</span>
            <span>{safe(booking.guestCount ?? booking.guests)}</span>
          </div>
          <div className="summary-row">
            <span>📦 Package</span>
            <span>{safe(booking.packageName, "No Package")}</span>
          </div>
          <div className="summary-row">
            <span>💳 Payment</span>
            <span>{safe(booking.paymentMethod)}</span>
          </div>
          <div className="summary-row highlight">
            <span>💰 Total Amount</span>
            <span>Rs {(booking.totalAmount ?? 0).toLocaleString()}</span>
          </div>
          <div className="summary-row green">
            <span>✅ Advance Paid</span>
            <span>Rs {(booking.advancePaid ?? 0).toLocaleString()}</span>
          </div>
          <div className="summary-row orange">
            <span>⏳ Balance Due</span>
            <span>
              {balanceDue != null ? `Rs ${balanceDue.toLocaleString()}` : "—"}
            </span>
          </div>
        </div>

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
