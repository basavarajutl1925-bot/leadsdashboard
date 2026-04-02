import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const leadAPI = {
  // Create a new lead
  createLead: (leadData) => apiClient.post('/leads', leadData),

  // Get all leads
  getAllLeads: (params) => apiClient.get('/leads', { params }),

  // Get lead statistics
  getStats: (params) => apiClient.get('/leads/stats', { params }),

  // Get single lead
  getLead: (id) => apiClient.get(`/leads/${id}`),

  // Update lead
  updateLead: (id, data) => apiClient.put(`/leads/${id}`, data),

  // Delete lead
  deleteLead: (id) => apiClient.delete(`/leads/${id}`),

  // Get message status
  getMessageStatus: (id) => apiClient.get(`/leads/${id}/message-status`)
};

export const adsExpenseAPI = {
  createExpense: (expenseData) => apiClient.post('/ads-expenses', expenseData),
  getAllExpenses: (params) => apiClient.get('/ads-expenses', { params }),
  getSummary: (params) => apiClient.get('/ads-expenses/summary', { params }),
  updateExpense: (id, data) => apiClient.put(`/ads-expenses/${id}`, data),
  deleteExpense: (id) => apiClient.delete(`/ads-expenses/${id}`)
};

export default apiClient;
