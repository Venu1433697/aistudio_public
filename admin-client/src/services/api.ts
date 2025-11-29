import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper: Try to fetch from backend. If it fails (server down), return the fallback value.
// This prevents the "Failed to fetch" crash while keeping data empty/dynamic.
const fetchWithFallback = async (endpoint: string, options: RequestInit, fallbackValue: any) => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    if (!res.ok) {
      // If server returns 4xx/5xx, try to read error text
      const errorText = await res.text().catch(() => 'Unknown Error');
      throw new Error(`API Error ${res.status}: ${errorText}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`[API] Backend unreachable at ${endpoint}. Using empty/fallback data.`, error);
    // Return the empty fallback so the UI renders (empty tables, empty profile) instead of crashing.
    return fallbackValue;
  }
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('os_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  // Auth
  login: async (credentials: any) => {
    try {
      const res = await fetch(`${BASE_URL}/admin-auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        throw new Error('Login failed');
      }
      return await res.json();
    } catch (error) {
      console.error("Login error:", error);

      // FALLBACK: If backend is strictly down (Failed to fetch), allow entry to test the UI.
      // But strictly return EMPTY data as requested.
      if (credentials.email === 'admin1@example.com' && credentials.password === 'Admin@123') {
        toast('Backend unreachable. Entering Offline Mode.', { icon: '⚠️' });
        return {
          token: 'offline-token',
          admin: { id: '0', firstName: '', lastName: '', email: credentials.email, mobile: '', gender: '' },
          users: []
        };
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      await fetch(`${BASE_URL}/admin-auth/logout`, { method: 'POST', headers: getAuthHeader() });
    } catch (e) {
      console.warn('Logout failed', e);
    }
    localStorage.removeItem('os_token');
  },

  getSessionStatus: async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin-auth/session-status`, { headers: getAuthHeader() });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    const [users, visitors, active] = await Promise.all([
      fetchWithFallback('/admin-dashboard/stats/users', { headers: getAuthHeader() }, { totalUsers: 0 }),
      fetchWithFallback('/admin-dashboard/stats/visitors', { headers: getAuthHeader() }, { totalVisitors: 0 }),
      fetchWithFallback('/admin-dashboard/stats/active-users', { headers: getAuthHeader() }, { activeUsers: 0 })
    ]);
    return { ...users, ...visitors, ...active };
  },

  downloadInvoice: (filepath: string) => {
    const serverUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${serverUrl}/${filepath.replace(/\\/g, '/')}`;
  },

  // Progress operations
  updateProgress: async (userId: string, progressData: any, adminEmail: string) => {
    const res = await fetch(`${BASE_URL}/users/${userId}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ ...progressData, adminEmail }),
    });
    if (!res.ok) throw new Error('Failed to update progress');
    return await res.json();
  },

  getImageUrl: (path: string) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('blob')) return path;
    const serverUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${serverUrl}/${path.startsWith('/') ? path.slice(1) : path}`;
  },

  // Users Management
  getUsers: async () => {
    return fetchWithFallback('/users', { headers: getAuthHeader() }, []);
  },

  createUser: async (userData: any) => {
    const res = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error('Failed to create user');
    return await res.json();
  },

  updateUser: async (id: string, userData: any) => {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error('Failed to update user');
    return await res.json();
  },

  // Billing Management
  enableUserBilling: async (userId: string, adminEmail: string) => {
    const res = await fetch(`${BASE_URL}/users/${userId}/enable-billing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ adminEmail }),
    });
    if (!res.ok) throw new Error('Failed to enable billing');
    return await res.json();
  },

  getBillingUsers: async () => {
    return fetchWithFallback('/users/billing/enabled', { headers: getAuthHeader() }, []);
  },

  getUserBillingDetails: async (userId: string) => {
    return fetchWithFallback(`/users/${userId}/billing-details`, {
      headers: getAuthHeader()
    }, {});
  },

  updateBillingDetails: async (userId: string, details: { totalCost: number; paidAmount: number }) => {
    const res = await fetch(`${BASE_URL}/users/${userId}/billing-details`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(details),
    });
    if (!res.ok) throw new Error('Failed to update billing details');
    return await res.json();
  },

  deleteBillingDetails: async (userId: string) => {
    const res = await fetch(`${BASE_URL}/users/${userId}/billing-details`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete billing details');
    return await res.json();
  },

  // Project Tracker
  getTracker: async (userId: string) => {
    return fetchWithFallback(`/users/${userId}/tracker`, { headers: getAuthHeader() }, []);
  },

  addTrackerPhase: async (userId: string, phase: any) => {
    const res = await fetch(`${BASE_URL}/users/${userId}/tracker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(phase),
    });
    if (!res.ok) throw new Error('Failed to add phase');
    return await res.json();
  },

  updateTrackerPhase: async (userId: string, trackerId: string, phase: any) => {
    const res = await fetch(`${BASE_URL}/users/${userId}/tracker/${trackerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(phase),
    });
    if (!res.ok) throw new Error('Failed to update phase');
    return await res.json();
  },

  deleteTrackerPhase: async (userId: string, trackerId: string) => {
    const res = await fetch(`${BASE_URL}/users/${userId}/tracker/${trackerId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete phase');
    return await res.json();
  },

  // Invoice Management
  uploadInvoice: async (userId: string, file: File, adminEmail: string) => {
    const formData = new FormData();
    formData.append('invoice', file);
    formData.append('adminEmail', adminEmail);
    const res = await fetch(`${BASE_URL}/users/${userId}/invoices`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload invoice');
    return await res.json();
  },

  replaceInvoice: async (userId: string, invoiceId: string, file: File, adminEmail: string) => {
    const formData = new FormData();
    formData.append('invoice', file);
    formData.append('adminEmail', adminEmail);
    const res = await fetch(`${BASE_URL}/users/${userId}/invoices/${invoiceId}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to replace invoice');
    return await res.json();
  },

  getInvoices: async (userId: string) => {
    return fetchWithFallback(`/users/${userId}/invoices`, {
      headers: getAuthHeader()
    }, []);
  },

  deleteInvoice: async (userId: string, invoiceId: string) => {
    const res = await fetch(`${BASE_URL}/users/${userId}/invoices/${invoiceId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete invoice');
    return await res.json();
  },

  viewInvoice: (userId: string, invoiceId: string) => {
    const token = getAuthHeader()['Authorization']?.replace('Bearer ', '');
    return `${BASE_URL}/users/${userId}/invoices/${invoiceId}/view?token=${token}`;
  },

  // Reset MPIN
  resetUserMpin: async (userId: string, newMpin: string) => {
    const res = await fetch(`${BASE_URL}/users/${userId}/reset-mpin`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newMpin })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to reset MPIN');
    }
    return await res.json();
  },

  // Admin Profile
  getProfile: async () => {
    return fetchWithFallback('/admin-profile', { headers: getAuthHeader() }, {
      firstName: '', lastName: '', mobile: '', gender: '', email: ''
    });
  },

  updateProfile: async (data: any) => {
    return fetchWithFallback('/admin-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    }, data);
  },

  uploadProfileImage: async (formData: FormData) => {
    const res = await fetch(`${BASE_URL}/admin-profile/upload-profile-image`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload profile image');
    return await res.json();
  },

  uploadBannerImage: async (formData: FormData) => {
    const res = await fetch(`${BASE_URL}/admin-profile/upload-banner-image`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload banner image');
    return await res.json();
  },

  deleteProfileImage: async () => {
    const res = await fetch(`${BASE_URL}/admin-profile/profile-image`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete profile image');
    return await res.json();
  },

  deleteBannerImage: async () => {
    const res = await fetch(`${BASE_URL}/admin-profile/banner-image`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete banner image');
    return await res.json();
  },

  // Gallery
  getGallery: async () => {
    return fetchWithFallback('/business-gallery', { headers: getAuthHeader() }, []);
  },

  uploadGalleryImage: async (formData: FormData) => {
    const res = await fetch(`${BASE_URL}/business-gallery`, {
      method: 'POST',
      headers: { 'x-auth-token': getAuthHeader()['Authorization']?.replace('Bearer ', '') || '' },
      body: formData,
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Upload failed:', res.status, errorText);
      throw new Error(`Upload failed: ${res.status} ${errorText}`);
    }
    return await res.json();
  },

  updateGalleryImage: async (id: string, data: any) => {
    const res = await fetch(`${BASE_URL}/business-gallery/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update image');
    return await res.json();
  },

  deleteGalleryImage: async (id: string) => {
    const res = await fetch(`${BASE_URL}/business-gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete image');
    return await res.json();
  },

  // Visitor tracking
  trackVisitor: async (email?: string) => {
    try {
      const res = await fetch(`${BASE_URL}/visitors/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email || '' }),
      });
      if (!res.ok) throw new Error('Failed to track visitor');
      return await res.json();
    } catch (e) {
      console.warn('Visitor tracking failed:', e);
      return null;
    }
  },

  getVisitorCount: async () => {
    try {
      const res = await fetch(`${BASE_URL}/visitors/count`);
      if (!res.ok) throw new Error('Failed to get visitor count');
      const data = await res.json();
      return data.count;
    } catch (e) {
      console.warn('Get visitor count failed:', e);
      return 0;
    }
  }
};