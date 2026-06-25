import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  X,
  MessageCircle,
  ChevronRight,
  Home,
  Utensils,
  Camera,
  Video,
  Music2,
  Flower2,
  Cake,
  Sparkles,
  Car,
} from "lucide-react";
import "./PackagesPage.css";

const PACKAGES = [
  {
    id: 1,
    name: "Basic",
    tier: "Silver",
    icon: "✦",
    tagline: "Perfect for intimate gatherings",
    price: 80000,
    features: [
      { text: "Hall Only", included: true },
      { text: "Basic Seating", included: true },
      { text: "Basic Lighting", included: true },
      { text: "Up to 200 Guests", included: true },
      { text: "1 Day Booking", included: true },
      { text: "Decoration", included: false },
      { text: "Catering", included: false },
      { text: "DJ & Sound", included: false },
      { text: "Photography", included: false },
      { text: "Bridal Room", included: false },
      { text: "Valet Parking", included: false },
    ],
  },
  {
    id: 2,
    name: "Standard",
    tier: "Gold",
    icon: "💍",
    tagline: "Most popular choice for weddings",
    price: 150000,
    popular: true,
    features: [
      { text: "Hall + Full Setup", included: true },
      { text: "Premium Seating", included: true },
      { text: "Premium Lighting", included: true },
      { text: "Up to 500 Guests", included: true },
      { text: "1 Day Booking", included: true },
      { text: "Decoration", included: true },
      { text: "Catering (Veg Menu)", included: true },
      { text: "DJ & Sound", included: true },
      { text: "Photography", included: false },
      { text: "Bridal Room", included: true },
      { text: "Valet Parking", included: false },
    ],
  },
  {
    id: 3,
    name: "Premium",
    tier: "Platinum",
    icon: "👑",
    tagline: "The ultimate luxury experience",
    price: 280000,
    features: [
      { text: "Hall + Full Setup", included: true },
      { text: "Luxury Seating", included: true },
      { text: "Custom Lighting", included: true },
      { text: "Up to 1000 Guests", included: true },
      { text: "2 Day Booking", included: true },
      { text: "Custom Decoration", included: true },
      { text: "Full Catering Menu", included: true },
      { text: "DJ & Sound", included: true },
      { text: "Photography + Video", included: true },
      { text: "Bridal Suite", included: true },
      { text: "Valet Parking", included: true },
    ],
  },
];

const ADDONS = [
  {
    icon: Utensils,
    emoji: "🍽️",
    name: "Catering",
    desc: "Per plate pricing",
    price: "Rs 1,500 / plate",
  },
  {
    icon: Camera,
    emoji: "📸",
    name: "Photography",
    desc: "Full event coverage",
    price: "Rs 25,000",
  },
  {
    icon: Video,
    emoji: "🎥",
    name: "Videography",
    desc: "Cinematic highlights",
    price: "Rs 30,000",
  },
  {
    icon: Music2,
    emoji: "🎵",
    name: "DJ & Sound",
    desc: "Pro sound system + DJ",
    price: "Rs 20,000",
  },
  {
    icon: Flower2,
    emoji: "🌸",
    name: "Decoration",
    desc: "Floral & theme setup",
    price: "Rs 35,000",
  },
  {
    icon: Cake,
    emoji: "🎂",
    name: "Wedding Cake",
    desc: "Custom 3-tier cake",
    price: "Rs 8,000",
  },
  {
    icon: Sparkles,
    emoji: "✨",
    name: "Fireworks",
    desc: "Indoor safe sparklers",
    price: "Rs 15,000",
  },
  {
    icon: Car,
    emoji: "🚗",
    name: "Valet Parking",
    desc: "For up to 100 vehicles",
    price: "Rs 10,000",
  },
];

const COMPARE_ROWS = [
  { feature: "Hall Access", basic: true, standard: true, premium: true },
  { feature: "Guest Capacity", basic: "200", standard: "500", premium: "1000" },
  { feature: "Booking Days", basic: "1", standard: "1", premium: "2" },
  { feature: "Decoration", basic: false, standard: true, premium: true },
  { feature: "Catering", basic: false, standard: "Veg", premium: "Full" },
  { feature: "DJ & Sound", basic: false, standard: true, premium: true },
  { feature: "Photography", basic: false, standard: false, premium: true },
  { feature: "Videography", basic: false, standard: false, premium: true },
  { feature: "Bridal Room", basic: false, standard: true, premium: true },
  { feature: "Valet Parking", basic: false, standard: false, premium: true },
  { feature: "Fireworks", basic: false, standard: false, premium: true },
  { feature: "24/7 Coordination", basic: false, standard: true, premium: true },
];

const Cell = ({ val }) => {
  if (val === true)
    return (
      <span className="cell-yes">
        <Check size={15} />
      </span>
    );
  if (val === false)
    return (
      <span className="cell-no">
        <X size={15} />
      </span>
    );
  return <span className="cell-val">{val}</span>;
};

const PackagesPage = () => {
  const [billing, setBilling] = useState("event");

  return (
    <div className="packages-page">
      {/* ── Hero ── */}
      <section className="page-hero">
        <div
          className="hero-bg"
          aria-hidden="true"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&q=80')",
          }}
        />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-inner">
          <span className="hero-tag">✦ Our Packages</span>
          <h1 className="hero-h1">Choose Your Perfect Package</h1>
          <p className="hero-sub">
            Transparent pricing crafted for every celebration — from intimate
            gatherings to grand affairs.
          </p>
          <nav className="hero-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">
              <Home size={13} />
              Home
            </Link>
            <ChevronRight size={13} />
            <span>Packages</span>
          </nav>
        </div>
      </section>

      {/* ── Billing toggle ── */}
      <div className="pkg-toggle-row">
        <div className="billing-toggle">
          <button
            className={billing === "event" ? "active" : ""}
            onClick={() => setBilling("event")}
          >
            Per Event
          </button>
          <button
            className={billing === "day" ? "active" : ""}
            onClick={() => setBilling("day")}
          >
            Per Day
          </button>
        </div>
      </div>

      {/* ── Package Cards ── */}
      <section className="pkg-cards-section">
        <div className="pkg-container">
          <div className="section-heading-block">
            <h2 className="section-heading">Our Pricing Plans</h2>
            <p className="section-sub">
              Every package is designed to deliver an unforgettable experience
              for your special day.
            </p>
          </div>

          <div className="pkg-cards">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`pkg-card${pkg.popular ? " pkg-card--featured" : ""}`}
              >
                {pkg.popular && (
                  <div className="popular-badge">Most Popular</div>
                )}

                <div className="pkg-tier-icon">{pkg.icon}</div>
                <div className="pkg-tier-label">{pkg.tier}</div>
                <h3 className="pkg-name">{pkg.name}</h3>
                <p className="pkg-tagline">{pkg.tagline}</p>

                <div className="pkg-price-row">
                  <span className="pkg-price-amount">
                    Rs{" "}
                    {(billing === "day"
                      ? pkg.price * 0.6
                      : pkg.price
                    ).toLocaleString()}
                  </span>
                  <span className="pkg-price-per">
                    / {billing === "day" ? "day" : "event"}
                  </span>
                </div>

                <div className="pkg-divider" />

                <ul className="pkg-features">
                  {pkg.features.map((f, i) => (
                    <li
                      key={i}
                      className={`pkg-feature${f.included ? " pkg-feature--yes" : " pkg-feature--no"}`}
                    >
                      <span className="pkg-feature-icon">
                        {f.included ? <Check size={13} /> : <X size={13} />}
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/halls"
                  className={`pkg-cta${pkg.popular ? " pkg-cta--gold" : pkg.id === 3 ? " pkg-cta--premium" : " pkg-cta--ghost"}`}
                >
                  {pkg.popular ? "Get Started" : "Select Plan"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Custom Package Banner ── */}
      <div className="pkg-container">
        <div className="custom-pkg-banner">
          <div className="custom-pkg-text">
            <h3>Need Something Custom?</h3>
            <p>
              Build your own package with exactly what you need — we'll match
              your vision and your budget.
            </p>
          </div>
          <Link to="/contact" className="btn-outline-gold">
            <MessageCircle size={17} />
            Contact for Custom Package
          </Link>
        </div>
      </div>

      {/* ── Add-ons Section ── */}
      <section className="addons-section">
        <div className="pkg-container">
          <div className="section-heading-block">
            <span className="section-tag-pill">✦ Extras</span>
            <h2 className="section-heading">Optional Add-Ons</h2>
            <p className="section-sub">
              Enhance your celebration with these premium services — mix and
              match to create your dream event.
            </p>
          </div>

          <div className="addons-grid">
            {ADDONS.map((a, i) => {
              const IconComp = a.icon;
              return (
                <div key={i} className="addon-card">
                  <div className="addon-icon-wrap">
                    <IconComp size={20} />
                  </div>
                  <div className="addon-body">
                    <h4 className="addon-name">{a.name}</h4>
                    <p className="addon-desc">{a.desc}</p>
                  </div>
                  <div className="addon-price">{a.price}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="compare-section">
        <div className="pkg-container">
          <div className="section-heading-block">
            <span className="section-tag-pill">✦ Compare</span>
            <h2 className="section-heading">Package Comparison</h2>
            <p className="section-sub">
              See exactly what's included in each plan side by side.
            </p>
          </div>

          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th className="th-feature">Feature</th>
                  <th>Basic</th>
                  <th className="th-popular">Standard</th>
                  <th>Premium</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "row-even" : "row-odd"}>
                    <td className="td-feature">{row.feature}</td>
                    <td>
                      <Cell val={row.basic} />
                    </td>
                    <td className="td-popular">
                      <Cell val={row.standard} />
                    </td>
                    <td>
                      <Cell val={row.premium} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackagesPage;
