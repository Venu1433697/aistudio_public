import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { DashboardHome } from './DashboardHome';
import { UsersPage } from './UsersPage';
import { ProfilePage } from './ProfilePage';

interface DashboardLayoutProps {
  onLogout: () => void;
}

export type ViewType = 'dashboard' | 'users' | 'components' | 'forms' | 'tables' | 'profile';

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f3f4f6]">
      {/* Sidebar */}
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar onLogout={onLogout} onNavigate={setCurrentView} />
        
        {/* Main Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {currentView === 'dashboard' && <DashboardHome />}
          {currentView === 'users' && <UsersPage />}
          {currentView === 'profile' && <ProfilePage />}
          
          {/* Placeholders for other views */}
          {(currentView !== 'dashboard' && currentView !== 'users' && currentView !== 'profile') && (
            <div className="flex items-center justify-center h-full text-gray-400">
              Content for {currentView} is under construction.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};