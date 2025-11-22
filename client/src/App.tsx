
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { Toaster } from 'react-hot-toast';
import { ConfirmDialog } from './components/ConfirmDialog';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('os_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('os_token');
    localStorage.removeItem('os_profile');
    localStorage.removeItem('os_avatar');
    setIsAuthenticated(false);
    setShowLogoutConfirm(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  // Dashboard Theme: Black & White (Light Mode)
  // Login Theme: Dark Blue/Teal (Original)

  return (
    <BrowserRouter>
      <div className={`min-h-screen w-full font-sans transition-colors duration-500 ${isAuthenticated ? 'bg-[#f3f4f6] text-[#111827]' : 'bg-[#2b2b40] text-os-text'}`}>
        {isAuthenticated ? (
          <>
            <Routes>
              <Route path="/login" element={<Navigate to="/dashboard" replace />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardLayout onLogout={handleLogoutClick} currentPage="dashboard" />} />
              <Route path="/users" element={<DashboardLayout onLogout={handleLogoutClick} currentPage="users" />} />
              <Route path="/profile" element={<DashboardLayout onLogout={handleLogoutClick} currentPage="profile" />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            <ConfirmDialog
              isOpen={showLogoutConfirm}
              title="Confirm Logout"
              message="Do you really want to Logout?"
              confirmText="Yes, Logout"
              cancelText="No, Stay"
              onConfirm={handleLogoutConfirm}
              onCancel={handleLogoutCancel}
              type="warning"
            />
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
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
    </BrowserRouter>
  );
};

export default App;
