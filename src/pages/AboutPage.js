import React from "react";
import { Link } from "react-router-dom";
import { Heart, Shield, Star, Award } from "lucide-react";
import "./AboutPage.css";

const TIMELINE = [
  { year: "2010", text: "Founded with our first hall in Karachi" },
  { year: "2014", text: "Expanded to 10 locations across Pakistan" },
  { year: "2018", text: "Launched our online booking platform" },
  { year: "2022", text: "Served over 5,000 weddings nationwide" },
  { year: "2025", text: "Now operating 50+ premium halls in 20+ cities" },
];

const TEAM = [
  {
    name: "Muhammad Mustufa Khan",
    role: "CEO & Founder",
    emoji: "👨‍💼",
    bio: "15 years in luxury event management.",
  },
  {
    name: "Abdul Hadi Aziz",
    role: "Head of Operations",
    emoji: "👩‍💼",
    bio: "Ensures every event runs flawlessly.",
  },
  {
    name: "Muhammad Hassan",
    role: "Lead Designer",
    emoji: "👨‍🎨",
    bio: "Crafts stunning event decor concepts.",
  },
  {
    name: "Muhammad Wasif",
    role: "Customer Relations",
    emoji: "👩‍💻",
    bio: "Dedicated to your happiness 24/7.",
  },
];

const VALUES = [
  {
    icon: <Shield size={36} />,
    title: "Trust & Transparency",
    desc: "Honest pricing, clear contracts, no hidden charges.",
  },
  {
    icon: <Heart size={36} />,
    title: "Customer First",
    desc: "Your vision is our priority from day one.",
  },
  {
    icon: <Star size={36} />,
    title: "Excellence in Service",
    desc: "We settle for nothing less than perfect.",
  },
  {
    icon: <Award size={36} />,
    title: "Attention to Detail",
    desc: "Every small detail is handled with care.",
  },
];

const AboutPage = () => (
  <div className="about-page">
    {/* Hero */}
    <div className="about-hero">
      <p className="section-tag">✦ Our Story</p>
      <h1>About Elegant Celebrations</h1>
      <p>Creating beautiful memories since 2010</p>
    </div>

    <div className="about-container">
      {/* Story + Timeline */}
      <section className="story-section">
        <div className="story-images">
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600"
            alt="Hall 1"
            className="story-img-main"
          />
          <img
            src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400"
            alt="Hall 2"
            className="story-img-sm"
          />
          <img
            src="https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400"
            alt="Hall 3"
            className="story-img-sm"
          />
        </div>
        <div className="story-content">
          <h2>Our Story</h2>
          <p>
            Elegant Celebrations was founded with a simple belief — every couple
            deserves a wedding that feels magical, effortless, and uniquely
            theirs. From our first hall in Karachi to a nationwide network of
            premium venues, we have grown by putting our clients at the heart of
            everything we do.
          </p>
          <p>
            Our team of passionate event professionals works tirelessly to
            ensure every celebration — from intimate gatherings to grand
            weddings — is executed flawlessly and filled with joy.
          </p>
          <div className="timeline">
            {TIMELINE.map((t, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-year">{t.year}</div>
                <div className="timeline-dot" />
                <div className="timeline-text">{t.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        {[
          { num: "500+", label: "Premium Halls" },
          { num: "15,000+", label: "Happy Couples" },
          { num: "20+", label: "Cities" },
          { num: "4.9 ★", label: "Average Rating" },
        ].map((s, i) => (
          <div key={i} className="stat-box">
            <strong>{s.num}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </section>

      {/* Team */}
      <section className="team-section">
        <p className="section-tag" style={{ textAlign: "center" }}>
          ✦ People
        </p>
        <h2 className="section-title">Meet Our Team</h2>
        <div className="team-grid">
          {TEAM.map((m, i) => (
            <div key={i} className="team-card">
              <div className="team-avatar">{m.emoji}</div>
              <h3>{m.name}</h3>
              <p className="team-role">{m.role}</p>
              <p className="team-bio">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="values-section">
        <p className="section-tag" style={{ textAlign: "center" }}>
          ✦ What We Stand For
        </p>
        <h2 className="section-title">Our Values</h2>
        <div className="values-grid">
          {VALUES.map((v, i) => (
            <div key={i} className="value-card">
              <div className="value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2>Ready to Book Your Dream Hall?</h2>
        <p>Join thousands of happy couples who celebrated with us</p>
        <div className="cta-btns">
          <Link to="/halls" className="btn-gold">
            Browse Halls
          </Link>
          <Link to="/contact" className="btn-outline">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  </div>
);

export default AboutPage;
