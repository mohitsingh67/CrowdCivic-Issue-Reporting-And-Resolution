import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getUnapprovedUsers: () => api.get('/auth/unapproved'),
  approveUser: (userId) => api.put(`/auth/${userId}/approve`),
  getAllStaff: () => api.get('/auth/staff')
};

export const reportsAPI = {
  createReport: (formData) => {
    return api.post('/reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getReports: (params) => api.get('/reports', { params }),
  getReportById: (id) => api.get(`/reports/${id}`),
  getMyReports: () => api.get('/reports/my-reports'),
  getAssignedReports: () => api.get('/reports/assigned'),
  updateReport: (id, data) => api.put(`/reports/${id}`, data),
  addComment: (id, comment) => api.post(`/reports/${id}/comment`, comment),
  toggleLike: (id) => api.post(`/reports/${id}/like`)
};

export default api;
