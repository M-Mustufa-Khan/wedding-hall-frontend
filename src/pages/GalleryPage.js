import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, Home, ChevronRight as Chevron } from "lucide-react";
import { getGalleryImages } from "../services/api";
import "./GalleryPage.css";

const CATEGORIES = [
  "All",
  "Ceremony Halls",
  "Reception",
  "Outdoor",
  "Decoration",
  "Bridal Room",
];

const FALLBACK =
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800";

const GalleryPage = () => {
  useEffect(() => { document.title = "Gallery — Elegant Celebrations"; }, []);

  const [allImages, setAllImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const [visible, setVisible] = useState(8);

  useEffect(() => {
    getGalleryImages()
      .then((res) => setAllImages(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingImages(false));
  }, []);

  const IMAGES = allImages.map((img) => ({
    id: img.id,
    src: img.imageBase64,
    cat: img.category,
    hall: img.caption || img.category,
  }));

  const filtered =
    active === "All" ? IMAGES : IMAGES.filter((img) => img.cat === active);
  const shown = filtered.slice(0, visible);

  const openLightbox = (i) => setLightbox({ open: true, index: i });
  const closeLightbox = () => setLightbox({ open: false, index: 0 });

  const prev = useCallback(
    () =>
      setLightbox((l) => ({
        ...l,
        index: (l.index - 1 + filtered.length) % filtered.length,
      })),
    [filtered.length]
  );

  const next = useCallback(
    () =>
      setLightbox((l) => ({ ...l, index: (l.index + 1) % filtered.length })),
    [filtered.length]
  );

  /* Keyboard navigation */
  useEffect(() => {
    if (!lightbox.open) return;
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox.open, prev, next]);

  /* Lock body scroll when lightbox open */
  useEffect(() => {
    document.body.style.overflow = lightbox.open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox.open]);

  const handleCategoryChange = (cat) => {
    setActive(cat);
    setVisible(8);
  };

  return (
    <div className="gallery-page">
      {/* ── Hero ── */}
      <section className="gallery-page-hero gallery-hero-section">
        <div
          className="gallery-hero-bg"
          aria-hidden="true"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600)",
          }}
        />
        <div className="gallery-hero-overlay" aria-hidden="true" />
        <div className="gallery-hero-inner">
          <span className="gallery-hero-tag">✦ Gallery</span>
          <h1 className="gallery-hero-h1">Our Gallery</h1>
          <p className="gallery-hero-sub">
            Explore breathtaking moments captured across our stunning venues
          </p>
          <nav className="gallery-hero-breadcrumb" aria-label="Breadcrumb">
            <Home size={13} />
            <span>Home</span>
            <Chevron size={12} />
            <span style={{ color: "#d4af37" }}>Gallery</span>
          </nav>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="gallery-main-section">
        <div className="gallery-container">

          {/* Section heading */}
          <div className="gallery-heading-block">
            <h2 className="gallery-section-title">
              Timeless Moments
            </h2>
            <p className="gallery-section-sub">
              Browse our curated collection of weddings, receptions, and venue
              highlights — each image a testament to unforgettable celebrations.
            </p>
          </div>

          {/* ── Category Filter Pills ── */}
          <div className="gallery-filters" role="group" aria-label="Filter by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-pill${active === cat ? " filter-pill--active" : ""}`}
                onClick={() => handleCategoryChange(cat)}
                aria-pressed={active === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ── Gallery Grid ── */}
          {loadingImages ? (
            <div className="gallery-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="gallery-item gallery-skeleton" />
              ))}
            </div>
          ) : shown.length > 0 ? (
            <div className="gallery-grid">
              {shown.map((img, i) => (
                <div
                  key={img.id}
                  className="gallery-item"
                  onClick={() => openLightbox(i)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${img.hall}`}
                  onKeyDown={(e) => e.key === "Enter" && openLightbox(i)}
                >
                  <img
                    src={img.src}
                    alt={img.hall}
                    className="gallery-item-img"
                    loading="lazy"
                    onError={(e) => (e.target.src = FALLBACK)}
                  />
                  <div className="gallery-item-overlay">
                    <ZoomIn size={28} color="#f4d03f" strokeWidth={1.5} />
                    <p className="gallery-item-label">{img.hall}</p>
                    <span className="gallery-item-badge">{img.cat}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="gallery-empty">
              <p>No images found for this category.</p>
            </div>
          )}

          {/* ── Load More ── */}
          {visible < filtered.length && (
            <div className="gallery-load-more">
              <button
                className="btn-ghost"
                onClick={() => setVisible((v) => v + 4)}
              >
                Load More Photos
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightbox.open && (
        <div
          className="gallery-lightbox-overlay"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <div
            className="lightbox-box"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="lb-topbar">
              <span className="lb-counter">
                {lightbox.index + 1} / {filtered.length}
              </span>
              <button
                className="lb-close"
                onClick={closeLightbox}
                aria-label="Close lightbox"
              >
                <X size={18} />
              </button>
            </div>

            {/* Image area */}
            <div className="lb-stage">
              <button
                className="lb-arrow lb-arrow--left"
                onClick={prev}
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>

              <img
                key={filtered[lightbox.index]?.id}
                src={filtered[lightbox.index]?.src}
                alt={filtered[lightbox.index]?.hall}
                className="lb-img"
                onError={(e) => (e.target.src = FALLBACK)}
              />

              <button
                className="lb-arrow lb-arrow--right"
                onClick={next}
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Info */}
            <div className="lb-info">
              <span className="lb-info-hall">
                {filtered[lightbox.index]?.hall}
              </span>
              <span className="lb-cat-badge">
                {filtered[lightbox.index]?.cat}
              </span>
            </div>

            {/* Thumbnails */}
            <div className="lb-thumbs" role="list">
              {filtered.map((img, i) => (
                <img
                  key={img.id}
                  src={img.src}
                  alt={img.hall}
                  role="listitem"
                  className={`lb-thumb${i === lightbox.index ? " lb-thumb--active" : ""}`}
                  onClick={() => setLightbox((l) => ({ ...l, index: i }))}
                  onError={(e) => (e.target.src = FALLBACK)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
