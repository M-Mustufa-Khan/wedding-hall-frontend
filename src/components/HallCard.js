import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Users, Star, ArrowRight } from "lucide-react";
import "./HallCard.css";

const HallCard = ({ hall, viewMode }) => (
  <Link
    to={`/halls/${hall.hallID}`}
    className={`hall-card ${viewMode === "list" ? "list-mode" : ""}`}
  >
    <div className="hc-img-wrap">
      <img
        src={hall.imageURL || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600"}
        alt={hall.name}
        onError={(e) => {
          e.target.src = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600";
        }}
      />
      <div className="hc-img-overlay" aria-hidden="true" />

      <span className="hc-location-badge">
        <MapPin size={11} /> {hall.location}
      </span>

      <div className="hc-view-hint">
        View Hall <ArrowRight size={14} />
      </div>
    </div>

    <div className="hc-body">
      <h3 className="hc-name">{hall.name}</h3>

      <div className="hc-meta">
        <span className="hc-meta-item">
          <Users size={13} /> Up to {hall.capacity?.toLocaleString()} guests
        </span>
      </div>

      <p className="hc-desc">
        {hall.description?.length > 80
          ? `${hall.description.substring(0, 80)}…`
          : hall.description}
      </p>

      <div className="hc-footer">
        <div className="hc-rating">
          <Star size={13} fill="#d4af37" stroke="#d4af37" />
          <span>4.8</span>
        </div>
        <div className="hc-price">
          <span className="hc-price-amount">Rs {hall.pricePerDay?.toLocaleString()}</span>
          <span className="hc-price-unit">/day</span>
        </div>
      </div>
    </div>
  </Link>
);

export default HallCard;
