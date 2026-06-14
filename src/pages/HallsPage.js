import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Filter, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import HallCard from '../components/HallCard';
import { getHalls } from '../services/api';
import './HallsPage.css';

const HallsPage = () => {
  const [halls, setHalls] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({ location: '', minCapacity: '', maxPrice: '' });
  const navigate = useNavigate();
  const location = useLocation();

  // Load filters from Home Page Search if they exist
  useEffect(() => {
    if (location.state) {
      const { location: searchLoc, minCapacity: searchCap } = location.state;
      setFilters({ ...filters, location: searchLoc || '', minCapacity: searchCap || '' });
    }
  }, [location.state]);

  useEffect(() => { loadHalls(); }, []);

  const loadHalls = async () => {
    try {
      const params = {};
      if (filters.location) params.location = filters.location;
      if (filters.minCapacity) params.minCapacity = filters.minCapacity;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      const res = await getHalls(params);
      setHalls(res.data);
    } catch {
      // Fallback data...
      setHalls([
        { hallID: 1, name: 'Grand Royal Hall', capacity: 500, pricePerDay: 150000, location: 'Lahore', description: 'Luxurious hall.', imageURL: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600' },
        { hallID: 2, name: 'Pearl Garden', capacity: 300, pricePerDay: 100000, location: 'Karachi', description: 'Garden hall.', imageURL: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600' },
        { hallID: 3, name: 'Diamond Palace', capacity: 400, pricePerDay: 120000, location: 'Islamabad', description: 'Modern indoor.', imageURL: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600' },
        { hallID: 4, name: 'Rose Marquee', capacity: 250, pricePerDay: 80000, location: 'Rawalpindi', description: 'Floral decorations.', imageURL: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600' },
        { hallID: 5, name: 'Golden Arena', capacity: 600, pricePerDay: 200000, location: 'Lahore', description: 'Massive hall.', imageURL: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600' },
        { hallID: 6, name: 'Silver Court', capacity: 200, pricePerDay: 60000, location: 'Faisalabad', description: 'Affordable.', imageURL: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600' },
      ]);
    }
  };

  const handleFilter = (e) => { e.preventDefault(); loadHalls(); };
  
  // ... keep the rest of the return statement exactly the same

  return (
    <div className="halls-page">
      <div className="halls-hero">
        <h1>Browse Our Halls</h1>
        <div className="breadcrumb">Home &gt; Halls</div>
      </div>

      <div className="halls-layout">
        {/* SIDEBAR FILTERS */}
        <aside className="filter-sidebar">
          <h3><Filter size={18} /> Filters</h3>
          <form onSubmit={handleFilter}>
            <div className="filter-group">
              <label>Location</label>
              <select value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})}>
                <option value="">All Locations</option>
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Islamabad">Islamabad</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Min Capacity</label>
              <select value={filters.minCapacity} onChange={(e) => setFilters({...filters, minCapacity: e.target.value})}>
                <option value="">Any</option>
                <option value="100">100+</option>
                <option value="300">300+</option>
                <option value="500">500+</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Max Price</label>
              <select value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}>
                <option value="">Any</option>
                <option value="80000">Under Rs 80,000</option>
                <option value="150000">Under Rs 150,000</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '16px'}}>Apply Filter</button>
          </form>
        </aside>

        {/* HALLS GRID */}
        <main className="halls-main">
          <div className="halls-controls">
            <span className="results-count">Showing {halls.length} halls</span>
            <div className="view-toggle">
              <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}><Grid size={18}/></button>
              <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}><List size={18}/></button>
            </div>
          </div>
          
          <div className={viewMode === 'grid' ? 'halls-grid-view' : 'halls-list-view'}>
            {halls.map(hall => <HallCard key={hall.hallID} hall={hall} viewMode={viewMode} />)}
          </div>

          <div className="pagination">
            <button className="page-btn"><ChevronLeft size={18}/></button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn"><ChevronRight size={18}/></button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HallsPage;