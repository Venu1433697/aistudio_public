import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [pin, setPin] = useState(['', '', '', '']);
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < 3) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const mpin = pin.join('');

    try {
      const response = await login({ mobile, mpin });
      authLogin(response.data.user, response.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans animate-fade-in">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-[35%] relative flex-col justify-between p-12 bg-gray-900 overflow-hidden text-white">
        <div className="relative z-20">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="font-serif text-2xl font-bold tracking-tight flex items-center gap-2 mb-2">
            <span className="bg-brand-pink text-white w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold">NK</span>
            NK Fearless
          </a>
          <p className="text-gray-200 text-sm font-medium drop-shadow-md">Welcome back, Partner.</p>
        </div>
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop" alt="Construction Site" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-transparent to-gray-900/90"></div>
        </div>
        <div className="relative z-20">
          <p className="font-bold text-lg leading-tight text-white drop-shadow-lg">Engineering Excellence</p>
          <p className="text-sm text-gray-100 mt-1 drop-shadow-md">Verified by <span className="font-bold text-white">NK Fearless Solutions</span></p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex flex-col p-6 lg:p-24 justify-center overflow-y-auto">
        <div className="w-full max-w-lg mx-auto">
          <div className="flex justify-end mb-8 lg:mb-12 absolute top-6 right-6 lg:static">
            <p className="text-sm text-gray-500">
              New to NK Fearless? <button onClick={() => navigate('/signup')} className="text-blue-600 font-medium hover:underline">Sign Up</button>
            </p>
          </div>
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-serif">Sign In</h2>
            <p className="text-gray-500">Access your projects and requests.</p>
          </div>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Mobile Number</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91"
                className="w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-brand-pink/50 focus:ring-4 focus:ring-brand-pink/10 border-2 rounded-lg px-4 py-4 outline-none transition-all font-medium"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-bold text-gray-900">Enter M-PIN</label>
                {/* UPDATED: Navigate to 'reset-mpin' on click */}
                <button type="button" onClick={() => navigate('/reset-mpin')} className="text-xs text-brand-pink font-medium hover:underline">Forgot M-PIN?</button>
              </div>
              <div className="flex gap-4">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { pinRefs.current[index] = el; }}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-16 h-16 text-center text-3xl font-bold bg-gray-50 border-gray-200 focus:bg-white focus:border-brand-pink/50 focus:ring-4 focus:ring-brand-pink/10 border-2 rounded-xl outline-none transition-all placeholder-gray-300"
                    placeholder="•"
                  />
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-brand-dark text-white font-bold py-4 rounded-full hover:bg-gray-800 transition-colors shadow-lg mt-6 text-lg disabled:opacity-50">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-12 text-center">
            Protected by NK Security Standards. <br />
            <a href="#" className="underline hover:text-gray-600">Privacy Policy</a> &bull; <a href="#" className="underline hover:text-gray-600">Help Center</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;