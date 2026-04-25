import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const taskService = {
  getTasks: async (token, filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const res = await axios.get(`${API_URL}?${params}`, getConfig(token));
    return res.data;
  },
  getTask: async (token, id) => {
    const res = await axios.get(`${API_URL}/${id}`, getConfig(token));
    return res.data;
  },
  createTask: async (token, taskData) => {
    const res = await axios.post(API_URL, taskData, getConfig(token));
    return res.data;
  },
  updateTask: async (token, id, taskData) => {
    const res = await axios.put(`${API_URL}/${id}`, taskData, getConfig(token));
    return res.data;
  },
  deleteTask: async (token, id) => {
    const res = await axios.delete(`${API_URL}/${id}`, getConfig(token));
    return res.data;
  },
};
