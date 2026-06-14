import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>💒 WeddingHalls</h3>
          <p>Find and book the perfect venue for your special day.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <a href="/halls">Browse Halls</a>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>📞 +92 300 1234567</p>
          <p>📧 info@weddinghalls.com</p>
          <p>📍 Lahore, Pakistan</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 WeddingHalls. All rights reserved. | Final Year Project</p>
      </div>
    </footer>
  );
};

export default Footer;