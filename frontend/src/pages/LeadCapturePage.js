import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/LeadCapturePage.css';

const phonePrefix = '+91';

const LeadCapturePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: phonePrefix,
    message: ''
  });

  const [location, setLocation] = useState({
    city: 'Detecting...',
    country: 'Detecting...'
  });

  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const sourcesWithoutMessage = ['instagram', 'facebook', 'direct'];

  const placeCursorAfterPrefix = (event) => {
    const prefixLength = phonePrefix.length;

    requestAnimationFrame(() => {
      const cursorPosition = Math.max(event.target.selectionStart || 0, prefixLength);
      event.target.setSelectionRange(cursorPosition, cursorPosition);
    });
  };

  // Get source from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSource = params.get('source') || 'direct';
    setSource(urlSource);
  }, []);

  // Get user location on mount
  useEffect(() => {
    const getLocation = async () => {
      try {
        const response = await axios.get('http://ip-api.com/json/');
        setLocation({
          city: response.data.city || 'Unknown',
          country: response.data.country || 'Unknown'
        });
      } catch (err) {
        console.error('Location fetch failed:', err);
        setLocation({
          city: 'Unknown',
          country: 'Unknown'
        });
      }
    };

    getLocation();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (formData.phone.trim().length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const shouldShowMessageField = !sourcesWithoutMessage.includes(source);
      const leadData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: shouldShowMessageField ? formData.message.trim() : '',
        source: source,
        city: location.city,
        country: location.country,
        status: 'new'
      };

      const response = await axios.post('http://localhost:5000/api/leads', leadData);

      if (response.status === 201) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: phonePrefix,
          message: ''
        });

        // Reset form after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.message || 'Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSourceInfo = () => {
    const sourceMap = {
      instagram: { icon: '📸', label: 'Instagram' },
      facebook: { icon: '👍', label: 'Facebook' },
      whatsapp: { icon: '💬', label: 'WhatsApp' },
      direct: { icon: '🔗', label: 'Direct Link' },
      email: { icon: '✉️', label: 'Email' }
    };
    return sourceMap[source] || sourceMap.direct;
  };

  const sourceInfo = getSourceInfo();
  const shouldShowMessageField = !sourcesWithoutMessage.includes(source);

  return (
    <div className="lead-capture-container">
      <div className="lead-capture-card">
        <div className="capture-header">
          <h1>Get in Touch</h1>
          <p>Share your details and our team will reach out with the next steps.</p>
        </div>

        {submitted && (
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h3>Thank You!</h3>
            <p>Your inquiry has been received. We'll get back to you soon!</p>
          </div>
        )}

        {!submitted && (
          <form onSubmit={handleSubmit} className="lead-form">
            {error && (
              <div className="error-message">
                <span>⚠️</span> {error}
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={placeCursorAfterPrefix}
                onClick={placeCursorAfterPrefix}
                placeholder="+1234567890"
                disabled={loading}
              />
            </div>

            {shouldShowMessageField && (
              <div className="form-group form-group-message">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  rows="4"
                  disabled={loading}
                />
              </div>
            )}

            <div className="location-source-info">
              <div className="location-badge">
                📍 {location.city}, {location.country}
              </div>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Submitting...
                </>
              ) : (
                'Submit Inquiry'
              )}
            </button>

            <p className="form-note">
              * Required fields. We respect your privacy and only use your details to contact you.
            </p>
          </form>
        )}

        <div className="capture-footer">
          <p>
            Or reach us at:
            <br />
            <strong>📞 Phone:</strong> +1 (855) 823-8886
            <br />
            <strong>📧 Email:</strong> support@example.com
          </p>
        </div>
      </div>

      <div className="background-decoration">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
    </div>
  );
};

export default LeadCapturePage;
