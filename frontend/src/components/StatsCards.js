import React, { useState, useEffect } from 'react';
import { leadAPI } from '../utils/api';
import { getSourceColor } from '../utils/helpers';
import '../styles/StatsCards.css';

const StatsCards = ({ refreshTrigger }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await leadAPI.getStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading statistics...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!stats) {
    return <div className="error">No statistics available</div>;
  }

  const sources = Object.keys(stats.bySource);
  const colors = sources.map(source => getSourceColor(source));

  return (
    <div className="stats-container">
      {/* Total Leads Card */}
      <div className="stat-card total-card">
        <div className="stat-icon">📊</div>
        <div className="stat-content">
          <h3>Total Leads</h3>
          <p className="stat-value">{stats.total}</p>
        </div>
      </div>

      {/* Source Cards */}
      {sources.map((source, index) => (
        <div
          key={source}
          className="stat-card source-card"
          style={{ borderLeft: `5px solid ${colors[index]}` }}
        >
          <div className="stat-icon" style={{ color: colors[index] }}>
            {source === 'instagram' && '📷'}
            {source === 'facebook' && '👍'}
            {source === 'whatsapp' && '💬'}
          </div>
          <div className="stat-content">
            <h3>{source.charAt(0).toUpperCase() + source.slice(1)}</h3>
            <p className="stat-value">{stats.bySource[source]}</p>
            <p className="stat-percentage">
              {((stats.bySource[source] / stats.total) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
