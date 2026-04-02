import React, { useState, useEffect } from 'react';
import { leadAPI } from '../utils/api';
import { getLocationFromIP, validateEmail, validatePhone } from '../utils/helpers';
import '../styles/LeadForm.css';

const phonePrefix = '+91';

const LeadForm = ({ onLeadCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: phonePrefix,
    source: 'instagram'
  });

  const [location, setLocation] = useState({
    city: 'Detecting...',
    country: 'Detecting...'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Detect location on component mount
  useEffect(() => {
    detectLocation();
  }, []);

  const placeCursorAfterPrefix = (event) => {
    const prefixLength = phonePrefix.length;

    requestAnimationFrame(() => {
      const cursorPosition = Math.max(event.target.selectionStart || 0, prefixLength);
      event.target.setSelectionRange(cursorPosition, cursorPosition);
    });
  };

  const detectLocation = async () => {
    try {
      const locationData = await getLocationFromIP();
      setLocation(locationData);
    } catch (err) {
      console.error('Failed to detect location:', err);
      setLocation({
        city: 'Unknown',
        country: 'Unknown'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid phone number (minimum 10 digits)');
      return false;
    }

    if (!formData.source) {
      setError('Please select a source');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await leadAPI.createLead(formData);

      if (response.data.success) {
        setSuccess('✅ Lead created successfully! WhatsApp message sent.');
        setFormData({
          name: '',
          email: '',
          phone: phonePrefix,
          source: 'instagram'
        });
        
        // Call callback function
        if (onLeadCreated) {
          onLeadCreated(response.data.data);
        }

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create lead';
      setError(`❌ ${errorMessage}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lead-form-container">
      <div className="form-card">
        <h2>📝 Capture New Lead</h2>

        {/* Location Info */}
        <div className="location-info">
          <p>📍 Detected Location: <strong>{location.city}, {location.country}</strong></p>
          <button
            type="button"
            onClick={detectLocation}
            className="detect-btn"
          >
            🔄 Detect Again
          </button>
        </div>

        <form onSubmit={handleSubmit} className="lead-form">
          {/* Error Message */}
          {error && <div className="alert alert-error">{error}</div>}

          {/* Success Message */}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="name">👤 Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter full name"
              className="form-input"
              required
            />
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">📧 Email *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              className="form-input"
              required
            />
          </div>

          {/* Phone Field */}
          <div className="form-group">
            <label htmlFor="phone">📞 Phone Number *</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              onFocus={placeCursorAfterPrefix}
              onClick={placeCursorAfterPrefix}
              placeholder="Enter phone number"
              className="form-input"
              required
            />
          </div>

          {/* Source Dropdown */}
          <div className="form-group">
            <label htmlFor="source">📱 Source *</label>
            <select
              id="source"
              name="source"
              value={formData.source}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="">Select a source</option>
              <option value="instagram">📷 Instagram</option>
              <option value="facebook">👍 Facebook</option>
              <option value="whatsapp">💬 WhatsApp</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? '⏳ Submitting...' : '✅ Create Lead & Send Message'}
          </button>
        </form>

        <p className="form-note">* Required fields. We'll automatically send a WhatsApp message to the lead.</p>
      </div>
    </div>
  );
};

export default LeadForm;
