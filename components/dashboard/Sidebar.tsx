
import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Users,
  User
} from 'lucide-react';
import { ViewType } from './DashboardLayout';

interface SidebarProps {
  currentView?: ViewType;
  onNavigate?: (view: ViewType) => void;
}

const NavItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  badge?: string; 
  badgeColor?: string;
  onClick?: () => void;
}> = ({ icon, label, active, badge, badgeColor, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-[calc(100%-32px)] mx-4 flex items-center gap-3.5 px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 relative group text-left mb-2
      ${active 
        ? 'bg-black text-white shadow-lg shadow-gray-200 translate-x-1' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'
      }`}
  >
    <span className={`transition-colors ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>
      {icon}
    </span>
    <span className="tracking-wide">{label}</span>
    
    {badge && (
      <span className={`absolute right-3 ${badgeColor || 'bg-gray-900'} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
        {badge}
      </span>
    )}
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView = 'dashboard', onNavigate }) => {
  // State for user profile data - Init empty
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=default');

  // Load profile data from storage and listen for updates
  useEffect(() => {
    const loadProfile = () => {
        const storedProfile = localStorage.getItem('os_profile');
        const storedAvatar = localStorage.getItem('os_avatar');
        
        if (storedProfile) {
            try {
                const parsed = JSON.parse(storedProfile);
                // Show First Name, or 'Admin' if empty
                if (parsed.firstName) setUserName(parsed.firstName);
                else setUserName('Admin');
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
  
  const handleNav = (view: ViewType) => {
    if (onNavigate) onNavigate(view);
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-200 hidden md:flex flex-col h-full shrink-0 z-20 relative">
      {/* Profile Header Area */}
      <div className="h-24 flex items-center px-6 border-b border-gray-100 gap-4 mb-4">
        <div className="flex items-center gap-4 w-full overflow-hidden p-2 rounded-xl transition-colors hover:bg-gray-50 cursor-pointer group">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-gray-300 transition-colors shrink-0 shadow-sm bg-gray-100">
               <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col overflow-hidden">
                <h1 className="text-base font-bold text-gray-900 tracking-tight truncate group-hover:text-black" title={userName}>
                  {userName}
                </h1>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider truncate">Administrator</span>
            </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <div className="px-6 mb-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Menu</div>
        
        <NavItem 
          icon={<LayoutDashboard size={20} strokeWidth={2} />} 
          label="Dashboard" 
          active={currentView === 'dashboard'} 
          onClick={() => handleNav('dashboard')}
        />
        
        <NavItem 
          icon={<Users size={20} strokeWidth={2} />} 
          label="Users" 
          active={currentView === 'users'} 
          onClick={() => handleNav('users')}
        />

        <NavItem 
          icon={<User size={20} strokeWidth={2} />} 
          label="Profile" 
          active={currentView === 'profile'} 
          onClick={() => handleNav('profile')}
        />
      </nav>
      
      {/* Decorative Footer Element */}
      <div className="p-6 mt-auto">
         <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-xs text-gray-400 text-center font-medium">© 2024 Dashboard</p>
         </div>
      </div>
    </aside>
  );
};
