import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8080/api';

const axiosInstance = axios.create({ baseURL: API_BASE_URL });

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_token');
    }
    return Promise.reject(error);
  },
);

export const adminApi = {
  login: async (username: string, password: string) => {
    const response = await axiosInstance.post('/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
    }
    return response.data;
  },
  getInstitutions: async () => {
    const response = await axiosInstance.get('/admin/institutions');
    return response.data;
  },
  createInstitution: async (data: unknown) => {
    const response = await axiosInstance.post('/admin/institutions', data);
    return response.data;
  },
  updateInstitution: async (id: number, data: unknown) => {
    const response = await axiosInstance.put(`/admin/institutions/${id}`, data);
    return response.data;
  },
  getInstitutionSettings: async (id: number) => {
    const response = await axiosInstance.get(`/admin/institutions/${id}/settings`);
    return response.data;
  },
  updateInstitutionSettings: async (id: number, data: unknown) => {
    const response = await axiosInstance.put(`/admin/institutions/${id}/settings`, data);
    return response.data;
  },
  resetInstitutionAdminPassword: async (id: number, password: string) => {
    const response = await axiosInstance.post(`/admin/institutions/${id}/reset-admin-password`, { password });
    return response.data;
  },
  deleteInstitution: async (id: number) => {
    await axiosInstance.delete(`/admin/institutions/${id}`);
  },
  getAdminStats: async () => {
    const response = await axiosInstance.get('/admin/stats');
    return response.data;
  },
  getAiTelemetrySummary: async (days = 30) => {
    const response = await axiosInstance.get(`/reports/ai-telemetry-summary?days=${days}`);
    return response.data;
  },
  getAiUsageSummary: async (days = 30) => {
    const response = await axiosInstance.get(`/admin/ai-usage/summary?days=${days}`);
    return response.data;
  },
  getInstitutionAiUsage: async (id: number, days = 30) => {
    const response = await axiosInstance.get(`/admin/institutions/${id}/ai-usage?days=${days}`);
    return response.data;
  },
  getSubscriptions: async () => {
    const response = await axiosInstance.get('/admin/subscriptions');
    return response.data;
  },
  createSubscription: async (data: unknown) => {
    const response = await axiosInstance.post('/admin/subscriptions', data);
    return response.data;
  },
  getPayments: async () => {
    const response = await axiosInstance.get('/admin/payments');
    return response.data;
  },
  getUsers: async () => {
    const response = await axiosInstance.get('/admin/users');
    return response.data;
  },
  createUser: async (data: unknown) => {
    const response = await axiosInstance.post('/admin/users', data);
    return response.data;
  },
  updateUser: async (id: number, data: unknown) => {
    const response = await axiosInstance.put(`/admin/users/${id}`, data);
    return response.data;
  },
  deleteUser: async (id: number) => {
    await axiosInstance.delete(`/admin/users/${id}`);
  },
  getStudents: async () => {
    const response = await axiosInstance.get('/students');
    return response.data;
  },
  getActiveStudentsDetails: async () => {
    const response = await axiosInstance.get('/active-students-details');
    return response.data;
  },
  getSystemSettings: async () => {
    const response = await axiosInstance.get('/admin/system-settings');
    return response.data;
  },
  updateSystemSettings: async (data: unknown) => {
    const response = await axiosInstance.put('/admin/system-settings', data);
    return response.data;
  },
};
