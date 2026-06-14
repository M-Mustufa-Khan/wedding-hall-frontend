import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Heart,
  Globe,
  Camera,
  MessageCircle,
} from "lucide-react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-glow"></div>

      <div className="footer-container">
        {/* Brand */}
        <div className="footer-section footer-brand">
          <h3>💍 Elegant Celebrations</h3>

          <p>
            Creating unforgettable wedding experiences with premium venues,
            luxury services, and seamless event planning across Pakistan.
          </p>

          <div className="footer-socials">
            <a href="#">
              <Globe size={18} />
            </a>

            <a href="#">
              <Camera size={18} />
            </a>

            <a href="#">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>

          <Link to="/">Home</Link>
          <Link to="/halls">Browse Halls</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* Account */}
        <div className="footer-section">
          <h4>Account</h4>

          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/my-bookings">My Bookings</Link>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h4>Contact Us</h4>

          <p>
            <Phone size={16} />
            +92 300 1234567
          </p>

          <p>
            <Mail size={16} />
            info@elegantcelebrations.com
          </p>

          <p>
            <MapPin size={16} />
            Karachi, Pakistan
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Elegant Celebrations. All Rights Reserved.</p>

        <span>
          Made with <Heart size={14} fill="currentColor" />
          &nbsp;for unforgettable celebrations
        </span>
      </div>
    </footer>
  );
};

export default Footer;
