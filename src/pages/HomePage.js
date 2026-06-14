import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Crown,
  Users,
  Package,
  Headphones,
  Star,
} from "lucide-react";
import HallCard from "../components/HallCard";
import { getHalls } from "../services/api";
import "./HomePage.css";

/* ── All testimonial data ── */
const TESTIMONIALS = [
  {
    name: "Sarah Khan",
    location: "Karachi",
    avatar: "👩",
    rating: 5,
    text: "Best wedding hall experience! Everything was absolutely perfect. The staff went above and beyond to make our day special.",
  },
  {
    name: "Ahmed Ali",
    location: "Lahore",
    avatar: "👨",
    rating: 4,
    text: "Amazing decorations and the staff was so cooperative! The food was excellent and the lighting was breathtaking.",
  },
  {
    name: "Fatima Noor",
    location: "Islamabad",
    avatar: "👩",
    rating: 5,
    text: "They made our dream wedding come true. Absolutely stunning venue with world-class service from beginning to end.",
  },
  {
    name: "Usman Tariq",
    location: "Rawalpindi",
    avatar: "👨",
    rating: 5,
    text: "Booked the Grand Royal Hall for my daughter's wedding. Couldn't have asked for a better experience. Highly recommend!",
  },
  {
    name: "Ayesha Malik",
    location: "Faisalabad",
    avatar: "👩",
    rating: 5,
    text: "The online booking was so easy and the hall was even more beautiful in person. Our guests were truly impressed.",
  },
  {
    name: "Bilal Hassan",
    location: "Multan",
    avatar: "👨",
    rating: 4,
    text: "Professional team, stunning decor, and seamless coordination. Our walima was unforgettable thanks to Elegant Celebrations.",
  },
  {
    name: "Zara Sheikh",
    location: "Karachi",
    avatar: "👩",
    rating: 5,
    text: "From booking to the event day everything was flawless. The bridal room was gorgeous and the catering was superb!",
  },
  {
    name: "Hamza Raza",
    location: "Lahore",
    avatar: "👨",
    rating: 5,
    text: "Great value for money. The Premium package had everything we needed and the team handled every detail perfectly.",
  },
  {
    name: "Sana Butt",
    location: "Islamabad",
    avatar: "👩",
    rating: 4,
    text: "Wonderful experience! The hall ambiance, lighting, and service made our engagement ceremony truly magical.",
  },
  {
    name: "Danish Ahmed",
    location: "Peshawar",
    avatar: "👨",
    rating: 5,
    text: "I was nervous about planning from abroad but the team handled everything remotely. Exceeded all our expectations!",
  },
];

/* Split into two rows for the two-track animation */
const ROW_ONE = [...TESTIMONIALS.slice(0, 5), ...TESTIMONIALS.slice(0, 5)]; // duplicated for infinite loop
const ROW_TWO = [...TESTIMONIALS.slice(5), ...TESTIMONIALS.slice(5)];

/* Star rating renderer */
const Stars = ({ count }) => (
  <div className="stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={15}
        fill={i < count ? "#d4af37" : "none"}
        stroke={i < count ? "#d4af37" : "#444"}
      />
    ))}
  </div>
);

/* Single testimonial card */
const TestCard = ({ t }) => (
  <div className="test-card">
    <Stars count={t.rating} />
    <div className="test-quote">"</div>
    <p>{t.text}</p>
    <div className="test-author-row">
      <div className="test-avatar">{t.avatar}</div>
      <div className="test-author-info">
        <span className="test-author">{t.name}</span>
        <span className="test-location">📍 {t.location}</span>
      </div>
    </div>
  </div>
);

/* ============================================================ */

const HomePage = () => {
  const [halls, setHalls] = useState([]);
  const [searchLoc, setSearchLoc] = useState("");
  const [searchCap, setSearchCap] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadHalls();
  }, []);

  const loadHalls = async () => {
    try {
      const res = await getHalls();
      setHalls(res.data.slice(0, 3));
    } catch {
      setHalls([
        {
          hallID: 1,
          name: "Grand Royal Hall",
          capacity: 500,
          pricePerDay: 150000,
          location: "Lahore",
          description: "A luxurious hall with crystal chandeliers.",
          imageURL:
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600",
        },
        {
          hallID: 2,
          name: "Pearl Garden",
          capacity: 300,
          pricePerDay: 100000,
          location: "Karachi",
          description: "Beautiful open-air garden hall.",
          imageURL:
            "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600",
        },
        {
          hallID: 3,
          name: "Diamond Palace",
          capacity: 400,
          pricePerDay: 120000,
          location: "Islamabad",
          description: "Modern indoor hall.",
          imageURL:
            "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600",
        },
      ]);
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLoc) params.append("location", searchLoc);
    if (searchCap) params.append("guests", searchCap);
    navigate(`/halls?${params.toString()}`);
  };

  return (
    <div className="home-page">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>
            Your Dream Wedding <span className="highlight">Begins Here</span>
          </h1>
          <p>Discover luxury halls crafted for your perfect celebration</p>
          <div className="hero-buttons">
            <Link to="/halls" className="btn-primary">
              Explore Halls
            </Link>
            <Link to="/contact" className="btn-secondary">
              Book a Tour
            </Link>
          </div>

          {/* Stat badges */}
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>500+</strong>
              <span>Premium Halls</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>15,000+</strong>
              <span>Happy Couples</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>50+</strong>
              <span>Cities</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>4.9 ★</strong>
              <span>Avg Rating</span>
            </div>
          </div>
        </div>

        <div className="scroll-arrow">
          <ChevronDown size={32} className="bounce" />
        </div>
      </section>

      {/* ── SEARCH BAR ── */}
      <section className="search-section">
        <form className="search-card" onSubmit={handleHeroSearch}>
          <div className="search-item">
            <label>Location</label>
            <input
              type="text"
              placeholder="City or hall name"
              value={searchLoc}
              onChange={(e) => setSearchLoc(e.target.value)}
            />
          </div>
          <div className="search-item">
            <label>Guests</label>
            <select
              value={searchCap}
              onChange={(e) => setSearchCap(e.target.value)}
            >
              <option value="">Any Capacity</option>
              <option value="100">100+</option>
              <option value="200">200+</option>
              <option value="300">300+</option>
              <option value="500">500+</option>
            </select>
          </div>
          <button type="submit" className="btn-primary search-btn">
            <Search size={18} /> Search Halls
          </button>
        </form>
      </section>

      {/* ── FEATURED HALLS ── */}
      <section className="halls-section">
        <div className="section-container">
          <p className="section-tag">✦ Hand-Picked For You</p>
          <h2 className="section-title">Our Premium Halls</h2>
          <p className="section-subtitle">
            Discover stunning venues tailored for every celebration
          </p>
          <div className="halls-grid">
            {halls.map((hall) => (
              <HallCard key={hall.hallID} hall={hall} />
            ))}
          </div>
          <div className="view-all-btn">
            <Link to="/halls" className="btn-secondary">
              View All Halls →
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="why-section">
        <div className="section-container">
          <p className="section-tag">✦ Why Us</p>
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">
            Everything you need for a perfect celebration — under one roof
          </p>
          <div className="why-grid">
            {[
              {
                icon: <Crown size={40} />,
                title: "Luxury Venues",
                desc: "Premium halls with world-class amenities and stunning decor.",
              },
              {
                icon: <Users size={40} />,
                title: "Professional Staff",
                desc: "Experienced teams dedicated to handling every last detail.",
              },
              {
                icon: <Package size={40} />,
                title: "Custom Packages",
                desc: "Tailor-made solutions that fit your vision and budget.",
              },
              {
                icon: <Headphones size={40} />,
                title: "24/7 Support",
                desc: "We are always here to assist you before, during, and after.",
              },
            ].map((item, i) => (
              <div className="why-card" key={i}>
                <div className="why-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section">
        <div className="section-container">
          <p className="section-tag">✦ Happy Couples</p>
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">
            Thousands of couples trusted us with their special day
          </p>
        </div>

        {/* Row 1 — scrolls left */}
        <div className="testimonials-track-wrapper">
          <div className="testimonials-track row-left">
            {ROW_ONE.map((t, i) => (
              <TestCard key={i} t={t} />
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div
          className="testimonials-track-wrapper"
          style={{ marginTop: "16px" }}
        >
          <div className="testimonials-track row-right">
            {ROW_TWO.map((t, i) => (
              <TestCard key={i} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-section">
        <h2>
          Turn Your Dream Wedding <span>Into Reality</span>
        </h2>
        <p>Join thousands of happy couples who celebrated with us</p>
        <div className="cta-stats">
          <div className="cta-stat">
            <strong>500+</strong>
            <span>Premium Halls</span>
          </div>

          <div className="cta-stat">
            <strong>15K+</strong>
            <span>Happy Couples</span>
          </div>

          <div className="cta-stat">
            <strong>4.9★</strong>
            <span>Customer Rating</span>
          </div>
        </div>
        <div className="cta-buttons">
          <Link to="/halls" className="btn-primary">
            Browse Halls
          </Link>
          <Link to="/contact" className="btn-secondary">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
