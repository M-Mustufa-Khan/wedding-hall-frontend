import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Users, Star } from "lucide-react";
import "./HallCard.css";

const HallCard = ({ hall, viewMode }) => {
  return (
    <Link
      to={`/halls/${hall.hallID}`}
      className={`hall-card ${viewMode === "list" ? "list-mode" : ""}`}
    >
      <div className="hall-card-image">
        <img
          src={
            hall.imageURL ||
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600"
          }
          alt={hall.name}
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600";
          }}
        />
        <div className="hall-card-badge">{hall.location}</div>
      </div>
      <div className="hall-card-content">
        <h3>{hall.name}</h3>
        <div className="hall-meta">
          <span>
            <MapPin size={14} /> {hall.location}
          </span>
          <span>
            <Users size={14} /> Up to {hall.capacity}
          </span>
        </div>
        <p className="hall-card-desc">
          {hall.description?.substring(0, 60)}...
        </p>
        <div className="hall-card-footer">
          <div className="hall-rating">
            <Star size={14} fill="#ff6b6b" stroke="#ff6b6b" /> 4.8
          </div>
          <span className="hall-price">
            Rs {hall.pricePerDay?.toLocaleString()}
            <span>/day</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default HallCard;
