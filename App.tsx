
import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('os_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('os_token');
    localStorage.removeItem('os_profile');
    localStorage.removeItem('os_avatar');
    setIsAuthenticated(false);
  };

  // Dashboard Theme: Black & White (Light Mode)
  // Login Theme: Dark Blue/Teal (Original)

  return (
    <div className={`min-h-screen w-full font-sans transition-colors duration-500 ${isAuthenticated ? 'bg-[#f3f4f6] text-[#111827]' : 'bg-[#2b2b40] text-os-text'}`}>
      {isAuthenticated ? (
        <DashboardLayout onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: isAuthenticated ? '#ffffff' : '#353550',
            color: isAuthenticated ? '#111827' : '#fff',
            border: isAuthenticated ? '1px solid #e5e7eb' : 'none',
            boxShadow: isAuthenticated ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
          },
        }}
      />
    </div>
  );
};

export default App;
