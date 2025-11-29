import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CallToAction: React.FC = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="px-6 md:px-12 pb-20 pt-10">
            <div className="relative bg-[#EAE8E4] rounded-[40px] overflow-hidden p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between min-h-[600px]">

                {/* --- Left Side Content --- */}
                <div className="flex-1 z-20 max-w-xl">
                    <div className="flex items-center gap-3 mb-6 group cursor-pointer">
                        <div className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center group-hover:bg-gray-800 group-hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">Explore premium engineering services</span>
                    </div>

                    <h2 className="text-6xl md:text-7xl font-sans font-medium text-[#1a1a1a] leading-[1.1] mb-10 tracking-tight">
                        Construction <br />
                        Tracking <br />
                        <span className="font-serif italic">Platform</span>
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-16">
                        <button
                            onClick={() => navigate('/signup')}
                            className="bg-black text-white text-base font-bold py-4 px-8 rounded-full hover:bg-gray-800 transition-all shadow-xl"
                        >
                            Start Project
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-3 text-gray-800 font-bold group"
                        >
                            <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-gray-800 transition-colors">
                                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            </div>
                            <span className="underline underline-offset-4 decoration-gray-400 group-hover:decoration-black">See how it works</span>
                        </button>
                    </div>

                    <div className="relative bg-[#d1cbc4]/80 backdrop-blur-sm p-6 rounded-3xl max-w-xs border border-white/20 shadow-lg">
                        <h3 className="text-4xl font-bold text-gray-900 mb-2">1 Million +</h3>
                        <p className="text-sm text-gray-600 font-medium">Sq. ft. of waterproofing coverage delivered for our clients.</p>

                        <div className="flex items-center gap-4 mt-6">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-black"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                            </div>
                            <div className="h-1 w-16 bg-gray-300 rounded-full overflow-hidden">
                                <div className="h-full w-2/3 bg-black rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Right Side Visuals --- */}
                <div className="flex-1 relative w-full h-full mt-12 lg:mt-0 min-h-[500px] flex justify-center lg:justify-end items-center">
                    {/* (Existing SVG and Image code remains same) */}
                    <svg className="absolute top-1/2 left-0 lg:-left-20 w-64 h-64 text-gray-800 z-0 hidden lg:block pointer-events-none opacity-20" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                        <path d="M0 50 C 30 50, 30 20, 60 20" strokeWidth="0.5" strokeDasharray="2 2" />
                        <path d="M0 50 C 30 50, 30 80, 60 80" strokeWidth="0.5" strokeDasharray="2 2" />
                        <circle cx="50" cy="50" r="15" strokeWidth="0.5" />
                        <line x1="50" y1="50" x2="50" y2="20" strokeWidth="0.5" />
                    </svg>

                    <div className="absolute top-0 lg:top-10 left-4 lg:left-20 z-30 bg-[#bdaea3] p-5 rounded-2xl shadow-xl w-48 animate-bounce-slow">
                        <div className="flex gap-1 mb-3">
                            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-800/50 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-800/30 rounded-full"></div>
                        </div>
                        <p className="text-xs font-bold text-gray-800 leading-tight">Take your project timeline under control</p>
                    </div>

                    <div className="relative z-10 w-80 h-96 md:w-96 md:h-[450px] bg-[#dcd6d0] rounded-[40px] overflow-hidden shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
                            alt="Engineer"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    <div className="absolute -top-6 right-10 lg:right-20 z-30">
                        <button className="w-24 h-24 bg-[#ff4d29] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-xl group">
                            <svg className="w-10 h-10 transform group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                        </button>
                    </div>

                    <div className="absolute top-20 -right-4 lg:right-0 z-0 text-center hidden sm:block">
                        <h4 className="text-3xl font-bold text-gray-900">500+</h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Projects</p>
                        <div className="w-px h-12 bg-gray-400 mx-auto mt-2"></div>
                    </div>

                    <div className="absolute bottom-10 -right-4 lg:-right-10 z-0 w-64 h-64 bg-gradient-to-t from-gray-300 to-transparent rounded-full blur-3xl opacity-50"></div>
                </div>

            </div>

            {/* Bottom Features Row */}
            <div className="flex flex-col md:flex-row gap-10 mt-12 px-4">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-2">Fast Execution</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">Make your project analysis faster and create your own way of saving on materials.</p>
                    </div>
                </div>

                <div className="w-px bg-gray-200 hidden md:block"></div>

                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-2">Mobile Tracking</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">Track progress, expenses, and timelines directly from your mobile device.</p>
                    </div>
                </div>
            </div>

            {/* Modal for "See how it works" */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative animate-fade-in-up">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="bg-brand-dark text-white p-8 text-center">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🏗️</span>
                            </div>
                            <h3 className="font-serif text-2xl font-bold mb-2">NK Fearless Solutions</h3>
                            <p className="text-gray-300 text-sm uppercase tracking-wider">Expert Engineering Services</p>
                        </div>

                        <div className="p-8 text-center">
                            <h4 className="text-xl font-bold text-gray-900 mb-4">Explore Our Solutions</h4>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                If you want to know more about these services, create an account and explore the solutions for the problems that you have related to these services.
                            </p>
                            <button
                                onClick={() => { setShowModal(false); navigate('/signup'); }}
                                className="w-full bg-brand-pink text-white font-bold py-3 rounded-full hover:bg-pink-600 transition-colors shadow-md"
                            >
                                Create Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CallToAction;