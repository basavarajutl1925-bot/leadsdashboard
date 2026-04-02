import React, { useState } from 'react';
import { leadAPI } from '../utils/api';
import '../styles/FiltersPanel.css';

const FiltersPanel = ({ onFilterChange, onRefresh }) => {
  const [source, setSource] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApplyFilters = () => {
    const filters = {
      ...(source && { source }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate })
    };
    onFilterChange(filters);
  };

  const handleReset = () => {
    setSource('');
    setStartDate('');
    setEndDate('');
    onFilterChange({});
  };

  return (
    <div className="filters-panel">
      <h3>🔍 Filter Leads</h3>
      
      <div className="filters-grid">
        <div className="filter-group">
          <label htmlFor="source">Source</label>
          <select
            id="source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="filter-input"
          >
            <option value="">All Sources</option>
            <option value="instagram">📷 Instagram</option>
            <option value="facebook">👍 Facebook</option>
            <option value="whatsapp">💬 WhatsApp</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="endDate">End Date</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-actions">
          <button onClick={handleApplyFilters} className="btn-apply">
            🔎 Apply Filters
          </button>
          <button onClick={handleReset} className="btn-reset">
            ↻ Reset
          </button>
          <button onClick={onRefresh} className="btn-refresh">
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;
