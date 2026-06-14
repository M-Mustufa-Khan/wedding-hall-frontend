import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">💍</span>
          <span className="logo-text">Elegant Celebrations</span>
        </Link>
        <div className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/halls" onClick={() => setMenuOpen(false)}>Halls</Link>
          <Link to="/packages" onClick={() => setMenuOpen(false)}>Packages</Link>
          <Link to="/gallery" onClick={() => setMenuOpen(false)}>Gallery</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </div>
        <div className={`nav-actions ${menuOpen ? 'active' : ''}`}>
          {user ? (
            <>
              <Link to="/my-bookings" className="nav-link-small" onClick={() => setMenuOpen(false)}><Heart size={16} /> My Bookings</Link>
              <button className="nav-btn logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/halls" className="nav-btn register-btn" onClick={() => setMenuOpen(false)}>Book Now</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;