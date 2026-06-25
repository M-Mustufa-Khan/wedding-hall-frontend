import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin, Phone, Mail, Heart,
  Camera, Globe, MessageCircle, ArrowUp,
} from "lucide-react";
import "./Footer.css";

const NAV_LINKS = [
  { to: "/",        label: "Home"         },
  { to: "/halls",   label: "Browse Halls" },
  { to: "/packages",label: "Packages"     },
  { to: "/gallery", label: "Gallery"      },
  { to: "/about",   label: "About Us"     },
  { to: "/contact", label: "Contact"      },
];

const ACCOUNT_LINKS = [
  { to: "/login",       label: "Login"       },
  { to: "/register",    label: "Register"    },
  { to: "/my-bookings", label: "My Bookings" },
  { to: "/profile",     label: "My Profile"  },
];

const SOCIALS = [
  { icon: <Camera        size={17} />, href: "#instagram", label: "Instagram" },
  { icon: <Globe         size={17} />, href: "#facebook",  label: "Facebook"  },
  { icon: <MessageCircle size={17} />, href: "#whatsapp",  label: "WhatsApp"  },
];

const scrollTop = (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const Footer = () => (
  <footer className="footer">
    {/* Top glow */}
    <div className="footer-glow" aria-hidden="true" />

    {/* Decorative top border line */}
    <div className="footer-top-line" aria-hidden="true">
      <span className="footer-top-ornament">💍</span>
    </div>

    <div className="footer-container">

      {/* ── Brand ── */}
      <div className="footer-brand">
        <Link to="/" className="footer-logo">
          <span className="footer-logo-ring">💍</span>
          <div className="footer-logo-wordmark">
            <span className="footer-logo-elegant">Elegant</span>
            <span className="footer-logo-celebrations">Celebrations</span>
          </div>
        </Link>

        <p className="footer-tagline">
          Creating unforgettable wedding experiences with premium venues,
          luxury services, and seamless event planning across Pakistan.
        </p>

        <div className="footer-divider-line" aria-hidden="true" />

        <div className="footer-socials">
          {SOCIALS.map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              onClick={(e) => e.preventDefault()}
              className="footer-social-btn"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>

      {/* ── Quick Links ── */}
      <div className="footer-col">
        <h4 className="footer-col-title">Explore</h4>
        <ul className="footer-link-list">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <Link to={to} className="footer-link">
                <span className="footer-link-dot" aria-hidden="true" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Account ── */}
      <div className="footer-col">
        <h4 className="footer-col-title">Account</h4>
        <ul className="footer-link-list">
          {ACCOUNT_LINKS.map(({ to, label }) => (
            <li key={to}>
              <Link to={to} className="footer-link">
                <span className="footer-link-dot" aria-hidden="true" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Contact ── */}
      <div className="footer-col">
        <h4 className="footer-col-title">Get in Touch</h4>
        <ul className="footer-contact-list">
          <li className="footer-contact-item">
            <span className="footer-contact-icon"><Phone size={15} /></span>
            <span>+92 300 1234567</span>
          </li>
          <li className="footer-contact-item">
            <span className="footer-contact-icon"><Mail size={15} /></span>
            <span>info@elegantcelebrations.com</span>
          </li>
          <li className="footer-contact-item">
            <span className="footer-contact-icon"><MapPin size={15} /></span>
            <span>North Nazimabad, Karachi, Pakistan</span>
          </li>
        </ul>

        <Link to="/contact" className="footer-contact-cta">
          Send a Message
        </Link>
      </div>
    </div>

    {/* ── Bottom bar ── */}
    <div className="footer-bottom-wrap">
      <div className="footer-bottom-inner">
        <p className="footer-copyright">
          © 2026 Elegant Celebrations. All rights reserved.
        </p>

        <span className="footer-heart-line">
          Made with <Heart size={13} fill="currentColor" className="footer-heart-icon" /> for unforgettable celebrations
        </span>

        <button className="footer-back-top" onClick={scrollTop} aria-label="Back to top">
          <ArrowUp size={15} />
        </button>
      </div>
    </div>
  </footer>
);

export default Footer;
