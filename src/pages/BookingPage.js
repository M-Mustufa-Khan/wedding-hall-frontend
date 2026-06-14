import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, CreditCard, Banknote } from 'lucide-react';
import { createBooking } from '../services/api';
import './BookingPage.css';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hall, package: selectedPkg } = location.state || {};

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    eventDate: '', eventType: 'Wedding', timeSlot: 'Evening', guestCount: 200, packageId: selectedPkg?.packageID || '',
    fullName: '', email: '', phone: '', cnic: '', address: '', specialRequests: '', terms: false,
    paymentMethod: 'Cash'
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!hall) navigate('/halls');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
      setFormData(prev => ({ ...prev, fullName: user.fullName || '', email: user.email || '', phone: user.phone || '' }));
    }
  }, []);

  if (!hall) return null;

  const hallFee = hall.pricePerDay;
  const pkgFee = selectedPkg?.price || 0;
  const tax = Math.round((hallFee + pkgFee) * 0.1);
  const total = hallFee + pkgFee + tax;
  const advance = Math.round(total * 0.3);

  const handleBooking = async () => {
    try {
      await createBooking({
        hallID: hall.hallID,
        packageID: selectedPkg?.packageID || null,
        eventDate: formData.eventDate,
        eventType: formData.eventType,
        guestCount: formData.guestCount,
        totalPrice: total,
        specialNotes: `${formData.timeSlot} | ${formData.specialRequests}`
      });
      setStatus('success');
    } catch { setStatus('error'); }
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        {/* PROGRESS BAR */}
        <div className="progress-bar">
          {[1, 2, 3].map(s => (
            <div key={s} className={`progress-step ${step >= s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
              <div className="step-circle">{step > s ? <Check size={16}/> : s}</div>
              <span>{s === 1 ? 'Event Details' : s === 2 ? 'Personal Info' : 'Confirm & Pay'}</span>
            </div>
          ))}
        </div>

        <div className="booking-layout">
          {/* LEFT: FORM */}
          <div className="booking-form-section">
            {status === 'success' ? (
              <div className="success-state">
                <div className="success-icon">🎉</div>
                <h1>Booking Confirmed!</h1>
                <p>Your hall has been reserved successfully.</p>
                <button className="btn-primary" onClick={() => navigate('/my-bookings')}>View My Bookings</button>
              </div>
            ) : (
              <>
                {step === 1 && (
                  <div className="step-content">
                    <h2>Event Details</h2>
                    <div className="form-grid">
                      <div className="form-group"><label>Event Date</label><input type="date" required value={formData.eventDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setFormData({...formData, eventDate: e.target.value})} /></div>
                      <div className="form-group"><label>Event Type</label><select value={formData.eventType} onChange={(e) => setFormData({...formData, eventType: e.target.value})}><option>Wedding</option><option>Walima</option><option>Engagement</option><option>Birthday</option></select></div>
                      <div className="form-group"><label>Time Slot</label><select value={formData.timeSlot} onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}><option>Morning (8am-2pm)</option><option>Evening (5pm-11pm)</option><option>Full Day</option></select></div>
                      <div className="form-group"><label>Guest Count</label><input type="number" value={formData.guestCount} onChange={(e) => setFormData({...formData, guestCount: parseInt(e.target.value)})}/></div>
                    </div>
                    {selectedPkg && <div className="selected-pkg"><h3>Package: {selectedPkg.name}</h3><p>Rs {selectedPkg.price?.toLocaleString()}</p></div>}
                    <div className="step-actions"><button className="btn-primary" onClick={() => setStep(2)}>Next Step →</button></div>
                  </div>
                )}

                {step === 2 && (
                  <div className="step-content">
                    <h2>Personal Information</h2>
                    <div className="form-grid">
                      <div className="form-group"><label>Full Name</label><input value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} /></div>
                      <div className="form-group"><label>Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
                      <div className="form-group"><label>Phone</label><input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
                      <div className="form-group"><label>CNIC</label><input placeholder="XXXXX-XXXXXXX-X" value={formData.cnic} onChange={(e) => setFormData({...formData, cnic: e.target.value})} /></div>
                    </div>
                    <div className="form-group full"><label>Address</label><textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}></textarea></div>
                    <div className="form-group full"><label>Special Requests</label><textarea value={formData.specialRequests} onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}></textarea></div>
                    <div className="checkbox-group"><input type="checkbox" checked={formData.terms} onChange={(e) => setFormData({...formData, terms: e.target.checked})} /><label>I agree to Terms & Conditions</label></div>
                    <div className="step-actions">
                      <button className="btn-secondary" onClick={() => setStep(1)}><ChevronLeft size={16}/> Back</button>
                      <button className="btn-primary" onClick={() => setStep(3)} disabled={!formData.terms}>Next Step →</button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="step-content">
                    <h2>Confirm & Pay</h2>
                    <div className="payment-methods">
                      <div className={`pay-option ${formData.paymentMethod === 'Cash' ? 'active' : ''}`} onClick={() => setFormData({...formData, paymentMethod: 'Cash'})}><Banknote size={24}/> Cash on Visit</div>
                      <div className={`pay-option ${formData.paymentMethod === 'Bank' ? 'active' : ''}`} onClick={() => setFormData({...formData, paymentMethod: 'Bank'})}><CreditCard size={24}/> Bank Transfer</div>
                    </div>
                    <div className="advance-notice">💰 30% advance payment required: <strong>Rs {advance.toLocaleString()}</strong></div>
                    {status === 'error' && <p className="booking-error">Booking failed. Hall might be booked on this date.</p>}
                    <div className="step-actions">
                      <button className="btn-secondary" onClick={() => setStep(2)}><ChevronLeft size={16}/> Back</button>
                      <button className="btn-primary confirm-btn" onClick={handleBooking}>Confirm Booking</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT: SUMMARY */}
          <aside className="booking-summary-card">
            <div className="summary-hall">
              <img src={hall.imageURL} alt={hall.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400'; }}/>
              <div>
                <h3>{hall.name}</h3>
                <p>📍 {hall.location}</p>
              </div>
            </div>
            <div className="summary-details">
              {formData.eventDate && <p>📅 {new Date(formData.eventDate).toLocaleDateString()}</p>}
              <p>🕐 {formData.timeSlot}</p>
              <p>👥 {formData.guestCount} Guests</p>
              {selectedPkg && <p>📦 {selectedPkg.name}</p>}
            </div>
            <div className="summary-pricing">
              <div className="price-row"><span>Hall Fee</span><span>Rs {hallFee?.toLocaleString()}</span></div>
              <div className="price-row"><span>Package Fee</span><span>Rs {pkgFee?.toLocaleString()}</span></div>
              <div className="price-row"><span>Tax (10%)</span><span>Rs {tax?.toLocaleString()}</span></div>
              <div className="price-row total"><span>Total</span><span>Rs {total?.toLocaleString()}</span></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;