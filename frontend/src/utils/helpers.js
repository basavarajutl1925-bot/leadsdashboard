export const getLocationFromIP = async () => {
  try {
    const response = await fetch('http://ip-api.com/json/');
    const data = await response.json();
    return {
      city: data.city || 'Unknown',
      country: data.country || 'Unknown'
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return {
      city: 'Unknown',
      country: 'Unknown'
    };
  }
};

export const formatPhoneNumber = (phone) => {
  // Basic formatting - remove spaces and special chars except +
  return phone.replace(/[^\d+\-]/g, '');
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9+\-\s()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusColor = (status) => {
  const colors = {
    sent: '#3498db',
    delivered: '#2ecc71',
    failed: '#e74c3c',
    pending: '#f39c12',
    new: '#95a5a6',
    contacted: '#3498db',
    qualified: '#2ecc71',
    lost: '#e74c3c'
  };
  return colors[status] || '#95a5a6';
};

export const getSourceColor = (source) => {
  const colors = {
    instagram: '#e1306c',
    facebook: '#1877f2',
    whatsapp: '#25d366'
  };
  return colors[source] || '#95a5a6';
};

export const getSourceIcon = (source) => {
  const icons = {
    instagram: '📷',
    facebook: '👍',
    whatsapp: '💬'
  };
  return icons[source] || '📌';
};
