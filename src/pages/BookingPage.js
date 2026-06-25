import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking, checkHallAvailability } from "../services/api";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Building2,
  AlertCircle,
  Upload,
  MapPin,
  CalendarDays,
  Clock,
  Users,
  Package,
  Sparkles,
  ShieldCheck,
  Banknote,
} from "lucide-react";
import "./BookingPage.css";

const STEPS = [
  { label: "Event Details" },
  { label: "Date & Time" },
  { label: "Payment" },
];

const BookingPage = () => {
  useEffect(() => { document.title = "Book Your Event — Elegant Celebrations"; }, []);

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
    if (!formData.guestCount || formData.guestCount > hall.capacity)
      errs.guestCount = `Cannot exceed ${hall.capacity} guests`;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.eventDate) errs.eventDate = "Please select a date";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const checkAvailability = async () => {
    if (!validateStep2()) return;
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
            hallLocation: hall.location,
            hallImage: hall.imageURL,
            timeSlot: formData.timeSlot,
            paymentMethod: formData.paymentMethod,
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
      {/* ── COMPACT PAGE HEADER ── */}
      <header className="booking-page-header">
        <div className="booking-header-inner">
          <div className="booking-breadcrumb">
            <span onClick={() => navigate("/")} className="bc-link">Home</span>
            <ChevronRight size={13} className="bc-sep" />
            <span onClick={() => navigate("/halls")} className="bc-link">Halls</span>
            <ChevronRight size={13} className="bc-sep" />
            <span
              onClick={() => navigate(`/halls/${hall.hallID}`, { state: { hall } })}
              className="bc-link"
            >
              {hall.name}
            </span>
            <ChevronRight size={13} className="bc-sep" />
            <span className="bc-current">Book</span>
          </div>
          <div className="booking-header-title">
            <Sparkles size={15} className="header-sparkle" />
            <span>Reserve <strong>{hall.name}</strong></span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="booking-steps">
          {STEPS.map((s, idx) => {
            const num = idx + 1;
            const isCompleted = step > num;
            const isActive = step === num;
            return (
              <React.Fragment key={num}>
                <div
                  className={`bstep${isActive ? " bstep--active" : ""}${isCompleted ? " bstep--done" : ""}`}
                >
                  <div className="bstep__circle">
                    {isCompleted ? <Check size={14} strokeWidth={3} /> : num}
                  </div>
                  <span className="bstep__label">{s.label}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`bstep__connector${isCompleted ? " bstep__connector--done" : ""}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="booking-container">
        <div className="booking-layout">
          {/* ════ LEFT: STEP FORMS ════ */}
          <div className="booking-form-col">

            {/* ── STEP 1: Event Details ── */}
            {step === 1 && (
              <div className="booking-step-card" key="step1">
                <div className="step-card-header">
                  <div className="step-card-num">01</div>
                  <div>
                    <h2 className="step-card-title">Event Details</h2>
                    <p className="step-card-sub">Tell us about yourself and your event</p>
                  </div>
                </div>

                {Object.keys(errors).length > 0 && (
                  <div className="global-error">
                    <AlertCircle size={15} />
                    Please fix the errors below before continuing
                  </div>
                )}

                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your full legal name"
                      className={errors.fullName ? "input-error" : ""}
                    />
                    {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={errors.email ? "input-error" : ""}
                    />
                    {errors.email && <span className="error-msg">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      name="phone"
                      type="text"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="03001234567"
                      className={errors.phone ? "input-error" : ""}
                    />
                    {errors.phone && <span className="error-msg">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label>CNIC Number *</label>
                    <input
                      name="cnic"
                      type="text"
                      value={formatCNIC(formData.cnic)}
                      onChange={handleChange}
                      placeholder="12345-1234567-1"
                      className={errors.cnic ? "input-error" : ""}
                    />
                    {errors.cnic && <span className="error-msg">{errors.cnic}</span>}
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
                    <label>Number of Guests *</label>
                    <input
                      name="guestCount"
                      type="number"
                      value={formData.guestCount}
                      onChange={handleChange}
                      max={hall.capacity}
                      placeholder={`Max ${hall.capacity}`}
                      className={errors.guestCount ? "input-error" : ""}
                    />
                    {errors.guestCount && <span className="error-msg">{errors.guestCount}</span>}
                  </div>

                  <div className="form-group full">
                    <label>Special Requests (optional)</label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      placeholder="Any special arrangements, dietary requirements, or notes..."
                      rows={3}
                    />
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
                  <span />
                  <button
                    className="btn-cta"
                    onClick={() => validateStep1() && setStep(2)}
                  >
                    Continue to Date & Time <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Date & Time / Availability ── */}
            {step === 2 && (
              <div className="booking-step-card" key="step2">
                <div className="step-card-header">
                  <div className="step-card-num">02</div>
                  <div>
                    <h2 className="step-card-title">Date &amp; Time</h2>
                    <p className="step-card-sub">Choose your event date and preferred time slot</p>
                  </div>
                </div>

                {errors.availability && (
                  <div className="global-error">
                    <AlertCircle size={15} /> {errors.availability}
                  </div>
                )}

                <div className="date-time-grid">
                  <div className="form-group">
                    <label>Event Date *</label>
                    <input
                      name="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => {
                        handleChange(e);
                        setIsAvailable(null);
                        setConflictDate(null);
                      }}
                      min={new Date().toISOString().split("T")[0]}
                      className={errors.eventDate ? "input-error" : ""}
                    />
                    {errors.eventDate && <span className="error-msg">{errors.eventDate}</span>}
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
                </div>

                {/* Availability Result Panel */}
                <div className="availability-area">
                  {isAvailable === null && !isLoading && (
                    <div className="av-card av-card--pending">
                      <div className="av-icon">
                        <CalendarDays size={36} />
                      </div>
                      <h3>Verify Your Date</h3>
                      <p>
                        Select a date above and click below to confirm{" "}
                        <strong>{hall.name}</strong> is available
                        {formData.eventDate ? (
                          <> on <strong>{formattedDate}</strong></>
                        ) : null}
                        .
                      </p>
                      <button
                        className="btn-cta av-btn"
                        onClick={checkAvailability}
                        disabled={!formData.eventDate}
                      >
                        <ShieldCheck size={16} /> Check Availability
                      </button>
                    </div>
                  )}

                  {isLoading && (
                    <div className="av-card av-card--loading">
                      <div className="bp-spinner" />
                      <p>Checking availability for {formattedDate}…</p>
                    </div>
                  )}

                  {isAvailable === true && (
                    <div className="av-card av-card--success">
                      <div className="av-icon av-icon--success">
                        <Check size={32} strokeWidth={3} />
                      </div>
                      <h3>Hall is Available!</h3>
                      <p>
                        <strong>{hall.name}</strong> is free on{" "}
                        <strong>{formattedDate}</strong>. Proceed to secure
                        your booking.
                      </p>
                      <button
                        className="btn-cta av-btn"
                        onClick={() => setStep(3)}
                      >
                        Proceed to Payment <ChevronRight size={16} />
                      </button>
                    </div>
                  )}

                  {isAvailable === false && (
                    <div className="av-card av-card--error">
                      <div className="av-icon av-icon--error">
                        <AlertCircle size={32} />
                      </div>
                      <h3>Not Available</h3>
                      <p>
                        {conflictDate
                          ? <>
                              <strong>{hall.name}</strong> is already booked
                              on <strong>{formattedDate}</strong>. Please
                              choose another date.
                            </>
                          : <>That date has already passed. Please choose a future date.</>
                        }
                      </p>
                      <button
                        className="btn-ghost av-btn"
                        onClick={() => {
                          setIsAvailable(null);
                          setConflictDate(null);
                        }}
                      >
                        Choose Another Date
                      </button>
                    </div>
                  )}
                </div>

                <div className="step-actions">
                  <button className="btn-ghost" onClick={() => setStep(1)}>
                    <ChevronLeft size={16} /> Back
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Payment ── */}
            {step === 3 && (
              <div className="booking-step-card" key="step3">
                <div className="step-card-header">
                  <div className="step-card-num">03</div>
                  <div>
                    <h2 className="step-card-title">Payment</h2>
                    <p className="step-card-sub">Choose how you'd like to pay your advance</p>
                  </div>
                </div>

                {/* Payment Method Toggle */}
                <div className="pay-method-toggle">
                  <div
                    className={`pay-method-card${formData.paymentMethod === "Online" ? " pay-method-card--active" : ""}`}
                    onClick={() => setFormData({ ...formData, paymentMethod: "Online" })}
                  >
                    <div className="pay-method-icon">
                      <CreditCard size={22} />
                    </div>
                    <div className="pay-method-info">
                      <span className="pay-method-name">Online Payment</span>
                      <span className="pay-method-desc">Debit / Credit card</span>
                    </div>
                    <div className="pay-method-radio">
                      {formData.paymentMethod === "Online" && <div className="pay-radio-dot" />}
                    </div>
                  </div>

                  <div
                    className={`pay-method-card${formData.paymentMethod === "Bank" ? " pay-method-card--active" : ""}`}
                    onClick={() => setFormData({ ...formData, paymentMethod: "Bank" })}
                  >
                    <div className="pay-method-icon">
                      <Building2 size={22} />
                    </div>
                    <div className="pay-method-info">
                      <span className="pay-method-name">Bank Transfer</span>
                      <span className="pay-method-desc">HBL / Meezan Bank</span>
                    </div>
                    <div className="pay-method-radio">
                      {formData.paymentMethod === "Bank" && <div className="pay-radio-dot" />}
                    </div>
                  </div>
                </div>

                {/* Online Card Form */}
                {formData.paymentMethod === "Online" && (
                  <div className="payment-form-area">
                    {/* Card Preview */}
                    <div className="card-preview">
                      <div className="card-chip" />
                      <p className="card-number-display">
                        {formatCard(formData.cardNumber) || "•••• •••• •••• ••••"}
                      </p>
                      <div className="card-meta">
                        <span className="card-holder-label">Card Holder</span>
                        <span className="card-exp-label">Expires</span>
                      </div>
                      <div className="card-meta card-meta--vals">
                        <span className="card-name-display">
                          {formData.cardName || "YOUR NAME"}
                        </span>
                        <span className="card-exp-display">
                          {formData.expiry || "MM/YY"}
                        </span>
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group full">
                        <label>Cardholder Name</label>
                        <input
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          placeholder="Name on card"
                          className={errors.cardName ? "input-error" : ""}
                        />
                        {errors.cardName && <span className="error-msg">{errors.cardName}</span>}
                      </div>
                      <div className="form-group full">
                        <label>Card Number</label>
                        <input
                          name="cardNumber"
                          value={formatCard(formData.cardNumber)}
                          onChange={handleChange}
                          placeholder="1234 5678 9012 3456"
                          className={errors.cardNumber ? "input-error" : ""}
                        />
                        {errors.cardNumber && <span className="error-msg">{errors.cardNumber}</span>}
                      </div>
                      <div className="form-group">
                        <label>Expiry (MM/YY)</label>
                        <input
                          name="expiry"
                          value={formData.expiry}
                          onChange={handleChange}
                          placeholder="12/27"
                          className={errors.expiry ? "input-error" : ""}
                        />
                        {errors.expiry && <span className="error-msg">{errors.expiry}</span>}
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input
                          name="cvv"
                          type="password"
                          value={formData.cvv}
                          onChange={handleChange}
                          placeholder="•••"
                          className={errors.cvv ? "input-error" : ""}
                        />
                        {errors.cvv && <span className="error-msg">{errors.cvv}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Transfer Form */}
                {formData.paymentMethod === "Bank" && (
                  <div className="payment-form-area">
                    <div className="bank-info-box">
                      <div className="bank-info-row">
                        <Banknote size={15} className="bank-info-icon" />
                        <span className="bank-info-key">Bank</span>
                        <span className="bank-info-val">HBL / Meezan Bank</span>
                      </div>
                      <div className="bank-info-row">
                        <Building2 size={15} className="bank-info-icon" />
                        <span className="bank-info-key">Account</span>
                        <span className="bank-info-val">Elegant Celebrations Pvt Ltd</span>
                      </div>
                      <div className="bank-info-row">
                        <ShieldCheck size={15} className="bank-info-icon" />
                        <span className="bank-info-key">IBAN</span>
                        <span className="bank-info-val bank-iban">PK36MEZN0001234567890123</span>
                      </div>
                      <div className="bank-note">
                        Transfer exactly{" "}
                        <strong className="bank-note-amount">Rs {advance.toLocaleString()}</strong>{" "}
                        and upload your payment receipt below.
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: "20px" }}>
                      <label>Transaction Reference *</label>
                      <input
                        name="transactionRef"
                        value={formData.transactionRef}
                        onChange={handleChange}
                        placeholder="e.g. TXN123456789"
                        className={errors.transactionRef ? "input-error" : ""}
                      />
                      {errors.transactionRef && (
                        <span className="error-msg">{errors.transactionRef}</span>
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
                                <Check size={14} /> Receipt Uploaded — click to change
                              </p>
                            </div>
                          ) : (
                            <>
                              <Upload size={28} className="upload-icon" />
                              <p className="upload-label-text">Upload Payment Receipt</p>
                              <span className="upload-hint">JPG, PNG or PDF — max 2MB</span>
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
                  <div className="global-error" style={{ marginTop: "20px" }}>
                    <AlertCircle size={15} /> {errors.submit}
                  </div>
                )}

                <div className="step-actions">
                  <button
                    className="btn-ghost"
                    onClick={() => setStep(2)}
                    disabled={submitting}
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button
                    className="btn-cta confirm-btn"
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

          {/* ════ RIGHT: STICKY SUMMARY ════ */}
          <aside className="booking-summary">
            <div className="summary-hall-block">
              <img
                src={hall.imageURL}
                alt={hall.name}
                className="summary-hall-img"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400";
                }}
              />
              <div className="summary-hall-info">
                <h3 className="summary-hall-name">{hall.name}</h3>
                <p className="summary-hall-loc">
                  <MapPin size={12} /> {hall.location}
                </p>
              </div>
            </div>

            <div className="summary-divider" />

            <div className="summary-meta">
              {formData.eventDate && (
                <div className="summary-meta-row">
                  <CalendarDays size={14} />
                  <span>{formattedDate}</span>
                </div>
              )}
              <div className="summary-meta-row">
                <Clock size={14} />
                <span>{formData.timeSlot}</span>
              </div>
              <div className="summary-meta-row">
                <Users size={14} />
                <span>{formData.guestCount} Guests</span>
              </div>
              <div className="summary-meta-row">
                <Package size={14} />
                <span>{selectedPkg?.name || "No Package Selected"}</span>
              </div>
            </div>

            <div className="summary-divider" />

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
              <div className="price-row price-row--total">
                <span>Total Amount</span>
                <span>Rs {total?.toLocaleString()}</span>
              </div>
              <div className="price-row price-row--advance">
                <span>Advance Due (30%)</span>
                <span>Rs {advance?.toLocaleString()}</span>
              </div>
              <div className="price-row price-row--balance">
                <span>Balance Remaining</span>
                <span>Rs {balance?.toLocaleString()}</span>
              </div>
            </div>

            <div className="summary-secure-note">
              <ShieldCheck size={13} />
              <span>Your booking is secured with 256-bit encryption</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
