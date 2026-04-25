import axios from 'axios';

const API_URL = 'https://smart-task-manager34324.vercel.app/api/auth';

export const authService = {
  register: async (name, email, password) => {
    const res = await axios.post(`${API_URL}/register`, { name, email, password });
    return res.data;
  },
  login: async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    return res.data;
  },
  getProfile: async (token) => {
    const res = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
  updateProfile: async (token, data) => {
    const res = await axios.put(`${API_URL}/profile`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
