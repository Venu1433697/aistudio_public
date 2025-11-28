
import React from 'react';

const DashboardCTA: React.FC = () => {
  return (
    <div className="px-6 md:px-12 pb-20 pt-10">
      <div className="relative bg-[#FFF8F5] rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between overflow-hidden shadow-sm border border-[#ffede5]">
        
        {/* Left Content */}
        <div className="lg:w-1/2 z-10 mb-16 lg:mb-0">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#0d0c22] leading-[1.1] mb-6">
                Transformative <span className="text-[#FF6B4A]">engineering</span> <br/>
                with live virtual tracking. <br/>
                Now 100% online.
            </h2>
            <p className="text-gray-500 text-lg mb-10 max-w-md leading-relaxed">
                NK Fearless helps top developers build more and get results through our comprehensive and industry-customizable engineering programs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                <button className="bg-[#FF6B4A] text-white px-10 py-4 rounded-xl font-bold text-sm tracking-wider shadow-lg hover:bg-[#e55a3b] transition-all transform hover:-translate-y-1 hover:shadow-[#ff6b4a]/30">
                    GET STARTED
                </button>
                <button className="flex items-center gap-2 text-[#FF6B4A] font-bold border-b-2 border-transparent hover:border-[#FF6B4A] transition-all pb-0.5">
                    Learn more <span className="text-xl leading-none mb-0.5">→</span>
                </button>
            </div>
        </div>

        {/* Right Hexagon Grid */}
        <div className="lg:w-1/2 relative w-full flex justify-center lg:justify-end pr-0 lg:pr-10">
            <div className="relative w-[320px] h-[320px] md:w-[450px] md:h-[450px]">
                
                {/* Hexagon 1 (Top) */}
                <div className="absolute top-0 right-[20%] w-36 h-40 md:w-48 md:h-52 clip-hexagon bg-white p-2 shadow-xl hover:scale-105 transition-transform duration-500 z-10">
                    <div className="w-full h-full clip-hexagon overflow-hidden relative">
                        <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=400&fit=crop" className="w-full h-full object-cover" alt="Engineer" />
                        <div className="absolute inset-0 bg-[#FF6B4A]/10 mix-blend-multiply"></div>
                    </div>
                </div>
                
                {/* Hexagon 2 (Bottom Right) */}
                <div className="absolute bottom-0 right-0 w-36 h-40 md:w-48 md:h-52 clip-hexagon bg-white p-2 shadow-xl hover:scale-105 transition-transform duration-500 z-20">
                    <div className="w-full h-full clip-hexagon overflow-hidden relative">
                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&fit=crop" className="w-full h-full object-cover" alt="Engineer" />
                    </div>
                </div>

                {/* Hexagon 3 (Bottom Left) */}
                <div className="absolute bottom-4 left-4 w-36 h-40 md:w-48 md:h-52 clip-hexagon bg-white p-2 shadow-xl hover:scale-105 transition-transform duration-500 z-30">
                    <div className="w-full h-full clip-hexagon overflow-hidden relative">
                        <img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=400&fit=crop" className="w-full h-full object-cover" alt="Engineer" />
                        <div className="absolute inset-0 bg-indigo-900/10 mix-blend-multiply"></div>
                    </div>
                </div>

                {/* Decorative Orange Lines */}
                <div className="absolute -top-4 right-[15%] w-16 h-1.5 bg-[#FF6B4A] rotate-[30deg] rounded-full"></div>
                <div className="absolute bottom-[10%] -left-2 w-16 h-1.5 bg-[#FF6B4A] -rotate-[30deg] rounded-full"></div>
                <div className="absolute bottom-[-10px] right-[20%] w-16 h-1.5 bg-[#FF6B4A] -rotate-[30deg] rounded-full border-2 border-white ring-2 ring-[#FF6B4A]"></div>
                
                {/* Abstract Geometric Line */}
                <svg className="absolute top-1/2 -left-10 w-24 h-24 text-[#0d0c22] z-0 opacity-80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 20 L50 50 L20 80" />
                </svg>

            </div>
        </div>
      </div>
      
      <style>{`
        .clip-hexagon {
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
      `}</style>
    </div>
  );
};

export default DashboardCTA;
