
import React, { useState, useEffect } from 'react';
import { User, LogOut, Menu } from 'lucide-react';
import { ViewType } from './DashboardLayout';

interface TopNavbarProps {
  onLogout: () => void;
  onNavigate?: (view: ViewType) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onLogout, onNavigate }) => {
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=default');

  useEffect(() => {
    const loadProfile = () => {
        const storedProfile = localStorage.getItem('os_profile');
        const storedAvatar = localStorage.getItem('os_avatar');
        
        if (storedProfile) {
            try {
                const parsed = JSON.parse(storedProfile);
                setUserName(parsed.firstName || 'Admin');
            } catch (e) { console.error('Error parsing profile', e); }
        } else {
            setUserName('Admin');
        }
        
        if (storedAvatar) {
            setUserAvatar(storedAvatar);
        }
    };

    loadProfile();
    window.addEventListener('profileUpdated', loadProfile);
    return () => window.removeEventListener('profileUpdated', loadProfile);
  }, []);

  const handleNavClick = (e: React.MouseEvent, view: ViewType) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(view);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0 text-gray-800">
      
      {/* Left Side (Mobile Menu Placeholder) */}
      <div className="flex items-center gap-4">
        <button className="md:hidden text-gray-500 hover:text-black transition-colors">
            <Menu size={24} />
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Profile Dropdown Trigger */}
        <div className="flex items-center gap-3 relative group cursor-pointer">
           <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-300 group-hover:border-gray-500 transition-all">
                <img src={userAvatar} alt="Profile" className="w-full h-full bg-gray-100 object-cover" />
           </div>
           <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors">{userName}</div>
           </div>
           
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-3 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50">
                <a 
                  href="#" 
                  onClick={(e) => handleNavClick(e, 'profile')}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                    <User size={16} /> My Profile
                </a>
                <div className="my-1 border-t border-gray-100"></div>
                <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </div>

      </div>
    </header>
  );
};
