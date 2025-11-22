import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { DashboardHome } from './DashboardHome';
import { UsersPage } from './UsersPage';
import { ProfilePage } from './ProfilePage';
import { api } from '../../services/api';

interface DashboardLayoutProps {
  onLogout: () => void;
  currentPage: 'dashboard' | 'users' | 'profile';
}

export type ViewType = 'dashboard' | 'users' | 'components' | 'forms' | 'tables' | 'profile';

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout, currentPage }) => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string>('');

  // Fetch profile image from backend
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const profile = await api.getProfile();
        if (profile.profileImage) {
          setProfileImage(api.getImageUrl(profile.profileImage));
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };
    fetchProfileImage();

    // Listen for profile updates
    const handleProfileUpdate = () => {
      fetchProfileImage();
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  const handleNavigate = (view: ViewType) => {
    if (view === 'dashboard') navigate('/dashboard');
    else if (view === 'users') navigate('/users');
    else if (view === 'profile') navigate('/profile');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f3f4f6]">
      {/* Sidebar */}
      <Sidebar currentView={currentPage} onNavigate={handleNavigate} profileImage={profileImage} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar onLogout={onLogout} onNavigate={handleNavigate} profileImage={profileImage} />

        {/* Main Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {currentPage === 'dashboard' && <DashboardHome />}
          {currentPage === 'users' && <UsersPage />}
          {currentPage === 'profile' && <ProfilePage />}
        </main>
      </div>
    </div>
  );
};