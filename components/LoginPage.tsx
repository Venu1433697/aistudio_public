
import React, { useState } from 'react';
import { Eye, EyeOff, Check, Loader2 } from 'lucide-react';
import { LeafDecoration } from './LeafDecoration';
import { api } from '../services/api';
import toast from 'react-hot-toast';

// Logo Component
const Logo: React.FC = () => (
  <div className="flex items-center justify-center gap-2 mb-2">
    <div className="relative w-8 h-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-tr-2xl rounded-bl-2xl opacity-90"></div>
    </div>
    <span className="text-3xl font-semibold text-white tracking-tight">
      oneShop
    </span>
  </div>
);

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isEmailValid = email.includes('@') && email.includes('.');
  const isPasswordStrong = password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await api.login({ email, password });
      
      // Store token
      localStorage.setItem('os_token', data.token);
      
      // Store profile info for UI
      if (data.admin) {
        localStorage.setItem('os_profile', JSON.stringify(data.admin));
      }
      
      // Dispatch event to update Sidebar/Navbar immediately
      window.dispatchEvent(new Event('profileUpdated'));
      
      toast.success('Login successful!');
      onLogin();
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-4">
      
      {/* Main Card */}
      <div className="relative w-full max-w-3xl bg-[#353550] rounded-3xl shadow-2xl overflow-hidden p-8 md:p-16 z-10 flex flex-col items-center text-center">
        
        {/* Decorative Corner */}
        <LeafDecoration />

        {/* Header */}
        <div className="mt-4 mb-12">
          <Logo />
          <p className="text-sm text-gray-400 mb-8 font-light">Fast & Easy Product Management</p>
          <h1 className="text-3xl font-light text-gray-200">Welcome Back!</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8 text-left">
          
          {/* Email Field */}
          <div className="relative group">
            <label className="text-sm text-gray-300 mb-1 block">Email</label>
            <div className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-gray-500 text-white py-2 focus:outline-none focus:border-os-primary transition-colors pr-8 font-light"
                placeholder="admin@oneshop.com"
                disabled={isLoading}
              />
              {isEmailValid && (
                <Check className="absolute right-0 top-2 text-os-primary" size={18} />
              )}
            </div>
            <p className={`text-xs mt-1 transition-opacity ${isEmailValid ? 'text-os-primary opacity-100' : 'opacity-0'}`}>
              Perfect!
            </p>
          </div>

          {/* Password Field */}
          <div className="relative group">
            <label className="text-sm text-gray-300 mb-1 block">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-gray-500 text-white py-2 focus:outline-none focus:border-os-primary transition-colors pr-8 font-light tracking-widest"
                disabled={isLoading}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-2 text-os-primary hover:text-white transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className={`text-xs mt-1 transition-opacity ${isPasswordStrong ? 'text-cyan-500 opacity-100' : 'opacity-0'}`}>
              Your password is strong.
            </p>
          </div>

          {/* Sign In Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-os-primary hover:bg-os-primaryHover text-[#2b2b40] font-semibold py-3 rounded-md shadow-lg shadow-cyan-500/20 transition-all transform active:scale-[0.99] mt-4 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign in'}
          </button>

        </form>

      </div>

    </div>
  );
};
