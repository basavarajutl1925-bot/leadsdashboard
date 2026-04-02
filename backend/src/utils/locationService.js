const axios = require('axios');

class LocationService {
  async getLocationFromIP(ipAddress) {
    try {
      // Using ip-api.com free service (no API key required)
      const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
      
      if (response.data.status === 'success') {
        return {
          city: response.data.city,
          country: response.data.country,
          ipAddress: ipAddress
        };
      }
      
      return {
        city: 'Unknown',
        country: 'Unknown',
        ipAddress: ipAddress
      };
    } catch (error) {
      console.error('Location service error:', error);
      return {
        city: 'Unknown',
        country: 'Unknown',
        ipAddress: ipAddress
      };
    }
  }

  getIPFromRequest(req) {
    return req.headers['x-forwarded-for'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           req.ip ||
           '0.0.0.0';
  }
}

module.exports = new LocationService();
