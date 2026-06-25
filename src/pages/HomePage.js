import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, ChevronDown, Crown, Users, Package, Headphones,
  Star, Calendar, CheckCircle, ArrowRight,
} from "lucide-react";
import HallCard from "../components/HallCard";
import { getHalls } from "../services/api";
import "./HomePage.css";

/* ── Testimonials ── */
const TESTIMONIALS = [
  { name: "Sarah Khan",    location: "Karachi",     initials: "SK", rating: 5, text: "Best wedding hall experience! Everything was absolutely perfect. The staff went above and beyond to make our day special." },
  { name: "Ahmed Ali",     location: "Lahore",      initials: "AA", rating: 4, text: "Amazing decorations and the staff was so cooperative! The food was excellent and the lighting was breathtaking." },
  { name: "Fatima Noor",   location: "Islamabad",   initials: "FN", rating: 5, text: "They made our dream wedding come true. Absolutely stunning venue with world-class service from beginning to end." },
  { name: "Usman Tariq",   location: "Rawalpindi",  initials: "UT", rating: 5, text: "Booked the Grand Royal Hall for my daughter's wedding. Couldn't have asked for a better experience. Highly recommend!" },
  { name: "Ayesha Malik",  location: "Faisalabad",  initials: "AM", rating: 5, text: "The online booking was so easy and the hall was even more beautiful in person. Our guests were truly impressed." },
  { name: "Bilal Hassan",  location: "Multan",      initials: "BH", rating: 4, text: "Professional team, stunning decor, and seamless coordination. Our walima was unforgettable thanks to Elegant Celebrations." },
  { name: "Zara Sheikh",   location: "Karachi",     initials: "ZS", rating: 5, text: "From booking to the event day everything was flawless. The bridal room was gorgeous and the catering was superb!" },
  { name: "Hamza Raza",    location: "Lahore",      initials: "HR", rating: 5, text: "Great value for money. The Premium package had everything we needed and the team handled every detail perfectly." },
  { name: "Sana Butt",     location: "Islamabad",   initials: "SB", rating: 4, text: "Wonderful experience! The hall ambiance, lighting, and service made our engagement ceremony truly magical." },
  { name: "Danish Ahmed",  location: "Peshawar",    initials: "DA", rating: 5, text: "I was nervous about planning from abroad but the team handled everything remotely. Exceeded all our expectations!" },
];

const ROW_ONE = [...TESTIMONIALS.slice(0, 5), ...TESTIMONIALS.slice(0, 5)];
const ROW_TWO = [...TESTIMONIALS.slice(5),    ...TESTIMONIALS.slice(5)];

const Stars = ({ count }) => (
  <div className="stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={13} fill={i < count ? "#d4af37" : "none"} stroke={i < count ? "#d4af37" : "#333"} />
    ))}
  </div>
);

const TestCard = ({ t }) => (
  <div className="test-card">
    <Stars count={t.rating} />
    <p>"{t.text}"</p>
    <div className="test-author-row">
      <div className="test-avatar">{t.initials}</div>
      <div className="test-author-info">
        <span className="test-author">{t.name}</span>
        <span className="test-location">📍 {t.location}</span>
      </div>
    </div>
  </div>
);

/* ── Gallery images ── */
const GALLERY_IMGS = [
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800", alt: "Wedding Ceremony"  },
  { src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800", alt: "Reception Hall"    },
  { src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800", alt: "Hall Interior"     },
  { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800", alt: "Elegant Dining"    },
  { src: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800", alt: "Grand Celebration" },
];

/* ── Steps ── */
const STEPS = [
  { num: "01", icon: <Search size={26} />,        title: "Browse Halls",    desc: "Explore our curated collection of premium wedding venues across Pakistan." },
  { num: "02", icon: <Calendar size={26} />,      title: "Book Online",     desc: "Choose your date, select a package, and confirm your booking in minutes." },
  { num: "03", icon: <CheckCircle size={26} />,   title: "Celebrate",       desc: "Arrive on your special day to a flawlessly prepared hall and dedicated team." },
];

/* ── Why cards ── */
const WHY_CARDS = [
  { num: "01", icon: <Crown size={32} />,       title: "Luxury Venues",      desc: "Premium halls with world-class amenities and stunning decor." },
  { num: "02", icon: <Users size={32} />,       title: "Professional Staff",  desc: "Experienced teams dedicated to handling every last detail." },
  { num: "03", icon: <Package size={32} />,     title: "Custom Packages",     desc: "Tailor-made solutions that fit your vision and budget." },
  { num: "04", icon: <Headphones size={32} />,  title: "24/7 Support",        desc: "We are always here to assist you before, during, and after." },
];

/* ================================================================== */

const HomePage = () => {
  useEffect(() => { document.title = "Elegant Celebrations — Premium Wedding Halls in Pakistan"; }, []);

  const [halls, setHalls]             = useState([]);
  const [loadingHalls, setLoadingHalls] = useState(true);
  const [searchLoc, setSearchLoc]     = useState("");
  const [searchCap, setSearchCap]     = useState("");
  const navigate = useNavigate();

  useEffect(() => { loadHalls(); }, []);

  const loadHalls = async () => {
    setLoadingHalls(true);
    try {
      const res = await getHalls();
      setHalls(res.data.slice(0, 3));
    } catch {
      setHalls([
        { hallID: 1, name: "Grand Royal Hall",  capacity: 500, pricePerDay: 150000, location: "Lahore",    description: "A luxurious hall with crystal chandeliers.", imageURL: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600" },
        { hallID: 2, name: "Pearl Garden",      capacity: 300, pricePerDay: 100000, location: "Karachi",   description: "Beautiful open-air garden hall.",            imageURL: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600" },
        { hallID: 3, name: "Diamond Palace",    capacity: 400, pricePerDay: 120000, location: "Islamabad", description: "Modern indoor hall.",                        imageURL: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600" },
      ]);
    } finally {
      setLoadingHalls(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (searchLoc) p.append("location", searchLoc);
    if (searchCap) p.append("guests", searchCap);
    navigate(`/halls?${p.toString()}`);
  };

  return (
    <div className="home-page">

      {/* ══════════════ HERO ══════════════ */}
      <section className="hero">
        <div className="home-hero-bg" aria-hidden="true" />
        <div className="home-hero-overlay" aria-hidden="true" />
        <div className="hero-glow"   aria-hidden="true" />

        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Trusted by 15,000+ Couples Across Pakistan
          </div>

          <h1 className="hero-heading">
            Your Dream Wedding<br />
            <span className="hero-heading-gold">Begins Here</span>
          </h1>

          <div className="hero-ornament" aria-hidden="true">
            <span className="hero-ornament-line" />
            <span className="hero-ornament-gem">✦</span>
            <span className="hero-ornament-line hero-ornament-line--right" />
          </div>

          <p className="home-hero-sub">
            Pakistan's most trusted platform for discovering and booking
            luxury wedding halls across the country
          </p>

          <div className="hero-actions">
            <Link to="/halls" className="btn-primary">
              Explore Halls <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn-ghost-hero">
              Book a Tour
            </Link>
          </div>

          {/* Search bar inside hero */}
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hero-search-field">
              <label>Location</label>
              <input
                type="text"
                placeholder="City or hall name…"
                value={searchLoc}
                onChange={(e) => setSearchLoc(e.target.value)}
              />
            </div>
            <div className="hero-search-divider" aria-hidden="true" />
            <div className="hero-search-field">
              <label>Guests</label>
              <select value={searchCap} onChange={(e) => setSearchCap(e.target.value)}>
                <option value="">Any Capacity</option>
                <option value="100">100+</option>
                <option value="200">200+</option>
                <option value="300">300+</option>
                <option value="500">500+</option>
              </select>
            </div>
            <button type="submit" className="hero-search-btn">
              <Search size={17} /> Search
            </button>
          </form>
        </div>

        {/* Stats strip */}
        <div className="hero-stats-strip">
          {[
            { val: "500+",   label: "Premium Halls"  },
            { val: "15K+",   label: "Happy Couples"  },
            { val: "50+",    label: "Cities"          },
            { val: "4.9 ★",  label: "Avg. Rating"    },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div className="stats-divider" aria-hidden="true" />}
              <div className="hero-stat">
                <strong>{s.val}</strong>
                <span>{s.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="scroll-arrow" aria-hidden="true">
          <ChevronDown size={28} className="bounce" />
        </div>
      </section>

      {/* ══════════════ FEATURED HALLS ══════════════ */}
      <section className="halls-section reveal">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag-line" aria-hidden="true" />
            <span className="section-tag">Hand-Picked For You</span>
            <div className="section-tag-line" aria-hidden="true" />
          </div>
          <h2 className="home-section-title">Our Premium Halls</h2>
          <p className="section-subtitle">Discover stunning venues tailored for every celebration</p>

          <div className="halls-grid">
            {loadingHalls
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="home-skel-card">
                    <div className="home-skel home-skel-img" />
                    <div className="home-skel-body">
                      <div className="home-skel home-skel-line" style={{ width: "65%" }} />
                      <div className="home-skel home-skel-line" style={{ width: "45%" }} />
                      <div className="home-skel home-skel-line" style={{ width: "85%" }} />
                      <div className="home-skel home-skel-footer">
                        <div className="home-skel home-skel-line" style={{ width: "30%" }} />
                        <div className="home-skel home-skel-line" style={{ width: "30%" }} />
                      </div>
                    </div>
                  </div>
                ))
              : halls.map((hall) => <HallCard key={hall.hallID} hall={hall} />)
            }
          </div>

          <div className="view-all-wrap">
            <Link to="/halls" className="btn-secondary">
              View All Halls <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section className="steps-section reveal">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag-line" aria-hidden="true" />
            <span className="section-tag">Simple Process</span>
            <div className="section-tag-line" aria-hidden="true" />
          </div>
          <h2 className="home-section-title">How It Works</h2>
          <p className="section-subtitle">Book your dream hall in three easy steps</p>

          <div className="steps-grid">
            {STEPS.map((step, i) => (
              <div className="step-card reveal" key={step.num} style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="step-num">{step.num}</div>
                <div className="step-icon-wrap">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="step-connector" aria-hidden="true">
                    <ArrowRight size={18} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ WHY CHOOSE US ══════════════ */}
      <section className="why-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag-line" aria-hidden="true" />
            <span className="section-tag">Why Us</span>
            <div className="section-tag-line" aria-hidden="true" />
          </div>
          <h2 className="home-section-title">Why Choose Elegant Celebrations</h2>
          <p className="section-subtitle">Everything you need for a perfect celebration — under one roof</p>

          <div className="why-grid">
            {WHY_CARDS.map((item, i) => (
              <div className={`why-card reveal`} style={{ animationDelay: `${i * 0.1}s` }} key={item.num}>
                <span className="why-card-num">{item.num}</span>
                <div className="why-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ GALLERY TEASER ══════════════ */}
      <section className="gallery-section reveal">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag-line" aria-hidden="true" />
            <span className="section-tag">Our Venues</span>
            <div className="section-tag-line" aria-hidden="true" />
          </div>
          <h2 className="home-section-title">A Glimpse of Elegance</h2>
          <p className="section-subtitle">Every corner designed to create lasting memories</p>
        </div>

        <div className="gallery-mosaic">
          <div className="gallery-col gallery-col-left">
            <div className="gallery-tile gallery-tile-tall">
              <img src={GALLERY_IMGS[0].src} alt={GALLERY_IMGS[0].alt} loading="lazy" />
              <div className="gallery-tile-overlay"><span>{GALLERY_IMGS[0].alt}</span></div>
            </div>
          </div>
          <div className="gallery-col gallery-col-mid">
            <div className="gallery-tile">
              <img src={GALLERY_IMGS[1].src} alt={GALLERY_IMGS[1].alt} loading="lazy" />
              <div className="gallery-tile-overlay"><span>{GALLERY_IMGS[1].alt}</span></div>
            </div>
            <div className="gallery-tile">
              <img src={GALLERY_IMGS[2].src} alt={GALLERY_IMGS[2].alt} loading="lazy" />
              <div className="gallery-tile-overlay"><span>{GALLERY_IMGS[2].alt}</span></div>
            </div>
          </div>
          <div className="gallery-col gallery-col-right">
            <div className="gallery-tile">
              <img src={GALLERY_IMGS[3].src} alt={GALLERY_IMGS[3].alt} loading="lazy" />
              <div className="gallery-tile-overlay"><span>{GALLERY_IMGS[3].alt}</span></div>
            </div>
            <div className="gallery-tile gallery-tile-wide">
              <img src={GALLERY_IMGS[4].src} alt={GALLERY_IMGS[4].alt} loading="lazy" />
              <div className="gallery-tile-overlay"><span>{GALLERY_IMGS[4].alt}</span></div>
            </div>
          </div>
        </div>

        <div className="view-all-wrap" style={{ marginTop: "36px" }}>
          <Link to="/gallery" className="btn-secondary">
            View Full Gallery <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <section className="testimonials-section reveal">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag-line" aria-hidden="true" />
            <span className="section-tag">Happy Couples</span>
            <div className="section-tag-line" aria-hidden="true" />
          </div>
          <h2 className="home-section-title">What Our Clients Say</h2>
          <p className="section-subtitle">Thousands of couples trusted us with their special day</p>
        </div>

        <div className="testimonials-track-wrapper">
          <div className="testimonials-track row-left">
            {ROW_ONE.map((t, i) => <TestCard key={i} t={t} />)}
          </div>
        </div>
        <div className="testimonials-track-wrapper" style={{ marginTop: "16px" }}>
          <div className="testimonials-track row-right">
            {ROW_TWO.map((t, i) => <TestCard key={i} t={t} />)}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="cta-section reveal">
        <div className="cta-bg" aria-hidden="true" />
        <div className="cta-inner">
          <div className="section-header">
            <div className="section-tag-line cta-tag-line" aria-hidden="true" />
            <span className="section-tag cta-tag">Start Planning</span>
            <div className="section-tag-line cta-tag-line" aria-hidden="true" />
          </div>
          <h2 className="cta-heading">
            Turn Your Dream Wedding<br />
            <span>Into Reality</span>
          </h2>
          <p className="cta-sub">Join thousands of happy couples who celebrated the most beautiful day of their lives with us</p>

          <div className="cta-stats">
            {[
              { val: "500+", label: "Premium Halls" },
              { val: "15K+", label: "Happy Couples" },
              { val: "4.9★", label: "Customer Rating" },
            ].map((s) => (
              <div className="cta-stat" key={s.label}>
                <strong>{s.val}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          <div className="cta-buttons">
            <Link to="/halls"   className="btn-primary">Browse Halls</Link>
            <Link to="/contact" className="btn-ghost-cta">Contact Us</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
