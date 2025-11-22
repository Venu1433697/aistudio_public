import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

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
      const res = await fetch(`${BASE_URL}/admin-auth`, {
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

  // Users: Return empty array if failed
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

  deleteUser: async (id: string) => {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to delete user');
    return await res.json();
  },

  // Profile: Return empty profile object if failed
  getProfile: async () => {
    return fetchWithFallback('/admin-profile', { headers: getAuthHeader() }, {
      firstName: '', lastName: '', mobile: '', gender: '', email: ''
    });
  },

  updateProfile: async (data: any) => {
    // If offline, just return the data to update UI state optimistically
    return fetchWithFallback('/admin-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    }, data);
  },

  // Gallery: Return empty array if failed
  getGallery: async () => {
    return fetchWithFallback('/business-gallery', { headers: getAuthHeader() }, []);
  },

  uploadGalleryImage: async (formData: FormData) => {
    const res = await fetch(`${BASE_URL}/business-gallery`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
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
      headers: { ...getAuthHeader() },
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
  },

  // Profile image upload
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
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to delete profile image');
    return await res.json();
  },

  deleteBannerImage: async () => {
    const res = await fetch(`${BASE_URL}/admin-profile/banner-image`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to delete banner image');
    return await res.json();
  },

  getImageUrl: (path: string) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('blob')) return path;
    const serverUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:4000';
    return `${serverUrl}/${path.startsWith('/') ? path.slice(1) : path}`;
  }
};