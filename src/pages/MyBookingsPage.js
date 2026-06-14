import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserBookings } from '../services/api';
import './MyBookingsPage.css';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await getUserBookings(user.userID);
      setBookings(res.data);
    } catch {
      setBookings([]);
    }
  };

  return (
    <div className="mybookings-page">
      <h1>My Bookings</h1>
      <p className="subtitle">Your booked venues and events</p>
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <h2>No bookings yet!</h2>
          <p>Start by browsing our amazing venues.</p>
          <button className="btn-primary" onClick={() => navigate('/halls')}>Browse Halls</button>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map(b => (
            <div key={b.bookingID} className="booking-card">
              <div className="booking-header">
                <h3>{b.hall?.name || 'Venue'}</h3>
                <span className={`status-badge ${b.status?.toLowerCase()}`}>{b.status}</span>
              </div>
              <div className="booking-details">
                <p>📅 Date: {new Date(b.eventDate).toLocaleDateString()}</p>
                <p>🎉 Type: {b.eventType}</p>
                <p>👥 Guests: {b.guestCount}</p>
                <p>💰 Total: Rs {b.totalPrice?.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;