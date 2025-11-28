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

export const downloadInvoice = (filepath: string) => {
    // Extract invoiceId from filepath or use a different approach if we don't have it here.
    // The previous implementation used filepath directly.
    // The new API requires invoiceId.
    // However, the frontend receives the invoice object which has _id.
    // So we should change this function to accept invoiceId.
    // But wait, the frontend might be calling it with filepath.
    // Let's check BillingPage.tsx.
    // It calls handleDownloadInvoice(inv.filepath, inv.filename).
    // And handleViewInvoice(inv.filepath).
    // So we need to update BillingPage.tsx to pass inv._id instead of filepath.
    // For now, let's update this signature to take invoiceId.
    return `${api.defaults.baseURL}/user/billing/invoices/${filepath}/view`;
};

export default api;
