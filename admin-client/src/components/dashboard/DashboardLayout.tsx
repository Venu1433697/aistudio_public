import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { DashboardHome } from './DashboardHome';
import { UsersPage } from './UsersPage';
import { ProfilePage } from './ProfilePage';
import { BillingPage } from './BillingPage';
import { BillingDetailsPage } from './BillingDetailsPage';
import { api } from '../../services/api';

interface DashboardLayoutProps {
  onLogout: () => void;
  currentPage: 'dashboard' | 'users' | 'profile' | 'billing' | 'billing-details';
}

export type ViewType = 'dashboard' | 'users' | 'components' | 'forms' | 'tables' | 'profile' | 'billing' | 'billing-details';

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout, currentPage }) => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [profileImage, setProfileImage] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>(userId || '');

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
    else if (view === 'billing') navigate('/billing');
  };

  const handleNavigateToBillingDetails = (userId: string) => {
    setSelectedUserId(userId);
    navigate(`/billing/${userId}`);
  };

  const handleBackToBilling = () => {
    navigate('/billing');
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
          {currentPage === 'billing' && <BillingPage onNavigateToBillingDetails={handleNavigateToBillingDetails} />}
          {currentPage === 'billing-details' && selectedUserId && (
            <BillingDetailsPage userId={selectedUserId} onBack={handleBackToBilling} />
          )}
        </main>
      </div>
    </div>
  );
};