import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking, checkHallAvailability } from "../services/api";
import {
  Check,
  ChevronLeft,
  CreditCard,
  Building,
  AlertCircle,
  Upload,
} from "lucide-react";
import "./BookingPage.css";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hall, package: selectedPkg } = location.state || {};

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [conflictDate, setConflictDate] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    cnic: "",
    address: "",
    eventDate: "",
    eventType: "Wedding",
    timeSlot: "Evening (5pm-11pm)",
    guestCount: 200,
    specialRequests: "",
    terms: false,
    paymentMethod: "Online",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    transactionRef: "",
  });

  useEffect(() => {
    if (!hall) navigate("/halls");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user)
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
  }, [hall, navigate]);

  if (!hall) return null;

  const hallFee = hall.pricePerDay;
  const pkgFee = selectedPkg?.price || 0;
  const tax = Math.round((hallFee + pkgFee) * 0.1);
  const total = hallFee + pkgFee + tax;
  const advance = Math.round(total * 0.3);
  const balance = total - advance;

  const formatCNIC = (val) =>
    val.replace(/^(\d{5})(\d{7})(\d{1})$/, "$1-$2-$3");
  const formatCard = (val) => val.replace(/(\d{4})/g, "$1 ").trim();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = value;
    if (name === "phone") val = val.replace(/\D/g, "").slice(0, 11);
    if (name === "cnic") val = val.replace(/\D/g, "").slice(0, 13);
    if (name === "cardNumber") val = val.replace(/\D/g, "").slice(0, 16);
    if (name === "cvv") val = val.replace(/\D/g, "").slice(0, 3);
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : val });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrors({ ...errors, receipt: "File is too large. Max size is 2MB." });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptPreview(reader.result);
      if (errors.receipt) setErrors({ ...errors, receipt: "" });
    };
    reader.readAsDataURL(file);
  };

  const validateStep1 = () => {
    const errs = {};
    if (!formData.fullName || formData.fullName.length < 3)
      errs.fullName = "Name must be at least 3 characters";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errs.email = "Valid email required";
    if (!formData.phone || formData.phone.length !== 11)
      errs.phone = "Must be exactly 11 digits";
    if (!formData.cnic || formData.cnic.length !== 13)
      errs.cnic = "Must be exactly 13 digits";
    if (!formData.eventDate) errs.eventDate = "Please select a date";
    if (!formData.guestCount || formData.guestCount > hall.capacity)
      errs.guestCount = `Cannot exceed ${hall.capacity} guests`;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const checkAvailability = async () => {
    setIsLoading(true);
    setIsAvailable(null);
    setConflictDate(null);
    try {
      const selectedDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setIsAvailable(false);
        setIsLoading(false);
        return;
      }

      const res = await checkHallAvailability(hall.hallID, formData.eventDate);
      setIsAvailable(res.data);
      if (!res.data) setConflictDate(formData.eventDate);
    } catch {
      setErrors({
        ...errors,
        availability: "Could not connect to server to verify availability.",
      });
      setIsAvailable(null);
    } finally {
      setIsLoading(false);
    }
  };

  const validateStep3 = () => {
    const errs = {};
    if (formData.paymentMethod === "Online") {
      if (!formData.cardName) errs.cardName = "Required";
      if (!formData.cardNumber || formData.cardNumber.length !== 16)
        errs.cardNumber = "Must be 16 digits";
      if (!formData.expiry || !/^\d{2}\/\d{2}$/.test(formData.expiry))
        errs.expiry = "Format MM/YY";
      else {
        const [mm, yy] = formData.expiry.split("/").map(Number);
        const expDate = new Date(2000 + yy, mm);
        if (expDate < new Date()) errs.expiry = "Card has expired";
      }
      if (!formData.cvv || formData.cvv.length !== 3)
        errs.cvv = "Must be 3 digits";
    } else {
      if (!formData.transactionRef) errs.transactionRef = "Required";
      if (!receiptPreview) errs.receipt = "Please upload your payment receipt";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirmBooking = async () => {
    if (!validateStep3()) return;
    if (submitting) return;

    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      navigate("/login");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createBooking({
        userID: user.userID,
        hallID: hall.hallID,
        packageID: selectedPkg?.packageID || null,
        eventDate: formData.eventDate,
        eventType: formData.eventType,
        guestCount: parseInt(formData.guestCount),
        totalPrice: total,
        customerPhone: formData.phone,
        cnic: formatCNIC(formData.cnic),
        customerAddress: formData.address,
        paymentMethod: formData.paymentMethod,
        receiptImage: receiptPreview || null,
        transactionRef: formData.transactionRef || null,
        specialNotes: `${formData.timeSlot}${formData.specialRequests ? " | " + formData.specialRequests : ""}`,
      });

      navigate("/booking-success", {
        state: {
          booking: {
            ...res.data,
            hallName: hall.name,
            hallImage: hall.imageURL,
            advancePaid: advance,
            totalAmount: total,
          },
        },
      });
    } catch (err) {
      setErrors({
        submit:
          err.response?.data?.message ||
          "Booking failed. The hall might already be booked on this date.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formattedDate = formData.eventDate
    ? new Date(formData.eventDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="progress-bar">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`progress-step ${step >= s ? "active" : ""} ${step > s ? "completed" : ""}`}
            >
              <div className="step-circle">
                {step > s ? <Check size={16} /> : s}
              </div>
              <span>
                {s === 1
                  ? "Details & Info"
                  : s === 2
                    ? "Availability"
                    : "Payment"}
              </span>
            </div>
          ))}
        </div>

        <div className="booking-layout">
          <div className="booking-form-section">
            {/* STEP 1 */}
            {step === 1 && (
              <div className="step-content">
                <h2>Step 1: Your Information</h2>
                {Object.keys(errors).length > 0 && (
                  <div className="global-error">
                    <AlertCircle size={16} /> Please fix the errors below
                  </div>
                )}
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={errors.fullName ? "error" : ""}
                    />
                    {errors.fullName && (
                      <span className="error-msg">{errors.fullName}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "error" : ""}
                    />
                    {errors.email && (
                      <span className="error-msg">{errors.email}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Phone (11 digits) *</label>
                    <input
                      name="phone"
                      type="text"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? "error" : ""}
                      placeholder="03001234567"
                    />
                    {errors.phone && (
                      <span className="error-msg">{errors.phone}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>CNIC (13 digits) *</label>
                    <input
                      name="cnic"
                      type="text"
                      value={formatCNIC(formData.cnic)}
                      onChange={handleChange}
                      className={errors.cnic ? "error" : ""}
                      placeholder="12345-1234567-1"
                    />
                    {errors.cnic && (
                      <span className="error-msg">{errors.cnic}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Event Date *</label>
                    <input
                      name="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className={errors.eventDate ? "error" : ""}
                    />
                    {errors.eventDate && (
                      <span className="error-msg">{errors.eventDate}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Event Type</label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                    >
                      <option>Wedding</option>
                      <option>Walima</option>
                      <option>Engagement</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Guest Count *</label>
                    <input
                      name="guestCount"
                      type="number"
                      value={formData.guestCount}
                      onChange={handleChange}
                      max={hall.capacity}
                      className={errors.guestCount ? "error" : ""}
                    />
                    {errors.guestCount && (
                      <span className="error-msg">{errors.guestCount}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Time Slot</label>
                    <select
                      name="timeSlot"
                      value={formData.timeSlot}
                      onChange={handleChange}
                    >
                      <option>Morning (8am-2pm)</option>
                      <option>Evening (5pm-11pm)</option>
                      <option>Full Day</option>
                    </select>
                  </div>
                  <div className="form-group full">
                    <label>Address (optional)</label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Your home or office address"
                    />
                  </div>
                </div>
                <div className="step-actions">
                  <button
                    className="btn-primary"
                    onClick={() => validateStep1() && setStep(2)}
                  >
                    Check Availability →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="step-content">
                <h2>Step 2: Hall Availability</h2>

                {errors.availability && (
                  <div className="global-error">
                    <AlertCircle size={16} /> {errors.availability}
                  </div>
                )}

                <div className="availability-check">
                  {isAvailable === null && !isLoading && (
                    <div className="av-card pending">
                      <div className="av-icon-large">📅</div>
                      <h3>Verify Your Date</h3>
                      <p className="av-text">
                        Please confirm if <strong>{hall.name}</strong> is
                        available on <strong>{formattedDate}</strong>
                      </p>
                      <button
                        className="btn-primary av-btn"
                        onClick={checkAvailability}
                      >
                        Check Availability
                      </button>
                    </div>
                  )}
                  {isLoading && (
                    <div className="av-card loading">
                      <div className="spinner"></div>
                      <p className="av-text">
                        Checking availability for {formattedDate}...
                      </p>
                    </div>
                  )}
                  {isAvailable === true && (
                    <div className="av-card success">
                      <div className="av-icon-large">✅</div>
                      <h3>Hall is Available!</h3>
                      <p className="av-text">
                        Great news! <strong>{hall.name}</strong> is free on{" "}
                        <strong>{formattedDate}</strong>. Proceed to secure your
                        booking!
                      </p>
                      <button
                        className="btn-primary av-btn"
                        onClick={() => setStep(3)}
                      >
                        Proceed to Payment →
                      </button>
                    </div>
                  )}
                  {isAvailable === false && (
                    <div className="av-card error">
                      <div className="av-icon-large">❌</div>
                      <h3>Not Available</h3>
                      <p className="av-text">
                        {conflictDate ? (
                          <>
                            Unfortunately, <strong>{hall.name}</strong> is
                            already booked on <strong>{formattedDate}</strong>.
                          </>
                        ) : (
                          <>
                            That date has already passed. Please choose a future
                            date.
                          </>
                        )}
                      </p>
                      <button
                        className="btn-secondary av-btn"
                        onClick={() => {
                          setStep(1);
                          setIsAvailable(null);
                        }}
                      >
                        Change Date
                      </button>
                    </div>
                  )}
                </div>
                <div className="step-actions">
                  <button className="btn-secondary" onClick={() => setStep(1)}>
                    <ChevronLeft size={16} /> Back
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="step-content">
                <h2>Step 3: Payment</h2>
                <div className="payment-methods">
                  <div
                    className={`pay-option ${formData.paymentMethod === "Online" ? "active" : ""}`}
                    onClick={() =>
                      setFormData({ ...formData, paymentMethod: "Online" })
                    }
                  >
                    <CreditCard size={24} /> Online Payment
                  </div>
                  <div
                    className={`pay-option ${formData.paymentMethod === "Bank" ? "active" : ""}`}
                    onClick={() =>
                      setFormData({ ...formData, paymentMethod: "Bank" })
                    }
                  >
                    <Building size={24} /> Bank Transfer
                  </div>
                </div>

                {formData.paymentMethod === "Online" && (
                  <div className="payment-form">
                    <div className="card-preview">
                      <p className="card-number">
                        {formatCard(formData.cardNumber) ||
                          "•••• •••• •••• ••••"}
                      </p>
                      <p className="card-name">
                        {formData.cardName || "YOUR NAME"}
                      </p>
                      <p className="card-exp">{formData.expiry || "MM/YY"}</p>
                    </div>
                    <div className="form-grid">
                      <div className="form-group full">
                        <label>Cardholder Name</label>
                        <input
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          className={errors.cardName ? "error" : ""}
                        />
                        {errors.cardName && (
                          <span className="error-msg">{errors.cardName}</span>
                        )}
                      </div>
                      <div className="form-group full">
                        <label>Card Number</label>
                        <input
                          name="cardNumber"
                          value={formatCard(formData.cardNumber)}
                          onChange={handleChange}
                          className={errors.cardNumber ? "error" : ""}
                        />
                        {errors.cardNumber && (
                          <span className="error-msg">{errors.cardNumber}</span>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Expiry (MM/YY)</label>
                        <input
                          name="expiry"
                          value={formData.expiry}
                          onChange={handleChange}
                          placeholder="12/25"
                          className={errors.expiry ? "error" : ""}
                        />
                        {errors.expiry && (
                          <span className="error-msg">{errors.expiry}</span>
                        )}
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input
                          name="cvv"
                          type="password"
                          value={formData.cvv}
                          onChange={handleChange}
                          className={errors.cvv ? "error" : ""}
                        />
                        {errors.cvv && (
                          <span className="error-msg">{errors.cvv}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === "Bank" && (
                  <div className="payment-form bank-details">
                    <div className="bank-info">
                      <p>
                        <strong>Bank:</strong> HBL / Meezan Bank
                      </p>
                      <p>
                        <strong>Account:</strong> Elegant Celebrations Pvt Ltd
                      </p>
                      <p>
                        <strong>IBAN:</strong> PK36MEZN0001234567890123
                      </p>
                      <p className="note">
                        Transfer exactly{" "}
                        <strong>Rs {advance.toLocaleString()}</strong> and
                        upload receipt below.
                      </p>
                    </div>
                    <div className="form-group full">
                      <label>Transaction Reference *</label>
                      <input
                        name="transactionRef"
                        value={formData.transactionRef}
                        onChange={handleChange}
                        className={errors.transactionRef ? "error" : ""}
                      />
                      {errors.transactionRef && (
                        <span className="error-msg">
                          {errors.transactionRef}
                        </span>
                      )}
                    </div>
                    <div className="upload-section">
                      <label className="upload-label">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          style={{ display: "none" }}
                        />
                        <div className="upload-box">
                          {receiptPreview ? (
                            <div className="preview-container">
                              <img
                                src={receiptPreview}
                                alt="Receipt"
                                className="receipt-preview"
                              />
                              <p className="upload-success-text">
                                ✅ Receipt Uploaded (Click to change)
                              </p>
                            </div>
                          ) : (
                            <>
                              <Upload size={32} className="upload-icon" />
                              <p>Upload Payment Receipt</p>
                              <span>JPG, PNG or PDF (Max 2MB)</span>
                            </>
                          )}
                        </div>
                      </label>
                      {errors.receipt && (
                        <span className="error-msg">{errors.receipt}</span>
                      )}
                    </div>
                  </div>
                )}

                {errors.submit && (
                  <div className="global-error">
                    <AlertCircle size={16} /> {errors.submit}
                  </div>
                )}

                <div className="step-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => setStep(2)}
                    disabled={submitting}
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button
                    className="btn-primary confirm-btn"
                    onClick={handleConfirmBooking}
                    disabled={submitting}
                  >
                    {submitting
                      ? "Processing…"
                      : `Pay Rs ${advance.toLocaleString()} & Confirm`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: SUMMARY */}
          <aside className="booking-summary-card">
            <div className="summary-hall">
              <img
                src={hall.imageURL}
                alt={hall.name}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400";
                }}
              />
              <div>
                <h3>{hall.name}</h3>
                <p>📍 {hall.location}</p>
              </div>
            </div>
            <div className="summary-details">
              {formData.eventDate && <p>📅 {formattedDate}</p>}
              <p>🕐 {formData.timeSlot}</p>
              <p>👥 {formData.guestCount} Guests</p>
              <p>📦 {selectedPkg?.name || "No Package"}</p>
            </div>
            <div className="summary-pricing">
              <div className="price-row">
                <span>Hall Fee</span>
                <span>Rs {hallFee?.toLocaleString()}</span>
              </div>
              <div className="price-row">
                <span>Package Fee</span>
                <span>Rs {pkgFee?.toLocaleString()}</span>
              </div>
              <div className="price-row">
                <span>Tax (10%)</span>
                <span>Rs {tax?.toLocaleString()}</span>
              </div>
              <div className="price-row total">
                <span>Total</span>
                <span>Rs {total?.toLocaleString()}</span>
              </div>
              <div className="price-row advance">
                <span>Advance (30%)</span>
                <span>Rs {advance?.toLocaleString()}</span>
              </div>
              <div className="price-row balance">
                <span>Balance Due</span>
                <span>Rs {balance?.toLocaleString()}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
