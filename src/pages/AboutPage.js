import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Heart,
  Star,
  Award,
  Sparkles,
  Users,
  ChevronRight,
  Briefcase,
  MessageCircle,
  Mail,
} from "lucide-react";
import "./AboutPage.css";

/* ── Data arrays (preserved from original) ── */
const TIMELINE = [
  { year: "2010", text: "Founded with our first hall in Karachi" },
  { year: "2014", text: "Expanded to 10 locations across Pakistan" },
  { year: "2018", text: "Launched our online booking platform" },
  { year: "2022", text: "Served over 5,000 weddings nationwide" },
  { year: "2025", text: "Now operating 50+ premium halls in 20+ cities" },
];

const STATS = [
  { num: "500+", label: "Weddings Hosted" },
  { num: "50+", label: "Premium Venues" },
  { num: "10+", label: "Years of Excellence" },
  { num: "4.9★", label: "Average Rating" },
];

const TEAM = [
  {
    name: "Muhammad Mustufa Khan",
    role: "CEO & Founder",
    initials: "MK",
    bio: "15 years in luxury event management.",
    color: "#d4af37",
  },
  {
    name: "Abdul Hadi Aziz",
    role: "Head of Operations",
    initials: "AA",
    bio: "Ensures every event runs flawlessly.",
    color: "#c9a227",
  },
  {
    name: "Muhammad Hassan",
    role: "Lead Designer",
    initials: "MH",
    bio: "Crafts stunning event decor concepts.",
    color: "#b8941f",
  },
  {
    name: "Muhammad Wasif",
    role: "Customer Relations",
    initials: "MW",
    bio: "Dedicated to your happiness 24/7.",
    color: "#d4af37",
  },
];

const VALUES = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    desc: "Honest pricing, clear contracts, no hidden charges — ever.",
  },
  {
    icon: Heart,
    title: "Customer First",
    desc: "Your vision is our priority from day one to your big day.",
  },
  {
    icon: Star,
    title: "Excellence in Service",
    desc: "We settle for nothing less than a flawless experience.",
  },
  {
    icon: Award,
    title: "Attention to Detail",
    desc: "Every small detail is handled with obsessive care.",
  },
  {
    icon: Sparkles,
    title: "Timeless Elegance",
    desc: "Venues and decor that create memories that last forever.",
  },
  {
    icon: Users,
    title: "Community & Trust",
    desc: "Thousands of couples trust us with their most cherished day.",
  },
];

/* ── Component ── */
const AboutPage = () => {
  return (
    <div className="about-page">

      {/* ══════════════════════════════════════
          1. HERO
      ══════════════════════════════════════ */}
      <section className="page-hero about-hero-section">
        <div
          className="hero-bg"
          aria-hidden="true"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1478146059778-26028b07395a?w=1600)",
          }}
        />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-inner">
          <span className="hero-tag">✦ About Us</span>
          <h1 className="hero-h1">Our Story</h1>
          <p className="hero-sub">
            Creating timeless celebrations since 2010 — from intimate gatherings
            to grand weddings across Pakistan.
          </p>
          <nav className="hero-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} />
            <span>About</span>
          </nav>
        </div>
      </section>

      {/* ══════════════════════════════════════
          2. STORY SECTION
      ══════════════════════════════════════ */}
      <section className="about-story-section">
        <div className="about-container">
          <div className="story-grid">
            {/* Left — text */}
            <div className="story-text-col">
              <div className="story-gold-bar" />
              <h2 className="story-heading">
                We Turn Venues Into
                <span className="gold-shimmer"> Memories</span>
              </h2>
              <p className="story-para">
                Elegant Celebrations was founded with a simple belief — every
                couple deserves a wedding that feels magical, effortless, and
                uniquely theirs. From our first hall in Karachi to a nationwide
                network of premium venues, we have grown by putting our clients
                at the heart of everything we do.
              </p>
              <p className="story-para">
                Our team of passionate event professionals works tirelessly to
                ensure every celebration — from intimate gatherings to grand
                weddings — is executed flawlessly and filled with joy that lasts
                a lifetime.
              </p>
              <div className="story-pill">
                <Sparkles size={13} />
                Founded in 2010
              </div>
            </div>

            {/* Right — image mosaic */}
            <div className="story-image-col">
              <div className="story-mosaic">
                <div className="mosaic-accent-border" aria-hidden="true" />
                <img
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800"
                  alt="Elegant wedding hall"
                  className="mosaic-main-img"
                />
                <img
                  src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500"
                  alt="Wedding decor detail"
                  className="mosaic-sm-img mosaic-sm-top"
                />
                <img
                  src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=500"
                  alt="Celebration moment"
                  className="mosaic-sm-img mosaic-sm-bottom"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          3. STATS STRIP
      ══════════════════════════════════════ */}
      <section className="about-stats-section">
        <div className="about-container">
          <div className="stats-strip">
            {STATS.map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-number">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          4. OUR VALUES
      ══════════════════════════════════════ */}
      <section className="about-values-section">
        <div className="about-container">
          <span className="section-eyebrow">✦ What We Stand For</span>
          <h2 className="section-heading">Our Values</h2>
          <p className="section-sub">
            The principles that guide every event, every booking, and every
            interaction with our team.
          </p>
          <div className="values-grid">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="value-card">
                  <div className="value-icon-wrap">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <h3 className="value-title">{v.title}</h3>
                  <p className="value-desc">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          5. TEAM SECTION
      ══════════════════════════════════════ */}
      <section className="about-team-section">
        <div className="about-container">
          <span className="section-eyebrow">✦ The People</span>
          <h2 className="section-heading">Meet Our Team</h2>
          <p className="section-sub">
            Dedicated professionals who make every celebration unforgettable.
          </p>
          <div className="team-grid">
            {TEAM.map((m, i) => (
              <div key={i} className="team-card">
                <div
                  className="team-avatar"
                  style={{ background: `${m.color}22`, borderColor: `${m.color}44` }}
                >
                  <span className="team-initials" style={{ color: m.color }}>
                    {m.initials}
                  </span>
                </div>
                <h3 className="team-name">{m.name}</h3>
                <p className="team-role">{m.role}</p>
                <p className="team-bio">{m.bio}</p>
                <div className="team-socials">
                  <a href="#!" className="team-social-link" aria-label="LinkedIn">
                    <Briefcase size={15} />
                  </a>
                  <a href="#!" className="team-social-link" aria-label="Twitter">
                    <MessageCircle size={15} />
                  </a>
                  <a href="#!" className="team-social-link" aria-label="Email">
                    <Mail size={15} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          6. CTA SECTION
      ══════════════════════════════════════ */}
      <section className="about-cta-section">
        <div className="about-container">
          <div className="cta-card">
            <div className="cta-glow" aria-hidden="true" />
            <span className="section-eyebrow">✦ Begin Your Journey</span>
            <h2 className="cta-heading">Ready to Book Your Dream Hall?</h2>
            <p className="cta-sub">
              Join thousands of happy couples who celebrated the most important
              day of their lives with Elegant Celebrations.
            </p>
            <div className="cta-btn-row">
              <Link to="/booking" className="btn-cta-primary">
                Book Now
                <ChevronRight size={16} />
              </Link>
              <Link to="/halls" className="btn-cta-ghost">
                Browse Halls
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
