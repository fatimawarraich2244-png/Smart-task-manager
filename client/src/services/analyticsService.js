import axios from 'axios';

const API_URL = 'http://localhost:5000/api/analytics';

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const analyticsService = {
  getAnalytics: async (token) => {
    const res = await axios.get(API_URL, getConfig(token));
    return res.data;
  },
  createFocusSession: async (token, data) => {
    const res = await axios.post(`${API_URL}/focus`, data, getConfig(token));
    return res.data;
  },
  getFocusSessions: async (token) => {
    const res = await axios.get(`${API_URL}/focus`, getConfig(token));
    return res.data;
  },
};
