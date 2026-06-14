import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, Grid, List, ChevronLeft, ChevronRight, X } from 'lucide-react';
import HallCard from '../components/HallCard';
import { getHalls } from '../services/api';
import './HallsPage.css';

const HallsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allHalls, setAllHalls] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    minCapacity: searchParams.get('guests') || '',
    maxPrice: ''
  });
  const navigate = useNavigate();

  useEffect(() => { loadHalls(); }, []);

  const loadHalls = async () => {
    try {
      const res = await getHalls();
      setAllHalls(res.data);
    } catch {
      setAllHalls([
        { hallID: 1, name: 'Grand Royal Hall', capacity: 500, pricePerDay: 150000, location: 'Lahore', description: 'Luxurious hall.', imageURL: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600' },
        { hallID: 2, name: 'Pearl Garden', capacity: 300, pricePerDay: 100000, location: 'Karachi', description: 'Garden hall.', imageURL: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600' },
        { hallID: 3, name: 'Diamond Palace', capacity: 400, pricePerDay: 120000, location: 'Islamabad', description: 'Modern indoor.', imageURL: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600' },
        { hallID: 4, name: 'Rose Marquee', capacity: 250, pricePerDay: 80000, location: 'Rawalpindi', description: 'Floral decorations.', imageURL: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600' },
        { hallID: 5, name: 'Golden Arena', capacity: 600, pricePerDay: 200000, location: 'Lahore', description: 'Massive hall.', imageURL: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600' },
        { hallID: 6, name: 'Silver Court', capacity: 200, pricePerDay: 60000, location: 'Faisalabad', description: 'Affordable.', imageURL: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600' },
      ]);
    }
  };

  // Client-side filtering based on URL params and sidebar
  const filteredHalls = useMemo(() => {
    return allHalls.filter(hall => {
      const loc = filters.location.toLowerCase();
      const cap = parseInt(filters.minCapacity);
      const price = parseInt(filters.maxPrice);

      if (loc && !hall.location.toLowerCase().includes(loc)) return false;
      if (cap && hall.capacity < cap) return false;
      if (price && hall.pricePerDay > price) return false;
      return true;
    });
  }, [allHalls, filters]);

  const clearFilters = () => {
    setFilters({ location: '', minCapacity: '', maxPrice: '' });
    setSearchParams({});
  };

  const handleFilter = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.location) params.append('location', filters.location);
    if (filters.minCapacity) params.append('guests', filters.minCapacity);
    setSearchParams(params);
  };

  return (
    <div className="halls-page">
      <div className="halls-hero">
        <h1>Browse Our Halls</h1>
        <div className="breadcrumb">Home &gt; Halls</div>
      </div>

      <div className="halls-layout">
        <aside className="filter-sidebar">
          <h3><Filter size={18} /> Filters</h3>
          <form onSubmit={handleFilter}>
            <div className="form-group">
              <label>Location</label>
              <input type="text" value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Min Capacity</label>
              <input type="number" value={filters.minCapacity} onChange={(e) => setFilters({...filters, minCapacity: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Max Price</label>
              <input type="number" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} />
            </div>
            <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '16px'}}>Apply Filter</button>
            <button type="button" className="btn-secondary" style={{width: '100%', marginTop: '8px'}} onClick={clearFilters}>Clear Filters</button>
          </form>
        </aside>

        <main className="halls-main">
          <div className="halls-controls">
            <div>
              <span className="results-count">Showing {filteredHalls.length} halls</span>
              {searchParams.toString() && (
                <span className="active-filters">
                  {filters.location && `📍 ${filters.location}`} 
                  {filters.minCapacity && ` 👥 ${filters.minCapacity}+ Guests`}
                  <button className="clear-btn" onClick={clearFilters}><X size={14}/></button>
                </span>
              )}
            </div>
            <div className="view-toggle">
              <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}><Grid size={18}/></button>
              <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}><List size={18}/></button>
            </div>
          </div>
          
          {filteredHalls.length === 0 ? (
            <div className="empty-state">
              <h2>No halls found</h2>
              <p>Try adjusting your search or filter criteria</p>
              <button className="btn-primary" onClick={clearFilters}>Clear Search</button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'halls-grid-view' : 'halls-list-view'}>
              {filteredHalls.map(hall => <HallCard key={hall.hallID} hall={hall} viewMode={viewMode} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HallsPage;