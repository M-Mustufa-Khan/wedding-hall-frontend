import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import './AuthPages.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/login');
    } catch (err) { setError(err.response?.data?.message || 'Registration failed.'); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join us to book your perfect venue</p>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Full Name" required value={form.fullName} onChange={(e) => setForm({...form, fullName: e.target.value})} />
          <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
          <input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
          <input type="password" placeholder="Password" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
          <button type="submit" className="btn-primary auth-btn">Create Account</button>
        </form>
        <p className="auth-link">Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;