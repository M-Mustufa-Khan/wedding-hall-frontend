import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  Send,
  Camera,
  Globe,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import { sendContact } from "../services/api";
import "./ContactPage.css";

const FAQS = [
  {
    q: "How do I book a hall?",
    a: "Simply browse our halls, select your preferred venue, choose a package, and complete the 3-step booking process. You can also call us directly!",
  },
  {
    q: "What is the cancellation policy?",
    a: "Cancellations made 15+ days before the event get a 70% refund. Less than 15 days get a 50% refund. No refunds within 48 hours.",
  },
  {
    q: "Is advance payment required?",
    a: "Yes, a 30% advance payment is required to confirm your booking. The remaining balance is due on the event day.",
  },
  {
    q: "Can I visit the hall before booking?",
    a: "Absolutely! We encourage venue tours. You can book a tour from the homepage or contact us to schedule a visit.",
  },
  {
    q: "Do you offer catering services?",
    a: "Yes, our Standard and Premium packages include catering. We also offer custom catering add-ons for the Basic package.",
  },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "General Inquiry",
  message: "",
};

const ContactPage = () => {
  useEffect(() => { document.title = "Contact Us — Elegant Celebrations"; }, []);

  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState(""); // "" | "success" | "error"
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");
    try {
      await sendContact({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* ── HERO ── */}
      <section className="contact-page-hero">
        <div
          className="contact-hero-bg"
          aria-hidden="true"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600')",
          }}
        />
        <div className="contact-hero-overlay" aria-hidden="true" />
        <div className="contact-hero-inner">
          <span className="contact-hero-tag">✦ Contact</span>
          <h1 className="contact-hero-h1">Get In Touch</h1>
          <p className="contact-hero-sub">
            We're here to help plan your perfect celebration
          </p>
          <nav className="contact-hero-breadcrumb" aria-label="breadcrumb">
            <span>Home</span>
            <span className="bc-sep">›</span>
            <span className="bc-current">Contact</span>
          </nav>
        </div>
      </section>

      {/* ── CONTACT BODY ── */}
      <section className="contact-body-section">
        <div className="contact-container">
          <div className="contact-layout">

            {/* LEFT — info */}
            <div className="contact-info">
              <h2 className="info-heading">Contact Information</h2>
              <p className="info-sub">
                Reach out to us anytime. We usually respond within 24 hours.
              </p>

              <div className="info-cards">
                <div className="contact-info-card">
                  <div className="info-icon-sq">
                    <Phone size={16} />
                  </div>
                  <div className="info-text">
                    <span className="info-label">Phone</span>
                    <a href="tel:+923182255708" className="info-value">
                      +92 318 225 5708
                    </a>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="info-icon-sq">
                    <Mail size={16} />
                  </div>
                  <div className="info-text">
                    <span className="info-label">Email</span>
                    <a
                      href="mailto:info@elegantcelebrations.pk"
                      className="info-value"
                    >
                      info@elegantcelebrations.pk
                    </a>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="info-icon-sq">
                    <MapPin size={16} />
                  </div>
                  <div className="info-text">
                    <span className="info-label">Location</span>
                    <span className="info-value">
                      Nazimabad No. 123, Karachi, Pakistan
                    </span>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="info-icon-sq">
                    <Clock size={16} />
                  </div>
                  <div className="info-text">
                    <span className="info-label">Working Hours</span>
                    <span className="info-value">
                      Mon – Sat: 9 AM – 8 PM
                      <br />
                      Sunday: 10 AM – 6 PM
                    </span>
                  </div>
                </div>
              </div>

              {/* Social row */}
              <div className="social-icons-row">
                <a
                  href="https://wa.me/923182255708"
                  className="social-icon-btn whatsapp"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                >
                  💬
                </a>
                <a
                  href="https://instagram.com"
                  className="social-icon-btn"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <Camera size={17} />
                </a>
                <a
                  href="https://facebook.com"
                  className="social-icon-btn"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                >
                  <Globe size={17} />
                </a>
                <a
                  href="https://twitter.com"
                  className="social-icon-btn"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                >
                  <MessageCircle size={17} />
                </a>
              </div>

              {/* Google Maps embed */}
              <div className="map-embed">
                <iframe
                  title="Elegant Celebrations Location"
                  src="https://maps.google.com/maps?q=Nazimabad+Karachi+Pakistan&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* RIGHT — form */}
            <div className="contact-form-card">
              {status === "success" ? (
                <div className="success-state">
                  <div className="success-icon-wrap">
                    <CheckCircle size={40} color="#4ade80" />
                  </div>
                  <h2 className="success-heading">Message Sent!</h2>
                  <p className="success-sub">
                    Thank you for reaching out. We will get back to you within
                    24 hours.
                  </p>
                  <button
                    className="cta-btn"
                    onClick={() => {
                      setForm(EMPTY_FORM);
                      setStatus("");
                    }}
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form" noValidate>
                  <h2 className="form-heading">Send a Message</h2>

                  {status === "error" && (
                    <div className="form-error-banner">
                      Failed to send message. Please try again.
                    </div>
                  )}

                  <div className="form-grid-2col">
                    <div className="form-group">
                      <label htmlFor="cf-name">Full Name</label>
                      <input
                        id="cf-name"
                        type="text"
                        required
                        value={form.name}
                        placeholder="Your full name"
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="cf-email">Email Address</label>
                      <input
                        id="cf-email"
                        type="email"
                        required
                        value={form.email}
                        placeholder="you@example.com"
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="cf-phone">Phone Number</label>
                      <input
                        id="cf-phone"
                        type="tel"
                        value={form.phone}
                        placeholder="+92 300 000 0000"
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="cf-subject">Subject</label>
                      <div className="select-wrapper">
                        <select
                          id="cf-subject"
                          value={form.subject}
                          onChange={(e) =>
                            setForm({ ...form, subject: e.target.value })
                          }
                        >
                          <option>General Inquiry</option>
                          <option>Hall Booking</option>
                          <option>Pricing Info</option>
                          <option>Complaint</option>
                        </select>
                        <ChevronDown
                          size={15}
                          className="select-chevron"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="cf-message">Message</label>
                    <textarea
                      id="cf-message"
                      rows={5}
                      required
                      value={form.message}
                      placeholder="Tell us about your event or question..."
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="cta-btn submit-btn"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span className="btn-spinner" />
                    ) : (
                      <Send size={16} />
                    )}
                    {submitting ? "Sending…" : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq-section">
        <div className="contact-container">
          <div className="section-label-wrap">
            <span className="contact-section-tag-pill">✦ FAQ</span>
          </div>
          <h2 className="section-heading">Frequently Asked Questions</h2>
          <p className="contact-section-sub">
            Everything you need to know about booking with Elegant Celebrations.
          </p>

          <div className="faq-list">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`faq-item${openFaq === i ? " open" : ""}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="faq-q">
                  <span className="faq-q-text">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className="faq-chevron"
                    aria-hidden="true"
                  />
                </div>
                <div className="faq-a">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
