import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, getProfile, deleteProfile } from '../services/api';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout: authLogout, updateUser: authUpdateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    company: user?.company || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    avatarUrl: user?.avatarUrl || ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        const userData = response.data;
        setFormData({
          name: userData.name,
          company: userData.companyName || '',
          email: userData.email,
          mobile: userData.mobile,
          avatarUrl: userData.profileImage
        });
        authUpdateUser({
          name: userData.name,
          company: userData.companyName,
          email: userData.email,
          mobile: userData.mobile,
          avatarUrl: userData.profileImage
        });
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const response = await updateProfile({
        name: formData.name,
        companyName: formData.company,
        email: formData.email,
        mobile: formData.mobile,
        profileImage: formData.avatarUrl
      });
      authUpdateUser({
        name: response.data.name,
        company: response.data.companyName,
        email: response.data.email,
        mobile: response.data.mobile,
        avatarUrl: response.data.profileImage
      });
      setIsEditing(false);
      alert("Profile Updated Successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, avatarUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setFormData(prev => ({ ...prev, avatarUrl: '' }));
  };

  const handleDeleteProfile = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your profile? This action cannot be undone.");
    if (!confirmed) return;

    try {
      await deleteProfile();
      localStorage.removeItem('token');
      alert("Profile deleted successfully");
      authLogout();
      navigate('/');
    } catch (error) {
      console.error("Failed to delete profile", error);
      alert("Failed to delete profile");
    }
  };

  const triggerFileInput = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in font-sans">

      {/* Common Banner for All Users */}
      <div className="bg-brand-dark text-white py-12 px-6 text-center">
        <h1 className="font-serif text-3xl md:text-4xl font-bold">NK Fearless Solutions</h1>
        <p className="text-gray-400 text-sm mt-2 tracking-wider uppercase">Client Portal</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-10 pb-20">

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

          <div className="px-8 pt-10 pb-10">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row items-center md:items-end mb-10 gap-6 border-b border-gray-100 pb-8">

              {/* Profile Image with Upload */}
              <div className="relative group">
                <div
                  className={`w-24 h-24 rounded-full border-[4px] border-white shadow-lg overflow-hidden shrink-0 bg-brand-pink text-white flex items-center justify-center text-3xl font-bold ${isEditing ? 'cursor-pointer ring-4 ring-brand-pink/20' : ''}`}
                  onClick={triggerFileInput}
                >
                  {formData.avatarUrl ? (
                    <img src={formData.avatarUrl} alt={formData.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{formData.name.charAt(0)}</span>
                  )}
                </div>

                {/* Upload Overlay Icon */}
                {isEditing && (
                  <>
                    <div
                      className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer"
                      onClick={triggerFileInput}
                    >
                      <svg className="w-8 h-8 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    {formData.avatarUrl && (
                      <button
                        onClick={handleDeleteImage}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-lg z-10"
                        title="Remove image"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-900 font-serif">{user.name}</h1>
                <p className="text-gray-500 text-sm font-medium">{user.company || 'Private Client'}</p>
              </div>
              <button
                onClick={() => { authLogout(); navigate('/'); }}
                className="px-6 py-2 bg-gray-100 text-gray-600 font-bold rounded-full hover:bg-red-50 hover:text-red-600 transition-colors text-sm border border-gray-200"
              >
                Log Out
              </button>
            </div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 gap-8">
              {/* Details Form */}
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Account Details</h3>
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="text-sm text-brand-pink font-bold hover:underline flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button onClick={() => { setIsEditing(false); setFormData({ ...user, company: user.company || '', avatarUrl: user.avatarUrl }); }} className="text-sm text-gray-500 font-bold hover:underline">Cancel</button>
                      <button onClick={handleSave} className="text-sm bg-brand-dark text-white px-4 py-1.5 rounded-full font-bold hover:bg-gray-800 shadow-sm">Save Changes</button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      readOnly={!isEditing}
                      className={`w-full border rounded-lg px-4 py-3 text-gray-800 font-medium focus:outline-none transition-all ${isEditing ? 'bg-white border-brand-pink/50 focus:ring-2 focus:ring-brand-pink/20' : 'bg-gray-50 border-gray-200'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Company <span className="text-[10px] normal-case opacity-70">(Optional)</span></label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      readOnly={!isEditing}
                      className={`w-full border rounded-lg px-4 py-3 text-gray-800 font-medium focus:outline-none transition-all ${isEditing ? 'bg-white border-brand-pink/50 focus:ring-2 focus:ring-brand-pink/20' : 'bg-gray-50 border-gray-200'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      readOnly={!isEditing}
                      className={`w-full border rounded-lg px-4 py-3 text-gray-800 font-medium focus:outline-none transition-all ${isEditing ? 'bg-white border-brand-pink/50 focus:ring-2 focus:ring-brand-pink/20' : 'bg-gray-50 border-gray-200'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      readOnly={!isEditing}
                      className={`w-full border rounded-lg px-4 py-3 text-gray-800 font-medium focus:outline-none transition-all ${isEditing ? 'bg-white border-brand-pink/50 focus:ring-2 focus:ring-brand-pink/20' : 'bg-gray-50 border-gray-200'}`}
                    />
                  </div>
                </div>
              </section>

              {/* Financials & Security */}
              <section className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Account Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Billing Button */}
                  <div
                    onClick={() => navigate('/billing')}
                    className="flex items-center justify-between bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Billing & Payments</p>
                        <p className="text-xs text-gray-500">View invoices & payment history</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>

                  {/* Reset PIN Button */}
                  <div
                    onClick={() => navigate('/reset-mpin')}
                    className="flex items-center justify-between bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-brand-pink/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-brand-pink shadow-sm group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-brand-pink transition-colors">Reset M-PIN</p>
                        <p className="text-xs text-gray-500">Update access security</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>

                {/* Delete Profile Button */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={handleDeleteProfile}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 hover:bg-red-100 hover:border-red-300 transition-all font-bold"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Delete Profile
                  </button>
                </div>
              </section>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;