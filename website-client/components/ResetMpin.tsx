import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { forgotMpinVerify, resetMpinUnauth, resetMpin } from '../services/api';

const ResetMpin: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const userMobile = user?.mobile;
    // If userMobile is present, we are in "Change PIN" mode (logged in).
    // If userMobile is missing, we are in "Forgot PIN" mode (logged out), so start at mobile verification step.
    const [step, setStep] = useState<'verify' | 'new-pin' | 'forgot-verify'>(userMobile ? 'verify' : 'forgot-verify');

    const [oldPin, setOldPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');

    // Initialize empty to force manual verification
    const [enteredMobile, setEnteredMobile] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const validateMpin = (mpin: string) => {
        if (mpin.length !== 4) return false;
        for (let i = 0; i < mpin.length - 1; i++) {
            if (Math.abs(parseInt(mpin[i]) - parseInt(mpin[i + 1])) === 1) return false;
        }
        for (let i = 0; i < mpin.length - 1; i++) {
            if (mpin[i] === mpin[i + 1]) return false;
        }
        return true;
    };

    const handleVerifyOldPin = async (e: React.FormEvent) => {
        e.preventDefault();
        // In authenticated flow, we verify old PIN during the reset call.
        // So here we just move to the next step if it looks valid.
        if (oldPin.length === 4) {
            setStep('new-pin');
            setError('');
        } else {
            setError('Please enter a 4-digit M-PIN');
        }
    };

    const handleForgotVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await forgotMpinVerify(enteredMobile);
            setStep('new-pin');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Mobile verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNewPin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPin.length !== 4) {
            setError('M-PIN must be 4 digits');
            return;
        }
        if (newPin !== confirmPin) {
            setError('M-PINs do not match. Please re-enter correctly.');
            return;
        }
        if (!validateMpin(newPin)) {
            setError('Invalid M-Pin. Must be 4 digits, no sequential or duplicate adjacent numbers.');
            return;
        }

        setLoading(true);

        try {
            if (userMobile && step === 'new-pin' && oldPin) {
                // Authenticated Reset
                await resetMpin({ oldMpin: oldPin, newMpin: newPin });
            } else {
                // Unauthenticated Reset
                await resetMpinUnauth({ mobile: enteredMobile || userMobile, newMpin: newPin });
            }
            setSuccess('M-PIN Updated Successfully!');
            setTimeout(() => {
                navigate(userMobile ? '/profile' : '/login');
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update M-PIN');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-sans animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">

                {/* Header */}
                <div className="bg-brand-dark text-white p-6 text-center relative">
                    <button onClick={() => navigate(userMobile ? '/profile' : '/login')} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h2 className="text-xl font-bold font-serif">Reset M-PIN</h2>
                </div>

                <div className="p-8">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
                            <p className="text-gray-500">Your M-PIN has been updated securely.</p>
                        </div>
                    ) : (
                        <>
                            {/* STEP 1: Verify Old PIN (Only if logged in/changing) */}
                            {step === 'verify' && (
                                <form onSubmit={handleVerifyOldPin} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Enter Old M-PIN</label>
                                        <input
                                            type="password"
                                            maxLength={4}
                                            value={oldPin}
                                            onChange={(e) => setOldPin(e.target.value)}
                                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 text-center text-2xl font-bold tracking-widest focus:border-brand-pink/50 focus:outline-none"
                                            placeholder="••••"
                                        />
                                    </div>
                                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                                    <button type="submit" className="w-full bg-brand-dark text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors">
                                        Verify
                                    </button>

                                    <div className="text-center">
                                        <button type="button" onClick={() => { setStep('forgot-verify'); setError(''); setEnteredMobile(''); }} className="text-sm text-brand-pink font-bold hover:underline">
                                            Forgot Old M-PIN?
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* STEP 1 (Alt): Verify Mobile (Forgot Flow or Not Logged In) */}
                            {step === 'forgot-verify' && (
                                <form onSubmit={handleForgotVerify} className="space-y-6">
                                    <p className="text-sm text-gray-500 mb-4">Please verify your identity by entering your registered mobile number.</p>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
                                        <input
                                            type="tel"
                                            value={enteredMobile}
                                            onChange={(e) => setEnteredMobile(e.target.value)}
                                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 font-medium focus:border-brand-pink/50 focus:outline-none"
                                            placeholder="Enter registered number"
                                        />
                                    </div>
                                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                                    <button type="submit" disabled={loading} className="w-full bg-brand-dark text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50">
                                        {loading ? 'Verifying...' : 'Send OTP & Verify'}
                                    </button>

                                    {/* Only show back button if user was logged in and came from verify step */}
                                    {userMobile && (
                                        <div className="text-center">
                                            <button type="button" onClick={() => { setStep('verify'); setError(''); }} className="text-sm text-gray-400 hover:text-gray-600">
                                                Back to Old M-PIN
                                            </button>
                                        </div>
                                    )}
                                </form>
                            )}

                            {/* STEP 2: Set New PIN */}
                            {step === 'new-pin' && (
                                <form onSubmit={handleSaveNewPin} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">New M-PIN</label>
                                        <input
                                            type="password"
                                            maxLength={4}
                                            value={newPin}
                                            onChange={(e) => setNewPin(e.target.value)}
                                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 text-center text-2xl font-bold tracking-widest focus:border-brand-pink/50 focus:outline-none"
                                            placeholder="••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New M-PIN</label>
                                        <input
                                            type="password"
                                            maxLength={4}
                                            value={confirmPin}
                                            onChange={(e) => setConfirmPin(e.target.value)}
                                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 text-center text-2xl font-bold tracking-widest focus:border-brand-pink/50 focus:outline-none"
                                            placeholder="••••"
                                        />
                                    </div>
                                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                                    <button type="submit" disabled={loading} className="w-full bg-brand-pink text-white font-bold py-3 rounded-lg hover:bg-pink-600 transition-colors shadow-md disabled:opacity-50">
                                        {loading ? 'Updating...' : 'Update M-PIN'}
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetMpin;