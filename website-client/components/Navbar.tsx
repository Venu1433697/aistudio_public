
import React, { useState } from 'react';
import { User } from '../types';

interface NavbarProps {
  onNavigate: (view: string) => void;
  isLoggedIn: boolean;
  user?: User;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, isLoggedIn, user }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center h-20 md:h-24 px-6 md:px-10 bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>

        {/* Logo */}
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="font-serif text-xl md:text-2xl font-bold text-brand-dark tracking-tight hover:text-gray-700 transition-colors flex items-center gap-2">
          <span className="bg-brand-dark text-white w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold shadow-sm">NK</span>
          NK Fearless
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          {/* Added Services Link */}
          <li><button onClick={() => onNavigate('services')} className="hover:text-black transition-colors">Services</button></li>
          <li><button onClick={() => onNavigate('projects')} className="hover:text-black transition-colors">Projects</button></li>
          <li><button onClick={() => onNavigate('about')} className="hover:text-black transition-colors">About Us</button></li>
        </ul>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Icon (Mobile) */}
        <button className="md:hidden text-gray-500">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>

        {isLoggedIn ? (
          /* Profile Icon for Logged In State */
          <button 
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-3 group focus:outline-none pl-4 border-l border-gray-200"
          >
             <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-gray-900 leading-tight">{user?.name || 'User'}</p>
                <p className="text-[10px] text-gray-500 font-medium">{user?.company || 'Client Account'}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-md overflow-hidden group-hover:ring-2 group-hover:ring-brand-pink transition-all relative">
                <img 
                  src={user?.avatarUrl || "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
             </div>
          </button>
        ) : (
          /* Auth Buttons for Guest State */
          <>
            <button onClick={() => onNavigate('login')} className="hidden md:block text-sm font-medium text-gray-600 hover:text-black">Log in</button>
            <button 
              onClick={() => onNavigate('signup')} 
              className="text-sm font-bold text-white bg-brand-dark rounded-full px-5 py-2.5 hover:bg-gray-800 transition-all shadow-md"
            >
              Sign up
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-white border-b border-gray-100 p-4 flex flex-col gap-4 md:hidden shadow-lg animate-fade-in-down z-50">
           <button onClick={() => { onNavigate('services'); setIsOpen(false); }} className="text-left font-medium text-gray-600">Services</button>
           <button onClick={() => { onNavigate('projects'); setIsOpen(false); }} className="text-left font-medium text-gray-600">Projects</button>
           <button onClick={() => { onNavigate('about'); setIsOpen(false); }} className="text-left font-medium text-gray-600">About Us</button>
           
           <hr />
           
           {isLoggedIn ? (
             <button onClick={() => { onNavigate('profile'); setIsOpen(false); }} className="text-left font-medium text-brand-pink flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                   <img src={user?.avatarUrl} className="w-full h-full object-cover" />
                </div>
                My Profile
             </button>
           ) : (
             <>
               <button onClick={() => { onNavigate('login'); setIsOpen(false); }} className="text-left font-medium text-gray-600">Log in</button>
               <button onClick={() => { onNavigate('signup'); setIsOpen(false); }} className="text-left font-medium text-brand-pink">Sign up</button>
             </>
           )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
