import React, { useState, useRef } from 'react';
import { User } from '../types';
import { signup } from '../services/api';

interface SignUpProps {
  onNavigate: (view: string) => void;
  onLogin: (user: User) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    mobile: '',
  });
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const validateMpin = (mpin: string) => {
    if (mpin.length !== 4) return false;

    // Check for sequential adjacent digits
    for (let i = 0; i < mpin.length - 1; i++) {
      if (Math.abs(parseInt(mpin[i]) - parseInt(mpin[i + 1])) === 1) return false;
    }

    // Check for duplicate adjacent digits
    for (let i = 0; i < mpin.length - 1; i++) {
      if (mpin[i] === mpin[i + 1]) return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const mpin = pin.join('');
    if (!validateMpin(mpin)) {
      setError('Invalid M-Pin. Must be 4 digits, no sequential or duplicate adjacent numbers.');
      setLoading(false);
      return;
    }

    try {
      const response = await signup({ ...formData, mpin });
      localStorage.setItem('token', response.data.token);
      onLogin(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans animate-fade-in">
      <div className="hidden lg:flex lg:w-[35%] relative flex-col justify-between p-12 bg-gray-900 overflow-hidden text-white">
        <div className="relative z-20">
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="font-serif text-2xl font-bold tracking-tight flex items-center gap-2 mb-2">
            <span className="bg-brand-pink text-white w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold">NK</span>
            NK Fearless
          </a>
          <p className="text-gray-200 text-sm font-medium drop-shadow-md">Building trust through fearless engineering.</p>
        </div>
        <div className="absolute inset-0 z-0">
          <img src="https://t4.ftcdn.net/jpg/01/59/71/46/360_F_159714668_J3M07W0d5Xb7wc65e8e8g140723149.jpg" alt="Waterproofing Protection" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-transparent to-gray-900/80"></div>
        </div>
        <div className="relative z-20">
          <p className="font-bold text-lg leading-tight text-white drop-shadow-lg">Total Waterproofing Protection</p>
          <p className="text-sm text-gray-100 mt-1 drop-shadow-md">Secured by <span className="font-bold text-white">NK Fearless Solutions</span></p>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-lg mx-auto">
          <div className="flex justify-end mb-8 lg:mb-12">
            <p className="text-sm text-gray-500">
              Already a member? <button onClick={() => onNavigate('login')} className="text-blue-600 font-medium hover:underline">Sign In</button>
            </p>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 font-serif">Sign up to NK Fearless</h2>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-brand-pink/50 focus:ring-4 focus:ring-brand-pink/10 border-2 rounded-lg px-4 py-3 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Company <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-brand-pink/50 focus:ring-4 focus:ring-brand-pink/10 border-2 rounded-lg px-4 py-3 outline-none transition-all" />
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-brand-pink/50 focus:ring-4 focus:ring-brand-pink/10 border-2 rounded-lg px-4 py-3 outline-none transition-all" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-900 mb-2">Mobile Number</label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} required className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-brand-pink/50 focus:ring-4 focus:ring-brand-pink/10 border-2 rounded-lg px-4 py-3 outline-none transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">Create M-PIN <span className="text-gray-400 font-normal">(4 Digits)</span></label>
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
                    className="w-14 h-14 md:w-16 md:h-16 text-center text-2xl font-bold bg-gray-100 border-transparent focus:bg-white focus:border-brand-pink/50 focus:ring-4 focus:ring-brand-pink/10 border-2 rounded-xl outline-none transition-all placeholder-gray-300"
                    placeholder="•"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">This PIN will be used for quick mobile login.</p>
            </div>
            <div className="flex items-start gap-3 mt-4">
              <input type="checkbox" id="terms" required className="mt-1 w-5 h-5 text-brand-pink border-gray-300 rounded focus:ring-brand-pink cursor-pointer" />
              <label htmlFor="terms" className="text-sm text-gray-500 cursor-pointer">
                Creating an account means you're okay with our <a href="#" className="text-brand-dark font-medium underline">Terms of Service</a>, <a href="#" className="text-brand-dark font-medium underline">Privacy Policy</a>, and our default <a href="#" className="text-brand-dark font-medium underline">Notification Settings</a>.
              </label>
            </div>
            <button type="submit" disabled={loading} className="w-full md:w-auto md:px-12 bg-brand-pink text-white font-bold py-3.5 rounded-full hover:bg-pink-600 transition-colors shadow-lg mt-4 disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-10 w-full max-w-xs">
            This site is protected by reCAPTCHA and the Google <a href="#" className="underline">Privacy Policy</a> and <a href="#" className="underline">Terms of Service</a> apply.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;