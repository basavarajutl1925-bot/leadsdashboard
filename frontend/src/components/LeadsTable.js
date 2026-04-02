import React, { useState, useEffect } from 'react';
import { leadAPI } from '../utils/api';
import { 
  formatDate, 
  getStatusColor, 
  getSourceColor, 
  getSourceIcon 
} from '../utils/helpers';
import '../styles/LeadsTable.css';

const LeadsTable = ({ refreshTrigger, filters }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });

  useEffect(() => {
    fetchLeads();
  }, [refreshTrigger, filters]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      const response = await leadAPI.getAllLeads(params);

      if (response.data.success) {
        setLeads(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError('Failed to fetch leads');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLead = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        const response = await leadAPI.deleteLead(id);
        if (response.data.success) {
          setLeads(leads.filter(lead => lead._id !== id));
          alert('Lead deleted successfully');
        }
      } catch (err) {
        alert('Failed to delete lead');
        console.error(err);
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await leadAPI.updateLead(id, { status: newStatus });
      if (response.data.success) {
        setLeads(leads.map(lead =>
          lead._id === id ? { ...lead, status: newStatus } : lead
        ));
      }
    } catch (err) {
      alert('Failed to update lead status');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Loading leads...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="leads-table-container">
      <h2>📋 All Leads ({pagination.total})</h2>

      {leads.length === 0 ? (
        <div className="empty-state">
          <p>No leads found. Create your first lead!</p>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Source</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead._id} className="lead-row">
                    <td>{lead.name}</td>
                    <td>{lead.email}</td>
                    <td>{lead.phone}</td>
                    <td>
                      <span
                        className="source-badge"
                        style={{ backgroundColor: getSourceColor(lead.source) }}
                      >
                        {getSourceIcon(lead.source)} {lead.source}
                      </span>
                    </td>
                    <td>
                      {lead.city}, {lead.country}
                    </td>
                    <td>
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusUpdate(lead._id, e.target.value)}
                        className="status-select"
                        style={{ borderColor: getStatusColor(lead.status) }}
                      >
                        <option value="new">🆕 New</option>
                        <option value="contacted">📞 Contacted</option>
                        <option value="qualified">✅ Qualified</option>
                        <option value="lost">❌ Lost</option>
                        <option value="converted">🎉 Converted</option>
                      </select>
                    </td>
                    <td>
                      {lead.messageStatus ? (
                        <span
                          className="message-status"
                          style={{
                            backgroundColor: getStatusColor(lead.messageStatus.status)
                          }}
                        >
                          {lead.messageStatus.status}
                        </span>
                      ) : (
                        <span className="message-status">N/A</span>
                      )}
                    </td>
                    <td className="date-cell">{formatDate(lead.createdAt)}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteLead(lead._id)}
                        className="delete-btn"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={pagination.page === 1}
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              className="pagination-btn"
            >
              ← Previous
            </button>
            <span className="pagination-info">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              disabled={pagination.page === pagination.pages}
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              className="pagination-btn"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LeadsTable;
