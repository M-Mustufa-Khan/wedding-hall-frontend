import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, ChevronDown, Send } from "lucide-react";
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

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("success");
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <p className="section-tag">✦ Contact</p>
        <h1>Get In Touch</h1>
        <p>We're here to help plan your perfect day</p>
      </div>

      <div className="contact-container">
        <div className="contact-layout">
          {/* LEFT: Info */}
          <div className="contact-info">
            <h2>Contact Information</h2>
            <p className="info-sub">
              Reach out to us anytime. We usually respond within 24 hours.
            </p>

            <div className="info-cards">
              <div className="info-card">
                <Phone size={20} />
                <div>
                  <h4>Phone</h4>
                  <a href="tel:+923182255708">+92 318 225 5708</a>
                </div>
              </div>
              <div className="info-card">
                <Mail size={20} />
                <div>
                  <h4>Email</h4>
                  <a href="mailto:info@elegantcelebrations.pk">
                    info@elegantcelebrations.pk
                  </a>
                </div>
              </div>
              <div className="info-card">
                <MapPin size={20} />
                <div>
                  <h4>Address</h4>
                  <p>Nazimabad No. 123, Karachi, Pakistan</p>
                </div>
              </div>
              <div className="info-card">
                <Clock size={20} />
                <div>
                  <h4>Working Hours</h4>
                  <p>
                    Mon-Sat: 9AM - 8PM
                    <br />
                    Sunday: 10AM - 6PM
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/923182255708"
              className="whatsapp-btn"
              target="_blank"
              rel="noreferrer"
            >
              💬 Chat on WhatsApp
            </a>
          </div>

          {/* RIGHT: Form */}
          <div className="contact-form-wrapper">
            {status === "success" ? (
              <div className="success-state">
                <div className="success-icon">✅</div>
                <h2>Message Sent!</h2>
                <p>We will get back to you within 24 hours.</p>
                <button
                  className="btn-primary"
                  onClick={() =>
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      subject: "General Inquiry",
                      message: "",
                    })
                  }
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <h2>Send Us a Message</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      required
                      value={form.name}
                      label="Full Name"
                      placeholder="Full Name"
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      label="Email"
                      placeholder="Email"
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      label="Phone"
                      placeholder="Phone"
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <select
                      value={form.subject}
                      placeholder="Subject"
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                    >
                      <option>General Inquiry</option>
                      <option>Hall Booking</option>
                      <option>Pricing Info</option>
                      <option>Complaint</option>
                    </select>
                  </div>
                </div>
                <div className="form-group full">
                  <label>Message</label>
                  <textarea
                    rows="5"
                    required
                    value={form.message}
                    label="Message"
                    placeholder="Your Message"
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary">
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <p className="section-tag" style={{ textAlign: "center" }}>
            ✦ FAQ
          </p>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`faq-item ${openFaq === i ? "open" : ""}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="faq-q">
                  <span>{faq.q}</span>
                  <ChevronDown size={20} className="faq-chevron" />
                </div>
                <div className="faq-a">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
