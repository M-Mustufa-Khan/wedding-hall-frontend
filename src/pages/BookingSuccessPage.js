import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Calendar,
  Home,
  Download,
  MapPin,
  Users,
  Package,
  CreditCard,
  Hash,
  Mail,
  Phone,
  PartyPopper,
} from "lucide-react";
import "./BookingSuccessPage.css";

/* ---------- floating particle helper ---------- */
const PARTICLE_COUNT = 22;
const GOLD_SHADES = ["#d4af37", "#f4d03f", "#e8c97a", "#b8960c", "#fdeea3"];

const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: `${4 + Math.random() * 6}px`,
  color: GOLD_SHADES[i % GOLD_SHADES.length],
  duration: `${6 + Math.random() * 10}s`,
  delay: `${Math.random() * 8}s`,
  shape: i % 3 === 0 ? "diamond" : i % 3 === 1 ? "circle" : "bar",
}));

/* ---------- component ---------- */
const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  /* Bug-fix preserved: never call navigate() directly in render body */
  useEffect(() => {
    if (!booking) navigate("/", { replace: true });
  }, [booking, navigate]);

  if (!booking) return null;

  /* ── helpers (all bug-fixes from original preserved) ── */
  const safe = (val, fallback = "—") =>
    val === undefined || val === null || val === "" ? fallback : val;

  /* Bug-fix preserved: API returns bookingID not id */
  const displayId = booking.bookingID ?? booking.id ?? "—";

  const formattedDate = booking.eventDate
    ? new Date(booking.eventDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const balanceDue =
    booking.balanceDue ??
    (booking.totalAmount != null && booking.advancePaid != null
      ? booking.totalAmount - booking.advancePaid
      : null);

  const guestCount = safe(booking.guestCount ?? booking.guests);

  /* ── render ── */
  return (
    <div className="bsp-page">
      {/* ── floating particles ── */}
      <div className="bsp-particles" aria-hidden="true">
        {particles.map((p) => (
          <span
            key={p.id}
            className={`bsp-particle bsp-particle--${p.shape}`}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: p.color,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* ── centre layout ── */}
      <div className="bsp-layout">

        {/* ════ SUCCESS CARD ════ */}
        <div className="bsp-card">

          {/* checkmark */}
          <div className="bsp-check-wrap">
            <div className="bsp-check-ring bsp-check-ring--outer" />
            <div className="bsp-check-ring bsp-check-ring--inner" />
            <div className="bsp-check-circle">
              <CheckCircle size={42} strokeWidth={2.2} />
            </div>
          </div>

          {/* heading */}
          <h1 className="bsp-heading">Booking Confirmed!</h1>
          <p className="bsp-subtext">Your celebration is now reserved</p>

          {/* booking ID pill */}
          <div className="bsp-id-pill">
            <Hash size={13} />
            <span>Booking ID</span>
            <strong>{displayId}</strong>
          </div>

          {/* gold divider */}
          <div className="bsp-divider" aria-hidden="true" />

          {/* ── booking details grid ── */}
          <div className="bsp-details">

            <div className="bsp-detail-row">
              <span className="bsp-detail-label">
                <MapPin size={13} /> Hall Name
              </span>
              <span className="bsp-detail-value">{safe(booking.hallName)}</span>
            </div>

            <div className="bsp-detail-row">
              <span className="bsp-detail-label">
                <MapPin size={13} /> Location
              </span>
              <span className="bsp-detail-value">{safe(booking.hallLocation)}</span>
            </div>

            <div className="bsp-detail-row">
              <span className="bsp-detail-label">
                <Calendar size={13} /> Event Date
              </span>
              <span className="bsp-detail-value">{formattedDate}</span>
            </div>

            <div className="bsp-detail-row">
              <span className="bsp-detail-label">
                <Calendar size={13} /> Time Slot
              </span>
              <span className="bsp-detail-value">{safe(booking.timeSlot)}</span>
            </div>

            <div className="bsp-detail-row">
              <span className="bsp-detail-label">
                <Users size={13} /> Guests
              </span>
              <span className="bsp-detail-value">{guestCount}</span>
            </div>

            <div className="bsp-detail-row">
              <span className="bsp-detail-label">
                <Package size={13} /> Package
              </span>
              <span className="bsp-detail-value">
                {safe(booking.packageName, "No Package")}
              </span>
            </div>

            <div className="bsp-detail-row">
              <span className="bsp-detail-label">
                <CreditCard size={13} /> Payment Method
              </span>
              <span className="bsp-detail-value">{safe(booking.paymentMethod)}</span>
            </div>

            {/* financial rows */}
            <div className="bsp-detail-row bsp-detail-row--gold">
              <span className="bsp-detail-label">
                <CreditCard size={13} /> Total Amount
              </span>
              <span className="bsp-detail-value bsp-val--gold">
                Rs {(booking.totalAmount ?? 0).toLocaleString()}
              </span>
            </div>

            <div className="bsp-detail-row">
              <span className="bsp-detail-label">
                <CreditCard size={13} /> Advance Paid
              </span>
              <span className="bsp-detail-value bsp-val--green">
                Rs {(booking.advancePaid ?? 0).toLocaleString()}
              </span>
            </div>

            {balanceDue != null && (
              <div className="bsp-detail-row">
                <span className="bsp-detail-label">
                  <CreditCard size={13} /> Balance Due
                </span>
                <span className="bsp-detail-value bsp-val--amber">
                  Rs {balanceDue.toLocaleString()}
                </span>
              </div>
            )}

            {/* status badge */}
            <div className="bsp-detail-row bsp-detail-row--status">
              <span className="bsp-detail-label">Status</span>
              <span className="bsp-status-badge">
                <span className="bsp-status-dot" />
                Confirmed
              </span>
            </div>
          </div>

          {/* ── action buttons ── */}
          <div className="bsp-actions">
            <button
              className="bsp-btn bsp-btn--cta"
              onClick={() => navigate("/my-bookings")}
            >
              <Calendar size={16} />
              View My Bookings
            </button>

            <button
              className="bsp-btn bsp-btn--ghost"
              onClick={() => navigate("/halls")}
            >
              <Home size={16} />
              Browse More Halls
            </button>

            <button
              className="bsp-btn bsp-btn--ghost"
              onClick={() => window.print()}
              title="Download / Print Receipt"
            >
              <Download size={16} />
              Download Receipt
            </button>
          </div>
        </div>

        {/* ════ WHAT'S NEXT SECTION ════ */}
        <div className="bsp-next">
          <h2 className="bsp-next-heading">
            <PartyPopper size={20} />
            What&rsquo;s Next?
          </h2>

          <ol className="bsp-steps">
            <li className="bsp-step">
              <span className="bsp-step-num">1</span>
              <div className="bsp-step-body">
                <Mail size={15} className="bsp-step-icon" />
                <div>
                  <strong>Check your email for confirmation</strong>
                  <p>
                    A detailed confirmation email will be sent to your registered
                    address within a few minutes.
                  </p>
                </div>
              </div>
            </li>

            <li className="bsp-step">
              <span className="bsp-step-num">2</span>
              <div className="bsp-step-body">
                <Phone size={15} className="bsp-step-icon" />
                <div>
                  <strong>Our team will contact you</strong>
                  <p>
                    An Elegant Celebrations coordinator will reach out within 24
                    hours to finalise your event details.
                  </p>
                </div>
              </div>
            </li>

            <li className="bsp-step">
              <span className="bsp-step-num">3</span>
              <div className="bsp-step-body">
                <PartyPopper size={15} className="bsp-step-icon" />
                <div>
                  <strong>Enjoy your celebration!</strong>
                  <p>
                    Arrive at the hall and let us take care of the rest — your
                    perfect day awaits.
                  </p>
                </div>
              </div>
            </li>
          </ol>
        </div>

      </div>
    </div>
  );
};

export default BookingSuccessPage;
