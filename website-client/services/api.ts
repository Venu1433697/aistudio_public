import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const signup = (userData: any) => api.post('/auth/signup', userData);
export const login = (credentials: any) => api.post('/auth/login', credentials);
export const forgotMpinVerify = (mobile: string) => api.post('/auth/forgot-mpin-verify', { mobile });
export const resetMpinUnauth = (data: any) => api.post('/auth/reset-mpin-unauth', data);
export const getProfile = () => api.get('/user/profile');
export const updateProfile = (userData: any) => api.put('/user/profile', userData);
export const resetMpin = (data: any) => api.post('/user/reset-mpin', data);
export const deleteProfile = () => api.delete('/user/profile');

// Billing
export const getBillingSummary = () => api.get('/user/billing');
export const getProjectTracker = () => api.get('/user/billing/tracker');
export const getInvoices = () => api.get('/user/billing/invoices');
export const getPayments = () => api.get('/user/billing/payments');

export const downloadInvoice = (invoiceId: string) => {
    const token = localStorage.getItem('token');
    return `${API_URL}/user/billing/invoices/${invoiceId}/view${token ? `?token=${token}` : ''}`;
};

export default api;
