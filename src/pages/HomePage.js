import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Crown, Users, Package, Headphones, Star } from 'lucide-react';
import HallCard from '../components/HallCard';
import { getHalls } from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const [halls, setHalls] = useState([]);
  const [searchLoc, setSearchLoc] = useState('');
  const [searchCap, setSearchCap] = useState('');
  const navigate = useNavigate();

  useEffect(() => { loadHalls(); }, []);

  const loadHalls = async () => {
    try {
      const res = await getHalls();
      setHalls(res.data.slice(0, 3));
    } catch {
      setHalls([
        { hallID: 1, name: 'Grand Royal Hall', capacity: 500, pricePerDay: 150000, location: 'Lahore', description: 'A luxurious hall with crystal chandeliers.', imageURL: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600' },
        { hallID: 2, name: 'Pearl Garden', capacity: 300, pricePerDay: 100000, location: 'Karachi', description: 'Beautiful open-air garden hall.', imageURL: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600' },
        { hallID: 3, name: 'Diamond Palace', capacity: 400, pricePerDay: 120000, location: 'Islamabad', description: 'Modern indoor hall.', imageURL: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600' },
      ]);
    }
  };

    const handleHeroSearch = (e) => {
    e.preventDefault();
    // Navigate with query parameters
    const params = new URLSearchParams();
    if (searchLoc) params.append('location', searchLoc);
    if (searchCap) params.append('guests', searchCap);
    navigate(`/halls?${params.toString()}`);
  };

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Your Dream Wedding <span className="highlight">Begins Here</span></h1>
          <p>Discover luxury halls for your perfect celebration</p>
          <div className="hero-buttons">
            <Link to="/halls" className="btn-primary">Explore Halls</Link>
            <Link to="/contact" className="btn-secondary">Book a Tour</Link>
          </div>
          <div className="scroll-arrow"><ChevronDown size={32} className="bounce" /></div>
        </div>
      </section>

      {/* SEARCH BAR - NOW FUNCTIONAL */}
      <section className="search-section">
        <form className="search-card" onSubmit={handleHeroSearch}>
          <div className="search-item">
            <label>Location</label>
            <input type="text" placeholder="City or Hall Name" value={searchLoc} onChange={(e) => setSearchLoc(e.target.value)} />
          </div>
          <div className="search-item">
            <label>Guests</label>
            <select value={searchCap} onChange={(e) => setSearchCap(e.target.value)}>
              <option value="">Any Capacity</option>
              <option value="100">100+</option>
              <option value="200">200+</option>
              <option value="300">300+</option>
              <option value="500">500+</option>
            </select>
          </div>
          <button type="submit" className="btn-primary search-btn"><Search size={18} /> Search</button>
        </form>
      </section>

      {/* FEATURED HALLS */}
      <section className="halls-section">
        <div className="section-container">
          <h2 className="section-title">Our Premium Halls</h2>
          <p className="section-subtitle">Hand-picked venues for your special day</p>
          <div className="halls-grid">
            {halls.map(hall => <HallCard key={hall.hallID} hall={hall} />)}
          </div>
          <div className="view-all-btn">
            <Link to="/halls" className="btn-secondary">View All Halls →</Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-section">
        <div className="section-container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="why-grid">
            <div className="why-card"><Crown size={40} className="why-icon" /><h3>Luxury Venues</h3><p>Premium halls with world-class amenities</p></div>
            <div className="why-card"><Users size={40} className="why-icon" /><h3>Professional Staff</h3><p>Experienced teams to handle every detail</p></div>
            <div className="why-card"><Package size={40} className="why-icon" /><h3>Custom Packages</h3><p>Tailor-made solutions for your budget</p></div>
            <div className="why-card"><Headphones size={40} className="why-icon" /><h3>24/7 Support</h3><p>We're always here to assist you</p></div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="section-container">
          <h2 className="section-title">What Our Clients Say</h2>
          <div className="testimonials-grid">
            <div className="test-card">
              <div className="stars"><Star size={18} fill="#ff6b6b" stroke="#ff6b6b"/><Star size={18} fill="#ff6b6b" stroke="#ff6b6b"/><Star size={18} fill="#ff6b6b" stroke="#ff6b6b"/><Star size={18} fill="#ff6b6b" stroke="#ff6b6b"/><Star size={18} fill="#ff6b6b" stroke="#ff6b6b"/></div>
              <p>"Best wedding hall experience! Everything was perfect."</p>
              <div className="test-author">👩 Sarah Khan</div>
            </div>
            <div className="test-card">
              <div className="stars"><Star size={18} fill="#ff6b6b" stroke="#ff6b6b"/><Star size={18} fill="#ff6b6b" stroke="#ff6b6b"/><Star size={18} fill="#ff6b6b" stroke="#ff6b6b"/><Star size={18} fill="#ff6b6b" stroke="#ff6b6b"/><Star size={18} fill="#ff6b6b" stroke="#ff6b6b"/></div>
              <p>"Amazing decorations and the staff was so cooperative!"</p>
              <div className="test-author">👨 Ahmed Ali</div>
            </div>
            <div className="test-card">
              <div className="stars"><Star size={18} fill="#ff6b6b" stroke="#ff6b6b"/><Star size={18} fill="#ff6b6b" stroke="#ff6b6b"/><Star size={18} fill="#ff6b6b" stroke="#ff6b6b"/><Star size={18} fill="#ff6b6b" stroke="#ff6b6b"/><Star size={18} fill="#ff6b6b" stroke="#ff6b6b"/></div>
              <p>"They made our dream wedding come true. Absolutely stunning."</p>
              <div className="test-author">👩 Fatima Noor</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;