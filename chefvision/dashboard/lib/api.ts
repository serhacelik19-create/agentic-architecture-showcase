import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token if available
api.interceptors.request.use(
    (config) => {
        // In a real app, you'd get this from cookies or local storage
        // For admin, we might use a hardcoded secret or a specific token
        const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const adminApi = {
    getFinancials: async (days: number = 30) => {
        const response = await api.get(`/admin/stats/financials?days=${days}`);
        return response.data;
    },
    getUserStats: async () => {
        const response = await api.get('/admin/stats/users');
        return response.data;
    },
    getContentStats: async () => {
        const response = await api.get('/admin/stats/content');
        return response.data;
    },
    searchUsers: async (query: string) => {
        const response = await api.get(`/admin/users/search?query=${query}`);
        return response.data;
    },
    updateSystemSettings: async (settings: any) => {
        const response = await api.put('/admin/system-settings', settings);
        return response.data;
    },
    getSystemSettings: async () => {
        const response = await api.get('/admin/system-settings');
        return response.data;
    },
    // Admin user management
    getAdmins: async () => {
        const response = await api.get('/admin/admins');
        return response.data;
    },
    createAdmin: async (data: { email: string; password: string; name: string }) => {
        const response = await api.post('/admin/admins', data);
        return response.data;
    },
    updateAdmin: async (userId: number, data: { name?: string; email?: string; password?: string }) => {
        const response = await api.put(`/admin/admins/${userId}`, data);
        return response.data;
    },
    deleteAdmin: async (userId: number) => {
        const response = await api.delete(`/admin/admins/${userId}`);
        return response.data;
    },
    // User Management Actions
    getUserDetails: async (userId: number) => {
        const response = await api.get(`/admin/users/${userId}`);
        return response.data;
    },
    resetUserPassword: async (userId: number, newPassword: string) => {
        const response = await api.post(`/admin/users/${userId}/reset-password`, { new_password: newPassword });
        return response.data;
    },
    resetDeviceLock: async (userId: number) => {
        const response = await api.put(`/admin/users/${userId}/reset-device-lock`);
        return response.data;
    },
    updateUserSubscription: async (userId: number, data: { is_pro: boolean, tier: string, duration_days?: number }) => {
        const response = await api.put(`/admin/users/${userId}/subscription`, data);
        return response.data;
    }
};

export default api;
