import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Users,
  Star,
  Snowflake,
  Car,
  Music,
  Camera,
  Droplets,
  Heart,
  Grid,
  ArrowLeft,
  Phone,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  Sparkles,
  Wifi,
  Shield,
  Utensils,
} from "lucide-react";
import { getHallById } from "../services/api";
import "./HallDetailPage.css";

const HallDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hall, setHall] = useState(null);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  // ── Wishlist state — reads from localStorage on mount ──
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishToast, setWishToast] = useState("");

  // ── Check if this hall is already in wishlist ──
  const checkWishlist = useCallback((hallID) => {
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsWishlisted(saved.some((h) => String(h.hallID) === String(hallID)));
  }, []);

  const loadHall = useCallback(async () => {
    try {
      const res = await getHallById(id);
      setHall(res.data);
      if (res.data.packages?.length > 0) setSelectedPkg(res.data.packages[0]);
      checkWishlist(res.data.hallID);
    } catch {
      const sample = {
        hallID: id,
        name: "Grand Royal Hall",
        capacity: 500,
        pricePerDay: 150000,
        location: "Lahore",
        address: "123 Mall Road, Lahore",
        phone: "+92 300 1234567",
        description:
          "A luxurious hall with crystal chandeliers and marble flooring. Perfect for grand weddings with VIP lounge, premium sound system, and dedicated bridal room. Our experienced team ensures every detail of your special day is handled with the utmost care and professionalism.",
        imageURL:
          "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
        packages: [
          {
            packageID: 1,
            name: "Royal Premium",
            description: "Full decoration + catering + photography",
            price: 200000,
            includes: "Decoration,Catering,Photography,Sound System",
          },
          {
            packageID: 2,
            name: "Royal Basic",
            description: "Hall only with basic setup",
            price: 150000,
            includes: "Basic Setup,Sound System",
          },
        ],
      };
      setHall(sample);
      setSelectedPkg(sample.packages[0]);
      checkWishlist(sample.hallID);
    }
  }, [id, checkWishlist]);

  useEffect(() => {
    loadHall();
  }, [loadHall]);

  // ── Toggle wishlist — add or remove ──
  const handleWishlist = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      navigate("/login");
      return;
    }

    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const already = saved.some((h) => String(h.hallID) === String(hall.hallID));

    let updated;
    if (already) {
      updated = saved.filter((h) => String(h.hallID) !== String(hall.hallID));
      setIsWishlisted(false);
      showToast("Removed from wishlist");
    } else {
      updated = [
        ...saved,
        {
          hallID: hall.hallID,
          name: hall.name,
          location: hall.location,
          imageURL: hall.imageURL,
          pricePerDay: hall.pricePerDay,
        },
      ];
      setIsWishlisted(true);
      showToast("Added to wishlist! View it in your Profile.");
    }

    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  // ── Toast notification ──
  const showToast = (msg) => {
    setWishToast(msg);
    setTimeout(() => setWishToast(""), 3000);
  };

  // ── Keyboard navigation for lightbox ──
  useEffect(() => {
    if (!lightbox.open || !hall) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setLightbox((lb) => ({ ...lb, open: false }));
      if (e.key === "ArrowLeft")
        setLightbox((lb) => ({
          ...lb,
          index: (lb.index - 1 + galleryImages.length) % galleryImages.length,
        }));
      if (e.key === "ArrowRight")
        setLightbox((lb) => ({
          ...lb,
          index: (lb.index + 1) % galleryImages.length,
        }));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox.open]);

  if (!hall)
    return (
      <div className="detail-skeleton-page">
        <div className="detail-skel detail-skel-hero" />
        <div className="detail-skel-content">
          <div className="detail-skel-left">
            <div className="detail-skel detail-skel-line" style={{ width: "55%", height: "32px" }} />
            <div className="detail-skel detail-skel-line" style={{ width: "40%" }} />
            <div className="detail-skel detail-skel-line" style={{ width: "100%" }} />
            <div className="detail-skel detail-skel-line" style={{ width: "95%" }} />
            <div className="detail-skel detail-skel-line" style={{ width: "80%" }} />
            <div className="detail-skel detail-skel-line" style={{ width: "60%", marginTop: "16px" }} />
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="detail-skel" style={{ width: "90px", height: "80px", borderRadius: "12px" }} />
              ))}
            </div>
          </div>
          <div className="detail-skel detail-skel-card" />
        </div>
      </div>
    );

  // ── Gallery images ──
  const PLACEHOLDER_IMAGES = [
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800",
    "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
  ];
  const realImages = [
    hall.imageURL,
    ...(hall.images
      ?.filter((img) => img.imageURL && !img.isPrimary)
      .map((img) => img.imageURL) || []),
  ].filter(Boolean);
  const galleryImages = [...realImages];
  for (const ph of PLACEHOLDER_IMAGES) {
    if (galleryImages.length >= 5) break;
    if (!galleryImages.includes(ph)) galleryImages.push(ph);
  }

  // ── Dynamic pricing ──
  const hallFee = hall.pricePerDay;
  const pkgFee = selectedPkg?.price || 0;
  const tax = Math.round((hallFee + pkgFee) * 0.1);
  const total = hallFee + pkgFee + tax;

  const amenities = [
    { icon: <Snowflake size={20} />, name: "Air Conditioning" },
    { icon: <Car size={20} />, name: "Parking" },
    { icon: <Music size={20} />, name: "DJ System" },
    { icon: <Camera size={20} />, name: "Photography" },
    { icon: <Droplets size={20} />, name: "Catering" },
    { icon: <Wifi size={20} />, name: "Free WiFi" },
    { icon: <Shield size={20} />, name: "Security" },
    { icon: <Utensils size={20} />, name: "Kitchen" },
  ];

  const heroStyle = {
    backgroundImage: `url(${hall.imageURL || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400"})`,
  };

  return (
    <div className="detail-page">
      {/* ── Toast notification ── */}
      {wishToast && (
        <div className="wish-toast">
          <Heart size={15} fill={isWishlisted ? "#d4af37" : "none"} />
          {wishToast}
          {isWishlisted && (
            <button className="wish-toast-link" onClick={() => navigate("/profile")}>
              Go to Profile →
            </button>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════
          HERO — full-width image + overlaid info
         ══════════════════════════════════════ */}
      <section className="hall-detail-hero" style={heroStyle}>
        {/* dark gradient from bottom */}
        <div className="hero-gradient" aria-hidden="true" />

        {/* Top controls */}
        <div className="hero-top-controls">
          <button className="hero-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            className={`hero-wish-btn${isWishlisted ? " active" : ""}`}
            onClick={handleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={18}
              fill={isWishlisted ? "#d4af37" : "none"}
              stroke={isWishlisted ? "#d4af37" : "currentColor"}
            />
          </button>
        </div>

        {/* Bottom-left: title + location + rating */}
        <div className="hero-bottom-info">
          <h1 className="hero-hall-name">{hall.name}</h1>
          <div className="hero-meta-row">
            <span className="hero-location-pill">
              <MapPin size={13} />
              {hall.location}
            </span>
            <span className="hero-rating">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={14}
                  fill={s <= 4 ? "#d4af37" : "none"}
                  stroke="#d4af37"
                />
              ))}
              <span className="hero-rating-text">4.8 (124 reviews)</span>
            </span>
          </div>
        </div>

        {/* Gallery trigger strip */}
        <button
          className="hero-gallery-btn"
          onClick={() => setLightbox({ open: true, index: 0 })}
        >
          <Grid size={15} />
          View all {galleryImages.length} photos
        </button>
      </section>

      {/* ══════════════════════════════════════
          BODY — two-column layout
         ══════════════════════════════════════ */}
      <div className="detail-container">
        <div className="detail-body-grid">

          {/* ─── LEFT COLUMN ─── */}
          <div className="detail-left-col">

            {/* ── About This Hall ── */}
            <div className="detail-card">
              <div className="detail-card-header">
                <Sparkles size={18} className="card-header-icon" />
                <h2 className="detail-card-title">About This Hall</h2>
              </div>
              <p className="detail-about-text">{hall.description}</p>

              {/* Key specs row */}
              <div className="specs-row">
                <div className="spec-item">
                  <Users size={22} className="spec-icon" />
                  <div className="spec-info">
                    <span className="spec-value">{hall.capacity}</span>
                    <span className="spec-label">Max Guests</span>
                  </div>
                </div>
                <div className="spec-divider" />
                <div className="spec-item">
                  <DollarSign size={22} className="spec-icon" />
                  <div className="spec-info">
                    <span className="spec-value">Rs {hall.pricePerDay?.toLocaleString()}</span>
                    <span className="spec-label">Per Day</span>
                  </div>
                </div>
                <div className="spec-divider" />
                <div className="spec-item">
                  <MapPin size={22} className="spec-icon" />
                  <div className="spec-info">
                    <span className="spec-value">{hall.location}</span>
                    <span className="spec-label">Location</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Amenities ── */}
            <div className="detail-card">
              <div className="detail-card-header">
                <CheckCircle size={18} className="card-header-icon" />
                <h2 className="detail-card-title">Amenities</h2>
              </div>
              <div className="amenities-grid">
                {amenities.map((a, i) => (
                  <div key={i} className="amenity-pill">
                    <span className="amenity-icon">{a.icon}</span>
                    <span className="amenity-name">{a.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Available Packages ── */}
            {hall.packages?.length > 0 && (
              <div className="detail-card">
                <div className="detail-card-header">
                  <Star size={18} className="card-header-icon" />
                  <h2 className="detail-card-title">Available Packages</h2>
                </div>
                <p className="detail-card-sub">Select a package to include in your booking</p>
                <div className="packages-grid">
                  {hall.packages.map((pkg) => (
                    <div
                      key={pkg.packageID}
                      className={`package-card${selectedPkg?.packageID === pkg.packageID ? " active" : ""}`}
                      onClick={() => setSelectedPkg(pkg)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setSelectedPkg(pkg)}
                    >
                      {selectedPkg?.packageID === pkg.packageID && (
                        <span className="pkg-selected-badge">Selected</span>
                      )}
                      <h3 className="pkg-name">{pkg.name}</h3>
                      <p className="pkg-price">Rs {pkg.price?.toLocaleString()}</p>
                      <p className="pkg-desc">{pkg.description}</p>
                      <div className="pkg-includes">
                        {pkg.includes?.split(",").map((item, i) => (
                          <span key={i} className="include-tag">
                            <CheckCircle size={11} />
                            {item.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Location & Map ── */}
            <div className="detail-card">
              <div className="detail-card-header">
                <MapPin size={18} className="card-header-icon" />
                <h2 className="detail-card-title">Location &amp; Address</h2>
              </div>
              {/* Map placeholder */}
              <div className="map-placeholder">
                <div className="map-placeholder-inner">
                  <MapPin size={32} className="map-pin-icon" />
                  <span className="map-placeholder-text">Interactive map coming soon</span>
                </div>
              </div>
              <div className="address-row">
                <MapPin size={15} className="address-icon" />
                <span className="address-text">{hall.address || `${hall.location}, Pakistan`}</span>
              </div>
            </div>

          </div>
          {/* ─── END LEFT COLUMN ─── */}

          {/* ─── RIGHT COLUMN (sticky sidebar) ─── */}
          <aside className="detail-right-col">
            <div className="booking-sidebar-card">
              {/* Gold top accent */}
              <div className="sidebar-top-accent" aria-hidden="true" />

              {/* Price display */}
              <div className="sidebar-price-block">
                <span className="sidebar-price-label">Starting from</span>
                <div className="sidebar-price-main">
                  <span className="sidebar-price-amount">
                    Rs {hall.pricePerDay?.toLocaleString()}
                  </span>
                  <span className="sidebar-price-unit">/day</span>
                </div>
              </div>

              {/* Rating row */}
              <div className="sidebar-rating-row">
                <div className="sidebar-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={13}
                      fill={s <= 4 ? "#d4af37" : "none"}
                      stroke="#d4af37"
                    />
                  ))}
                </div>
                <span className="sidebar-rating-text">4.8 · 124 reviews</span>
              </div>

              <div className="sidebar-divider" />

              {/* Price breakdown */}
              {selectedPkg && (
                <div className="sidebar-breakdown">
                  <div className="breakdown-row">
                    <span>Hall fee</span>
                    <span>Rs {hallFee?.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Package ({selectedPkg.name})</span>
                    <span>Rs {pkgFee?.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-row tax">
                    <span>Tax (10%)</span>
                    <span>Rs {tax?.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-row total">
                    <span>Total estimate</span>
                    <span>Rs {total?.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Book button */}
              <button
                className="sidebar-book-btn"
                onClick={() => {
                  const user = localStorage.getItem("user");
                  if (!user) {
                    navigate("/login", {
                      state: {
                        from: `/book/${hall.hallID}`,
                        state: { hall, package: selectedPkg },
                      },
                    });
                  } else {
                    navigate(`/book/${hall.hallID}`, {
                      state: { hall, package: selectedPkg },
                    });
                  }
                }}
              >
                Book This Hall
              </button>

              {/* Wishlist button */}
              <button
                className={`sidebar-wish-btn${isWishlisted ? " wishlisted" : ""}`}
                onClick={handleWishlist}
              >
                <Heart
                  size={16}
                  fill={isWishlisted ? "#d4af37" : "none"}
                  stroke={isWishlisted ? "#d4af37" : "currentColor"}
                />
                {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>

              <div className="sidebar-divider" />

              {/* Contact info */}
              {hall.phone && (
                <div className="sidebar-contact-row">
                  <Phone size={15} className="sidebar-contact-icon" />
                  <span className="sidebar-contact-text">{hall.phone}</span>
                </div>
              )}

              {/* Available dates note */}
              <div className="sidebar-contact-row">
                <Calendar size={15} className="sidebar-contact-icon" />
                <span className="sidebar-contact-text">Check availability at booking</span>
              </div>

              <p className="sidebar-note">30% advance payment required at booking</p>
            </div>
          </aside>
          {/* ─── END RIGHT COLUMN ─── */}

        </div>
      </div>

      {/* ══════════════════════════════════════
          LIGHTBOX MODAL
         ══════════════════════════════════════ */}
      {lightbox.open && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightbox((lb) => ({ ...lb, open: false }))}
        >
          <div className="lightbox-modal" onClick={(e) => e.stopPropagation()}>
            {/* Top bar */}
            <div className="lightbox-topbar">
              <span className="lightbox-counter">
                {lightbox.index + 1} / {galleryImages.length}
              </span>
              <button
                className="lightbox-close"
                onClick={() => setLightbox((lb) => ({ ...lb, open: false }))}
                aria-label="Close lightbox"
              >
                <X size={18} />
              </button>
            </div>

            {/* Stage */}
            <div className="lightbox-stage">
              <button
                className="lightbox-arrow"
                onClick={() =>
                  setLightbox((lb) => ({
                    ...lb,
                    index: (lb.index - 1 + galleryImages.length) % galleryImages.length,
                  }))
                }
                aria-label="Previous image"
              >
                <ChevronLeft size={26} />
              </button>

              <img
                src={galleryImages[lightbox.index]}
                alt={`Gallery ${lightbox.index + 1}`}
                className="lightbox-img"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800";
                }}
              />

              <button
                className="lightbox-arrow"
                onClick={() =>
                  setLightbox((lb) => ({
                    ...lb,
                    index: (lb.index + 1) % galleryImages.length,
                  }))
                }
                aria-label="Next image"
              >
                <ChevronRight size={26} />
              </button>
            </div>

            {/* Thumbnail strip */}
            <div className="lightbox-thumbs">
              {galleryImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Thumb ${i + 1}`}
                  className={`lightbox-thumb${lightbox.index === i ? " active" : ""}`}
                  onClick={() => setLightbox((lb) => ({ ...lb, index: i }))}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800";
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallDetailPage;
