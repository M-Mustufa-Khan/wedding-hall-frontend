import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Grid, List, X, SlidersHorizontal, ChevronDown, MapPin, Users, DollarSign } from "lucide-react";
import HallCard from "../components/HallCard";
import { getHalls } from "../services/api";
import "./HallsPage.css";

const CAP_PRESETS  = ["Any", "100+", "200+", "300+", "500+"];
const PRICE_OPTS   = [
  { label: "Any Price",       value: "" },
  { label: "Under Rs 100K",   value: "100000" },
  { label: "Under Rs 150K",   value: "150000" },
  { label: "Under Rs 200K",   value: "200000" },
  { label: "Under Rs 500K",   value: "500000" },
];
const SORT_OPTS = [
  { label: "Default",         value: "" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Capacity: Most",  value: "cap_desc" },
  { label: "Capacity: Least", value: "cap_asc" },
];

const FALLBACK_HALLS = [
  { hallID: 1, name: "Grand Royal Hall", capacity: 500, pricePerDay: 150000, location: "Lahore",     description: "Luxurious hall with crystal chandeliers and world-class amenities.",    imageURL: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600" },
  { hallID: 2, name: "Pearl Garden",     capacity: 300, pricePerDay: 100000, location: "Karachi",    description: "Beautiful open-air garden hall perfect for outdoor celebrations.",      imageURL: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600" },
  { hallID: 3, name: "Diamond Palace",   capacity: 400, pricePerDay: 120000, location: "Islamabad",  description: "Modern indoor venue with premium setup and elegant lighting.",          imageURL: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600" },
  { hallID: 4, name: "Rose Marquee",     capacity: 250, pricePerDay:  80000, location: "Rawalpindi", description: "Elegant floral decorations with warm romantic lighting throughout.",    imageURL: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600" },
  { hallID: 5, name: "Golden Arena",     capacity: 600, pricePerDay: 200000, location: "Lahore",     description: "Massive hall for grand celebrations with state-of-the-art facilities.", imageURL: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600" },
  { hallID: 6, name: "Silver Court",     capacity: 200, pricePerDay:  60000, location: "Faisalabad", description: "Affordable and stylish venue with great service and ambiance.",         imageURL: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600" },
];

const HallsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allHalls,    setAllHalls]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [viewMode,    setViewMode]    = useState("grid");
  const [sortBy,      setSortBy]      = useState("");
  const [filterOpen,  setFilterOpen]  = useState(false);   // mobile drawer

  const [filters, setFilters] = useState({
    location:    searchParams.get("location") || "",
    minCapacity: searchParams.get("guests")   || "Any",
    maxPrice:    "",
  });

  useEffect(() => { loadHalls(); }, []);

  const loadHalls = async () => {
    setLoading(true);
    try {
      const res = await getHalls();
      setAllHalls(res.data);
    } catch {
      setAllHalls(FALLBACK_HALLS);
    } finally {
      setLoading(false);
    }
  };

  const filteredHalls = useMemo(() => {
    let list = allHalls.filter((hall) => {
      const loc   = filters.location.toLowerCase().trim();
      const cap   = filters.minCapacity !== "Any" ? parseInt(filters.minCapacity) : 0;
      const price = parseInt(filters.maxPrice);
      if (loc   && !hall.location.toLowerCase().includes(loc)) return false;
      if (cap > 0 && hall.capacity < cap)                       return false;
      if (!isNaN(price) && price > 0 && hall.pricePerDay > price) return false;
      return true;
    });

    if (sortBy === "price_asc")  list = [...list].sort((a, b) => a.pricePerDay - b.pricePerDay);
    if (sortBy === "price_desc") list = [...list].sort((a, b) => b.pricePerDay - a.pricePerDay);
    if (sortBy === "cap_desc")   list = [...list].sort((a, b) => b.capacity - a.capacity);
    if (sortBy === "cap_asc")    list = [...list].sort((a, b) => a.capacity - b.capacity);

    return list;
  }, [allHalls, filters, sortBy]);

  const activeFilterCount = [
    filters.location,
    filters.minCapacity !== "Any" ? filters.minCapacity : "",
    filters.maxPrice,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({ location: "", minCapacity: "Any", maxPrice: "" });
    setSortBy("");
    setSearchParams({});
  };

  const applyFilters = (e) => {
    e?.preventDefault();
    const p = new URLSearchParams();
    if (filters.location)                   p.append("location", filters.location);
    if (filters.minCapacity !== "Any")      p.append("guests", filters.minCapacity);
    setSearchParams(p);
    setFilterOpen(false);
  };

  const FilterPanel = () => (
    <form className="filter-panel" onSubmit={applyFilters}>
      <div className="filter-panel-head">
        <div className="filter-panel-title">
          <SlidersHorizontal size={16} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="filter-count-badge">{activeFilterCount}</span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button type="button" className="filter-clear-all" onClick={clearFilters}>
            Clear all
          </button>
        )}
      </div>

      {/* Location */}
      <div className="filter-group">
        <label className="filter-label">
          <MapPin size={13} /> Location
        </label>
        <div className="filter-input-wrap">
          <input
            type="text"
            placeholder="City or area…"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
          {filters.location && (
            <button type="button" className="filter-input-clear"
              onClick={() => setFilters({ ...filters, location: "" })}>
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Capacity */}
      <div className="filter-group">
        <label className="filter-label">
          <Users size={13} /> Min Capacity
        </label>
        <div className="filter-presets">
          {CAP_PRESETS.map((p) => (
            <button
              key={p} type="button"
              className={`filter-preset ${filters.minCapacity === p ? "active" : ""}`}
              onClick={() => setFilters({ ...filters, minCapacity: p })}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Max Price */}
      <div className="filter-group">
        <label className="filter-label">
          <DollarSign size={13} /> Max Price
        </label>
        <div className="filter-select-wrap">
          <select
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          >
            {PRICE_OPTS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="filter-select-chevron" />
        </div>
      </div>

      <button type="submit" className="filter-apply-btn">Apply Filters</button>
    </form>
  );

  return (
    <div className="halls-page">

      {/* ── Hero ── */}
      <section className="halls-hero">
        <div className="halls-hero-bg"   aria-hidden="true" />
        <div className="halls-hero-overlay" aria-hidden="true" />
        <div className="halls-hero-inner">
          <span className="halls-hero-tag">✦ Our Collection</span>
          <h1 className="halls-hero-heading">Browse Our Halls</h1>
          <p className="halls-hero-sub">
            Explore premium wedding venues curated for your perfect celebration
          </p>
          <div className="halls-breadcrumb">
            <span>Home</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-active">Halls</span>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="halls-body">

        {/* Desktop sidebar */}
        <aside className="halls-sidebar">
          <FilterPanel />
        </aside>

        {/* Main */}
        <main className="halls-main">

          {/* Controls bar */}
          <div className="halls-controls">
            <div className="controls-left">
              <span className="results-label">
                {loading ? "Loading…" : (
                  <><strong>{filteredHalls.length}</strong> hall{filteredHalls.length !== 1 ? "s" : ""} found</>
                )}
              </span>

              {/* Active filter pills */}
              {!loading && activeFilterCount > 0 && (
                <div className="active-pills">
                  {filters.location && (
                    <span className="filter-pill">
                      📍 {filters.location}
                      <button onClick={() => setFilters({ ...filters, location: "" })}><X size={11} /></button>
                    </span>
                  )}
                  {filters.minCapacity !== "Any" && (
                    <span className="filter-pill">
                      👥 {filters.minCapacity} guests
                      <button onClick={() => setFilters({ ...filters, minCapacity: "Any" })}><X size={11} /></button>
                    </span>
                  )}
                  {filters.maxPrice && (
                    <span className="filter-pill">
                      💰 Max Rs {parseInt(filters.maxPrice).toLocaleString()}
                      <button onClick={() => setFilters({ ...filters, maxPrice: "" })}><X size={11} /></button>
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="controls-right">
              {/* Sort */}
              <div className="sort-wrap">
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {SORT_OPTS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="sort-chevron" />
              </div>

              {/* View toggle */}
              <div className="view-toggle">
                <button className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")} title="Grid view"><Grid size={16} /></button>
                <button className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")} title="List view"><List size={16} /></button>
              </div>

              {/* Mobile filter btn */}
              <button className="mobile-filter-btn" onClick={() => setFilterOpen(true)}>
                <Filter size={15} />
                Filters
                {activeFilterCount > 0 && <span className="mobile-filter-count">{activeFilterCount}</span>}
              </button>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className={viewMode === "grid" ? "halls-grid" : "halls-list"}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skel-card">
                  <div className="skel skel-img" />
                  <div className="skel-body">
                    <div className="skel skel-line" style={{ width: "65%" }} />
                    <div className="skel skel-line" style={{ width: "45%" }} />
                    <div className="skel skel-line" style={{ width: "80%" }} />
                    <div className="skel-footer">
                      <div className="skel skel-line" style={{ width: "28%" }} />
                      <div className="skel skel-line" style={{ width: "32%" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredHalls.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏛️</div>
              <h3>No halls found</h3>
              <p>Try adjusting your filters to discover more venues.</p>
              <button className="empty-clear-btn" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "halls-grid" : "halls-list"}>
              {filteredHalls.map((hall) => (
                <HallCard key={hall.hallID} hall={hall} viewMode={viewMode} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <>
          <div className="filter-backdrop" onClick={() => setFilterOpen(false)} />
          <div className="filter-drawer">
            <div className="filter-drawer-head">
              <span>Filters</span>
              <button onClick={() => setFilterOpen(false)}><X size={20} /></button>
            </div>
            <div className="filter-drawer-body">
              <FilterPanel />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HallsPage;
