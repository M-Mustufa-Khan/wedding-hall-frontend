import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Calendar } from 'lucide-react';
import './BookingSuccessPage.css';

const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) return navigate('/');

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-animation"><CheckCircle size={80} /></div>
        <h1>Booking Confirmed!</h1>
        <div className="booking-id-box">Booking ID: {booking.id}</div>
        <div className="success-summary">
          <p><strong>{booking.hallName}</strong></p>
          <p>📅 {new Date(booking.eventDate).toLocaleDateString()} | 🕐 {booking.timeSlot}</p>
          <p>Total: Rs {booking.totalAmount?.toLocaleString()}</p>
          <p>Advance Paid: <strong>Rs {booking.advancePaid?.toLocaleString()}</strong></p>
        </div>
        <div className="next-steps">
          <h3>What happens next?</h3>
          <ol>
            <li>We received your booking request</li>
            <li>Payment verification in progress</li>
            <li>Confirmation SMS/Email will be sent</li>
            <li>Enjoy your event! 🎉</li>
          </ol>
        </div>
        <div className="success-actions">
          <button className="btn-primary" onClick={() => navigate('/my-bookings')}><Calendar size={18}/> View My Bookings</button>
          <button className="btn-secondary" onClick={() => navigate('/')}><Home size={18}/> Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;