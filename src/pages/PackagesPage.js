import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, MessageCircle } from "lucide-react";
import "./PackagesPage.css";

const PACKAGES = [
  {
    id: 1,
    name: "Basic",
    tagline: "Perfect for intimate gatherings",
    price: 80000,
    color: "#888",
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
    tagline: "Most popular choice for weddings",
    price: 150000,
    popular: true,
    color: "#d4af37",
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
    tagline: "The ultimate luxury experience",
    price: 280000,
    color: "#e8c97a",
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
    icon: "🍽️",
    name: "Catering",
    desc: "Per plate pricing",
    price: "Rs 1,500 / plate",
  },
  {
    icon: "📸",
    name: "Photography",
    desc: "Full event coverage",
    price: "Rs 25,000",
  },
  {
    icon: "🎥",
    name: "Videography",
    desc: "Cinematic highlights",
    price: "Rs 30,000",
  },
  {
    icon: "🎵",
    name: "DJ & Sound",
    desc: "Pro sound system + DJ",
    price: "Rs 20,000",
  },
  {
    icon: "🌸",
    name: "Decoration",
    desc: "Floral & theme setup",
    price: "Rs 35,000",
  },
  {
    icon: "🎂",
    name: "Wedding Cake",
    desc: "Custom 3-tier cake",
    price: "Rs 8,000",
  },
  {
    icon: "✨",
    name: "Fireworks",
    desc: "Indoor safe sparklers",
    price: "Rs 15,000",
  },
  {
    icon: "🚗",
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
        <Check size={16} />
      </span>
    );
  if (val === false)
    return (
      <span className="cell-no">
        <X size={16} />
      </span>
    );
  return <span className="cell-val">{val}</span>;
};

const PackagesPage = () => {
  const [billing, setBilling] = useState("event");

  return (
    <div className="packages-page">
      {/* Hero */}
      <div className="pkg-hero">
        <p className="section-tag">✦ Pricing</p>
        <h1>Our Packages</h1>
        <p className="pkg-hero-sub">
          Choose the perfect package for your special day
        </p>
        <div className="billing-toggle">
          <button
            className={billing === "day" ? "active" : ""}
            onClick={() => setBilling("day")}
          >
            Per Day
          </button>
          <button
            className={billing === "event" ? "active" : ""}
            onClick={() => setBilling("event")}
          >
            Per Event
          </button>
        </div>
      </div>

      {/* Package Cards */}
      <div className="pkg-container">
        <div className="pkg-cards">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`pkg-card ${pkg.popular ? "popular" : ""}`}
            >
              {pkg.popular && (
                <div className="popular-badge">⭐ Most Popular</div>
              )}
              <div className="pkg-card-header">
                <h2>{pkg.name}</h2>
                <p className="pkg-tagline">{pkg.tagline}</p>
                <div className="pkg-price">
                  <span className="price-amount">
                    Rs{" "}
                    {(billing === "day"
                      ? pkg.price * 0.6
                      : pkg.price
                    ).toLocaleString()}
                  </span>
                  <span className="price-per">
                    / {billing === "day" ? "day" : "event"}
                  </span>
                </div>
              </div>
              <ul className="pkg-features">
                {pkg.features.map((f, i) => (
                  <li key={i} className={f.included ? "included" : "excluded"}>
                    {f.included ? <Check size={15} /> : <X size={15} />}
                    {f.text}
                  </li>
                ))}
              </ul>
              <Link
                to="/halls"
                className={`pkg-btn ${pkg.popular ? "pkg-btn-gold" : ""}`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>

        {/* Custom Package */}
        <div className="custom-pkg-banner">
          <div>
            <h3>Need Something Custom?</h3>
            <p>
              Build your own package with exactly what you need — we'll match
              your budget.
            </p>
          </div>
          <Link to="/contact" className="btn-outline-gold">
            <MessageCircle size={18} /> Contact for Custom Package
          </Link>
        </div>

        {/* Add-ons */}
        <div className="addons-section">
          <p className="section-tag">✦ Extras</p>
          <h2 className="section-title">Optional Add-Ons</h2>
          <p className="section-subtitle">
            Enhance your event with these premium services
          </p>
          <div className="addons-grid">
            {ADDONS.map((a, i) => (
              <div key={i} className="addon-card">
                <div className="addon-icon">{a.icon}</div>
                <div className="addon-info">
                  <h4>{a.name}</h4>
                  <p>{a.desc}</p>
                </div>
                <div className="addon-price">{a.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="compare-section">
          <p className="section-tag">✦ Compare</p>
          <h2 className="section-title">Package Comparison</h2>
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Basic</th>
                  <th className="th-popular">Standard</th>
                  <th>Premium</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={i}>
                    <td className="feature-name">{row.feature}</td>
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
      </div>
    </div>
  );
};
export default PackagesPage;
