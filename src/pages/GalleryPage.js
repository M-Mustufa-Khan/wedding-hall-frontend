import React, { useState } from "react";
import "./GalleryPage.css";

const CATEGORIES = [
  "All",
  "Ceremony Halls",
  "Reception",
  "Outdoor",
  "Decoration",
  "Bridal Room",
];

const IMAGES = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
    cat: "Ceremony Halls",
    hall: "Grand Royal Hall",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
    cat: "Outdoor",
    hall: "Pearl Garden",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800",
    cat: "Reception",
    hall: "Diamond Palace",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800",
    cat: "Decoration",
    hall: "Golden Arena",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800",
    cat: "Ceremony Halls",
    hall: "Silver Court",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    cat: "Bridal Room",
    hall: "Rose Marquee",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800",
    cat: "Reception",
    hall: "Grand Royal Hall",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800",
    cat: "Outdoor",
    hall: "Pearl Garden",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=800",
    cat: "Decoration",
    hall: "Diamond Palace",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=800",
    cat: "Ceremony Halls",
    hall: "Golden Arena",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800",
    cat: "Bridal Room",
    hall: "Silver Court",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800",
    cat: "Reception",
    hall: "Rose Marquee",
  },
];

const GalleryPage = () => {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const [visible, setVisible] = useState(8);

  const filtered =
    active === "All" ? IMAGES : IMAGES.filter((i) => i.cat === active);
  const shown = filtered.slice(0, visible);

  const open = (i) => setLightbox({ open: true, index: i });
  const close = () => setLightbox({ open: false, index: 0 });
  const prev = () =>
    setLightbox((l) => ({
      ...l,
      index: (l.index - 1 + filtered.length) % filtered.length,
    }));
  const next = () =>
    setLightbox((l) => ({ ...l, index: (l.index + 1) % filtered.length }));

  return (
    <div className="gallery-page">
      {/* Hero */}
      <div className="gallery-hero">
        <p className="section-tag">✦ Gallery</p>
        <h1>Our Gallery</h1>
        <p>Explore breathtaking moments from our beautiful venues</p>
      </div>

      <div className="gallery-container">
        {/* Filter tabs */}
        <div className="gallery-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={active === cat ? "active" : ""}
              onClick={() => {
                setActive(cat);
                setVisible(8);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="gallery-grid">
          {shown.map((img, i) => (
            <div key={img.id} className="gallery-item" onClick={() => open(i)}>
              <img
                src={img.src}
                alt={img.hall}
                onError={(e) =>
                  (e.target.src =
                    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800")
                }
              />
              <div className="gallery-overlay">
                <span className="gallery-zoom">🔍</span>
                <p className="gallery-label">{img.hall}</p>
                <span className="gallery-cat-badge">{img.cat}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        {visible < filtered.length && (
          <div className="load-more-wrap">
            <button
              className="load-more-btn"
              onClick={() => setVisible((v) => v + 4)}
            >
              Load More Photos
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox.open && (
        <div className="lightbox-overlay" onClick={close}>
          <div className="lightbox-box" onClick={(e) => e.stopPropagation()}>
            <button className="lb-close" onClick={close}>
              ✕
            </button>
            <div className="lb-counter">
              {lightbox.index + 1} / {filtered.length}
            </div>
            <button className="lb-arrow lb-left" onClick={prev}>
              ‹
            </button>
            <img
              src={filtered[lightbox.index]?.src}
              alt={filtered[lightbox.index]?.hall}
              className="lb-img"
              onError={(e) =>
                (e.target.src =
                  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800")
              }
            />
            <button className="lb-arrow lb-right" onClick={next}>
              ›
            </button>
            <div className="lb-info">
              <span>{filtered[lightbox.index]?.hall}</span>
              <span className="lb-cat">{filtered[lightbox.index]?.cat}</span>
            </div>
            <div className="lb-thumbs">
              {filtered.map((img, i) => (
                <img
                  key={img.id}
                  src={img.src}
                  alt=""
                  className={`lb-thumb ${i === lightbox.index ? "active" : ""}`}
                  onClick={() => setLightbox((l) => ({ ...l, index: i }))}
                  onError={(e) =>
                    (e.target.src =
                      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800")
                  }
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
