import React, { useState } from 'react';
import BeforeAfterGallery from './BeforeAfterGallery';
import DashboardCTA from './DashboardCTA';
import { User } from '../types';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Helper component for the radial nodes
  const ServiceNode = ({ label, icon, filter, positionClass }: { label: string, icon: string, filter: string, positionClass: string }) => (
      <div 
        onClick={() => setActiveFilter(filter)}
        className={`absolute ${positionClass} cursor-pointer group transition-all duration-500 z-20`}
      >
          {/* Image/Content Container - Increased Size */}
          <div className={`w-32 h-32 md:w-48 md:h-48 bg-white p-1.5 rounded-2xl shadow-xl border-2 transition-all duration-300 ${activeFilter === filter ? 'border-brand-pink scale-110 ring-4 ring-brand-pink/20' : 'border-blue-100 hover:border-blue-300 hover:scale-105'} overflow-hidden relative`}>
              <img src={icon} alt={label} className="w-full h-full object-cover rounded-xl" />
              
              {/* Label Banner */}
              <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm py-2 px-2 text-center rounded-lg shadow-sm">
                  <span className="text-[10px] md:text-sm font-bold text-brand-dark uppercase tracking-tight block truncate">{label}</span>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans animate-fade-in">
      {/* Welcome Header */}
      <div className="relative bg-brand-dark text-white pt-20 pb-28 px-6 md:px-12 overflow-hidden">
         
         {/* Background Image Layer - Fixed Z-Index and Opacity */}
         <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000&auto=format&fit=crop" 
              alt="Dashboard Background" 
              className="w-full h-full object-cover object-center"
              style={{ opacity: 0.4 }} // Set inline opacity for reliability
            />
            {/* Gradient Overlay: Left-Dark to Right-Transparent for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent mix-blend-multiply"></div>
         </div>

         {/* Content Layer - High Z-Index */}
         <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-2xl">
                <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-xl text-white">
                  Don't just dream <br/>
                  <span className="italic text-brand-pink">Build with us</span>
                </h1>
                <p className="text-gray-100 text-lg max-w-xl leading-relaxed mb-8 font-medium drop-shadow-md">
                  Manage your projects, track progress, and explore our fearless engineering solutions. Welcome back, {user.name.split(' ')[0]}.
                </p>
                <div className="flex gap-4">
                    <button className="bg-[#34d399] text-black font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-[#10b981] transition-all transform hover:-translate-y-1">
                        Read More
                    </button>
                    <button 
                        onClick={() => setShowVideoModal(true)}
                        className="flex items-center gap-3 bg-white/10 backdrop-blur-md text-white font-bold py-3 px-6 rounded-full hover:bg-white/20 transition-all border border-white/30 shadow-lg"
                    >
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-brand-dark pl-0.5">
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                        Watch Video
                    </button>
                </div>
            </div>
         </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-10 relative z-20 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Card 1 */}
           <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between group hover:border-brand-pink/30 transition-all transform hover:-translate-y-1">
              <div>
                 <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Active Projects</p>
                 <p className="text-4xl font-serif font-bold text-gray-900">0</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
           </div>

           {/* Card 2 */}
           <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between group hover:border-brand-pink/30 transition-all transform hover:-translate-y-1">
              <div>
                 <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Pending Quotes</p>
                 <p className="text-4xl font-serif font-bold text-gray-900">1</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
           </div>

           {/* Card 3 */}
           <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between group hover:border-brand-pink/30 transition-all transform hover:-translate-y-1 cursor-pointer">
              <div>
                 <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">New Messages</p>
                 <p className="text-4xl font-serif font-bold text-gray-900">2</p>
              </div>
              <div className="w-12 h-12 bg-pink-50 text-brand-pink rounded-full flex items-center justify-center">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900">Explore Services</h2>
            <p className="text-gray-500 mt-3 text-lg">Select a domain below to view our fearless transformations.</p>
        </div>

        {/* --- Radial Services Menu --- */}
        <div className="relative w-full max-w-5xl mx-auto h-[600px] md:h-[700px] mb-20 flex items-center justify-center select-none">
            
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] rounded-full border border-blue-50 scale-125"></div>
            
            {/* Center Logo */}
            <div className="relative z-30 w-40 h-40 md:w-56 md:h-56 bg-white rounded-full shadow-[0_0_40px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center border-[6px] border-[#E0C06B]/20 p-2 group cursor-pointer" onClick={() => setActiveFilter('all')}>
                <div className="w-full h-full rounded-full border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-white to-gray-50">
                    <span className="font-serif text-5xl md:text-7xl font-bold text-gray-800 tracking-tighter">NK</span>
                    <div className="w-16 h-1 bg-[#E0C06B] mt-2 mb-2 rounded-full"></div>
                    <span className="text-[10px] md:text-xs font-bold text-[#B09040] uppercase tracking-[0.25em]">Fearless Services</span>
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-[#E0C06B]/30 animate-ping-slow" style={{ animationDuration: '4s' }}></div>
            </div>

            {/* Connecting Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none stroke-blue-200/50" strokeWidth="3" strokeDasharray="6 4">
                <line x1="50%" y1="50%" x2="20%" y2="20%" />
                <line x1="50%" y1="50%" x2="80%" y2="20%" />
                <line x1="50%" y1="50%" x2="20%" y2="80%" />
                <line x1="50%" y1="50%" x2="80%" y2="80%" />
                <line x1="50%" y1="50%" x2="50%" y2="10%" />
            </svg>

            {/* --- SERVICE NODES --- */}
            
            {/* Top Left - Waterproofing */}
            <ServiceNode 
                label="Waterproofing" 
                filter="waterproofing" 
                icon="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&fit=crop"
                positionClass="top-[5%] left-[5%] md:top-[10%] md:left-[15%]"
            />
            
            {/* Top Right - Construction */}
            <ServiceNode 
                label="Construction" 
                filter="construction" 
                icon="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=400&fit=crop"
                positionClass="top-[5%] right-[5%] md:top-[10%] md:right-[15%]"
            />

            {/* Bottom Left - Piping */}
            <ServiceNode 
                label="Piping" 
                filter="piping" 
                icon="https://images.unsplash.com/photo-1542013936693-884638332954?q=80&w=400&fit=crop"
                positionClass="bottom-[5%] left-[5%] md:bottom-[10%] md:left-[15%]"
            />

            {/* Bottom Right - Electrical */}
            <ServiceNode 
                label="Electrical" 
                filter="electrical" 
                icon="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&fit=crop"
                positionClass="bottom-[5%] right-[5%] md:bottom-[10%] md:right-[15%]"
            />

            {/* Top Center - Instruments */}
            <ServiceNode 
                label="Civil Instruments" 
                filter="instruments" 
                icon="https://images.unsplash.com/photo-1581094794329-cd1361d78571?q=80&w=400&fit=crop"
                positionClass="top-[-2%] left-1/2 -translate-x-1/2 md:top-[0%]"
            />

            {/* Floating Elements (Water Drops) */}
            <div className="absolute top-1/4 right-1/3 text-blue-400 opacity-40 animate-bounce" style={{ animationDuration: '3s' }}>
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M12 22c4.97 0 9-3.58 9-8 0-4.42-9-14-9-14S3 9.58 3 14c0 4.42 4.03 8 9 8z"/></svg>
            </div>
            <div className="absolute bottom-1/4 left-1/3 text-blue-300 opacity-40 animate-bounce" style={{ animationDuration: '4s' }}>
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 22c4.97 0 9-3.58 9-8 0-4.42-9-14-9-14S3 9.58 3 14c0 4.42 4.03 8 9 8z"/></svg>
            </div>

        </div>

        {/* Gallery Component */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-4 md:p-8 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    {activeFilter === 'all' ? (
                        <>All Services Showcase</>
                    ) : (
                        <>
                            <span className="w-2 h-2 rounded-full bg-brand-pink"></span>
                            {activeFilter === 'instruments' ? 'Civil Instruments' : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
                        </>
                    )}
                </h3>
                {activeFilter !== 'all' && (
                    <button onClick={() => setActiveFilter('all')} className="text-sm text-brand-pink font-bold hover:underline flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        Reset View
                    </button>
                )}
            </div>
            <BeforeAfterGallery activeFilter={activeFilter} />
        </div>

      </div>

      <DashboardCTA />

      {/* Video Modal - Updated with Direct Video Source and Loop */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                <button 
                    onClick={() => setShowVideoModal(false)}
                    className="absolute top-4 right-4 z-50 text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="relative pt-[56.25%] bg-black">
                    <video 
                        className="absolute inset-0 w-full h-full object-cover"
                        controls 
                        autoPlay 
                        muted
                        loop
                        playsInline
                        // Using a reliable placeholder video. Replace with your own asset.
                        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" 
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="p-6 bg-gray-900 text-white">
                    <h3 className="text-xl font-bold mb-2">Terrace Waterproofing Transformation</h3>
                    <p className="text-gray-400 text-sm">Watch how our team tackles severe leakage using advanced polyurethane injection techniques.</p>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;