import React from 'react';

const ServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in font-sans">
      
      {/* Hero Header */}
      <div className="bg-brand-dark text-white py-20 px-6 text-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-20">
             <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2000&fit=crop" className="w-full h-full object-cover" />
         </div>
         <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">Our Services</h1>
            <p className="text-gray-300 text-lg">Comprehensive engineering solutions tailored to your needs. From foundation to finish, we have you covered.</p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        
        {/* Waterproofing Section */}
        <section className="mb-24">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900">Waterproofing Services</h2>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-10 mb-10">
                <div className="lg:w-1/3 rounded-xl overflow-hidden shadow-lg h-64 lg:h-auto">
                    <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&fit=crop" alt="Waterproofing" className="w-full h-full object-cover" />
                </div>
                <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <h3 className="font-bold text-xl mb-2 text-gray-800">Residential</h3>
                        <p className="text-gray-500 text-sm mb-4">Complete protection for homes including terraces, walls, and bathrooms to prevent dampness and seepage.</p>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                            <li>Terrace Leakage Repair</li>
                            <li>Bathroom Sealing</li>
                            <li>Wall Dampness Treatment</li>
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <h3 className="font-bold text-xl mb-2 text-gray-800">Commercial</h3>
                        <p className="text-gray-500 text-sm mb-4">Heavy-duty solutions for office buildings, malls, and industrial complexes.</p>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                            <li>Basement Retaining Walls</li>
                            <li>Podium Deck Waterproofing</li>
                            <li>Expansion Joint Sealing</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        {/* Construction Section */}
        <section className="mb-24">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900">Building & Installation</h2>
            </div>

            <div className="flex flex-col lg:flex-row-reverse gap-10 mb-10">
                <div className="lg:w-1/3 rounded-xl overflow-hidden shadow-lg h-64 lg:h-auto">
                    <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&fit=crop" alt="Construction" className="w-full h-full object-cover" />
                </div>
                <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <h3 className="font-bold text-xl mb-2 text-gray-800">General Contracting</h3>
                        <p className="text-gray-500 text-sm mb-4">End-to-end construction services for new projects.</p>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                            <li>Luxury Villas & Bungalows</li>
                            <li>Apartment Complexes</li>
                            <li>Commercial Buildings</li>
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <h3 className="font-bold text-xl mb-2 text-gray-800">Industrial Installations</h3>
                        <p className="text-gray-500 text-sm mb-4">Installation and maintenance of piping & electrical systems.</p>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                            <li>High-Pressure Piping</li>
                            <li>Gas & Fuel Lines</li>
                            <li>Electrical Grid Wiring</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        {/* Civil Instruments Section */}
        <section>
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-pink-100 text-brand-pink rounded-lg">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900">Civil Engineering Instruments</h2>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/3 rounded-lg overflow-hidden h-48 md:h-64 shadow-sm">
                    <img src="https://images.unsplash.com/photo-1581094794329-cd1361d78571?q=80&w=800&fit=crop" alt="Instruments" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <div>
                        <h3 className="font-bold text-xl mb-4 text-gray-800">Maintenance & Repair</h3>
                        <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                            Systematic upkeep for sensitive instruments to ensure accuracy.
                        </p>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                            <li>Total Stations</li>
                            <li>Theodolites</li>
                            <li>Auto Levels</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-xl mb-4 text-gray-800">Calibration Services</h3>
                        <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                            Regular calibration using certified master instruments.
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-xs font-bold text-brand-pink uppercase tracking-wider mb-2">Why Calibrate?</p>
                            <p className="text-xs text-gray-500">Ensure reliability, comply with ISO standards, and prevent costly errors.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
};

export default ServicesPage;