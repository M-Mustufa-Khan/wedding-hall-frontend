import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { getHallById } from "../services/api";
import "./HallDetailPage.css";

const HallDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hall, setHall] = useState(null);
  const [selectedPkg, setSelectedPkg] = useState(null);

  useEffect(() => {
    loadHall();
  }, [id]);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  const galleryImages = [
    hall?.imageURL,
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800",
    "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
  ];
  const loadHall = async () => {
    try {
      const res = await getHallById(id);
      setHall(res.data);
      if (res.data.packages?.length > 0) setSelectedPkg(res.data.packages[0]);
    } catch {
      const sample = {
        hallID: id,
        name: "Grand Royal Hall",
        capacity: 500,
        pricePerDay: 150000,
        location: "Lahore",
        address: "123 Mall Road, Lahore",
        description:
          "A luxurious hall with crystal chandeliers and marble flooring. Perfect for grand weddings with VIP lounge, premium sound system, and dedicated bridal room.",
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
    }
  };

  if (!hall) return <div className="loading">Loading...</div>;

  // DYNAMIC PRICING (Updates automatically when selectedPkg changes)
  const hallFee = hall.pricePerDay;
  const pkgFee = selectedPkg?.price || 0;
  const tax = Math.round((hallFee + pkgFee) * 0.1);
  const total = hallFee + pkgFee + tax;

  const amenities = [
    { icon: <Snowflake size={20} />, name: "AC" },
    { icon: <Car size={20} />, name: "Parking" },
    { icon: <Music size={20} />, name: "DJ" },
    { icon: <Camera size={20} />, name: "Photography" },
    { icon: <Droplets size={20} />, name: "Catering" },
  ];

  return (
    <div className="detail-page">
      {/* IMAGE GALLERY */}
      {/* IMAGE GALLERY */}
      <div className="detail-gallery">
        <div
          className="gallery-main"
          onClick={() => setLightbox({ open: true, index: 0 })}
        >
          <img
            src={hall.imageURL}
            alt={hall.name}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800";
            }}
          />
          <div className="gallery-main-overlay">🔍 Click to view</div>
        </div>
        <div className="gallery-thumbs">
          <img
            src={galleryImages[1]}
            alt="Thumb 1"
            onClick={() => setLightbox({ open: true, index: 1 })}
          />
          <img
            src={galleryImages[2]}
            alt="Thumb 2"
            onClick={() => setLightbox({ open: true, index: 2 })}
          />
          <img
            src={galleryImages[3]}
            alt="Thumb 3"
            onClick={() => setLightbox({ open: true, index: 3 })}
          />
          <div
            className="gallery-more"
            onClick={() => setLightbox({ open: true, index: 4 })}
          >
            +{galleryImages.length - 4} Photos
          </div>
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {lightbox.open && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightbox({ ...lightbox, open: false })}
        >
          <div className="lightbox-modal" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              className="lightbox-close"
              onClick={() => setLightbox({ ...lightbox, open: false })}
            >
              ✕
            </button>

            {/* Counter */}
            <div className="lightbox-counter">
              {lightbox.index + 1} / {galleryImages.length}
            </div>

            {/* Left arrow */}
            <button
              className="lightbox-arrow left"
              onClick={() =>
                setLightbox({
                  ...lightbox,
                  index:
                    (lightbox.index - 1 + galleryImages.length) %
                    galleryImages.length,
                })
              }
            >
              ‹
            </button>

            {/* Main image */}
            <img
              src={galleryImages[lightbox.index]}
              alt={`Gallery ${lightbox.index + 1}`}
              className="lightbox-img"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800";
              }}
            />

            {/* Right arrow */}
            <button
              className="lightbox-arrow right"
              onClick={() =>
                setLightbox({
                  ...lightbox,
                  index: (lightbox.index + 1) % galleryImages.length,
                })
              }
            >
              ›
            </button>

            {/* Thumbnail strip at bottom */}
            <div className="lightbox-thumbs">
              {galleryImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Thumb ${i + 1}`}
                  className={`lightbox-thumb ${lightbox.index === i ? "active" : ""}`}
                  onClick={() => setLightbox({ ...lightbox, index: i })}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800";
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="detail-container">
        <div className="detail-main">
          {/* LEFT: INFO */}
          <div className="detail-info">
            <h1>{hall.name}</h1>
            <div className="detail-meta">
              <span>
                <MapPin size={16} /> {hall.address || hall.location}
              </span>
              <span className="detail-rating">
                <Star size={16} fill="#ff6b6b" stroke="#ff6b6b" /> 4.8 (124
                reviews)
              </span>
            </div>
            <p className="detail-desc">{hall.description}</p>

            <div className="amenities-section">
              <h2>Amenities</h2>
              <div className="amenities-grid">
                {amenities.map((a, i) => (
                  <div key={i} className="amenity-item">
                    {a.icon}
                    <span>{a.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="capacity-section">
              <h2>Capacity</h2>
              <div className="capacity-bar">
                <span>
                  <Users size={16} /> Min: 100 Guests
                </span>
                <div className="bar">
                  <div className="bar-fill" style={{ width: "70%" }}></div>
                </div>
                <span>Max: {hall.capacity} Guests</span>
              </div>
            </div>

            <div className="packages-section">
              <h2>Packages</h2>
              <div className="packages-grid">
                {hall.packages?.map((pkg) => (
                  <div
                    key={pkg.packageID}
                    className={`package-card ${selectedPkg?.packageID === pkg.packageID ? "active" : ""}`}
                    onClick={() => setSelectedPkg(pkg)}
                  >
                    <h3>{pkg.name}</h3>
                    <p className="pkg-price">
                      Rs {pkg.price?.toLocaleString()}
                    </p>
                    <div className="pkg-includes">
                      {pkg.includes?.split(",").map((item, i) => (
                        <span key={i} className="include-tag">
                          ✓ {item.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: BOOKING CARD */}
          <div className="booking-form-wrapper">
            <div className="booking-price-header">
              <h2>Rs {total?.toLocaleString()}</h2>
              <span>/ Total</span>
            </div>
            {/* Add this ABOVE booking-summary in your JSX */}
            <div className="booking-price-breakdown">
              <div className="price-breakdown-row">
                <span>Hall Fee</span>
                <span>Rs {hallFee?.toLocaleString()}</span>
              </div>
              <div className="price-breakdown-row">
                <span>Package ({selectedPkg?.name})</span>
                <span>Rs {pkgFee?.toLocaleString()}</span>
              </div>
              <div className="price-breakdown-row tax-row">
                <span>Tax (10%)</span>
                <span>Rs {tax?.toLocaleString()}</span>
              </div>
              <div className="price-breakdown-row total-row">
                <span>Total</span>
                <span>Rs {total?.toLocaleString()}</span>
              </div>
            </div>

            {/* Add this AFTER wishlist-btn */}
            <p className="booking-note">30% advance required at booking</p>
            <div className="booking-summary">
              {selectedPkg && (
                <p>
                  Package: <strong>{selectedPkg.name}</strong>
                </p>
              )}
              <p>Guests: Up to {hall.capacity}</p>
            </div>
            <button
              className="btn-primary book-now-btn"
              onClick={() =>
                navigate(`/book/${hall.hallID}`, {
                  state: { hall, package: selectedPkg },
                })
              }
            >
              Book Now
            </button>
            <button className="btn-secondary wishlist-btn">
              ♡ Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HallDetailPage;
