
import React from 'react';
import { BEFORE_AFTER_DATA } from '../constants';

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

// --- NEW COMPONENT: Vertical Stack Design for "All Services" Grid ---
interface OverviewCardProps {
  item: any;
  category: string;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ item, category }) => {
  return (
    <div className="relative w-full h-[550px] rounded-xl overflow-hidden shadow-xl group bg-white border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      
      {/* --- TOP HALF: BEFORE --- */}
      <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden border-b-2 border-white">
        <div className="absolute top-4 left-4 z-20 bg-brand-dark text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider border border-white/20 shadow-md">
          Problem: {item.label}
        </div>
        
        <img 
          src={item.before} 
          alt="Before" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0" 
        />
        
        {/* Overlay & Text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
        <div className="absolute bottom-3 left-0 w-full text-center">
            <h3 className="font-serif font-bold text-3xl text-white tracking-widest drop-shadow-md opacity-90">
              BEFORE
            </h3>
        </div>
      </div>

      {/* --- CENTER BADGE --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="bg-brand-pink text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg border-2 border-white">
            Transform
        </div>
      </div>

      {/* --- BOTTOM HALF: AFTER --- */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden bg-gray-50 border-t-2 border-white">
         <div className="absolute top-3 right-4 z-20 bg-white/90 backdrop-blur text-brand-dark text-[10px] font-bold px-2 py-1 rounded border border-gray-200 shadow-sm uppercase">
            {category}
         </div>

        <img 
          src={item.after} 
          alt="After" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />

        {/* Overlay & Text */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90"></div>
         
         <div className="absolute top-3 left-0 w-full text-center">
            <h3 className="font-serif font-bold text-3xl text-white tracking-widest drop-shadow-md opacity-90">
              AFTER
            </h3>
        </div>

         {/* Solution Description */}
         <div className="absolute bottom-0 left-0 w-full p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-brand-pink text-[10px] font-bold uppercase mb-1 tracking-wider">The Solution</p>
            <p className="text-white text-base font-medium leading-snug">
                {item.desc}
            </p>
         </div>
      </div>
    </div>
  );
};


interface BeforeAfterGalleryProps {
  activeFilter: string;
}

const BeforeAfterGallery: React.FC<BeforeAfterGalleryProps> = ({ activeFilter }) => {
  
  // --- RENDER LOGIC FOR 'ALL SERVICES' TAB (Grid Layout) ---
  if (activeFilter === 'all') {
      // We need 6 items to form 3 rows of 2 pairs.
      // We take 1 from each of the 5 categories, plus 1 extra from Waterproofing (or Construction).
      const featuredItems = [
        { ...BEFORE_AFTER_DATA['Waterproofing'][0], category: 'Waterproofing' },
        { ...BEFORE_AFTER_DATA['Construction'][0], category: 'Construction' },
        { ...BEFORE_AFTER_DATA['Piping'][0], category: 'Piping' },
        { ...BEFORE_AFTER_DATA['Electrical'][0], category: 'Electrical' },
        { ...BEFORE_AFTER_DATA['Civil Instruments'][0], category: 'Civil Instruments' },
        { ...BEFORE_AFTER_DATA['Waterproofing'][1], category: 'Waterproofing' }, // 6th item
      ];

      return (
        <div className="w-full bg-slate-50 py-16 px-4 md:px-8 animate-fade-in-up">
           <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Expert Transformations</h2>
                 <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg">
                   Delivering fearless solutions across all sectors.
                 </p>
              </div>

              {/* 3 Rows x 2 Columns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                {featuredItems.map((item, idx) => (
                    <OverviewCard key={idx} item={item} category={item.category} />
                ))}
              </div>
           </div>
        </div>
      );
  }

  // --- RENDER LOGIC FOR SPECIFIC INDUSTRY TABS (Magazine Style) ---
  
  const getRelevantCategories = () => {
    const normalize = (s: string) => s.toLowerCase().replace('instruments', 'civil instruments');
    return Object.keys(BEFORE_AFTER_DATA).filter(key => 
      key.toLowerCase() === normalize(activeFilter) || 
      (activeFilter === 'instruments' && key === 'Civil Instruments')
    );
  };

  const activeCategories = getRelevantCategories();

  if (activeCategories.length === 0) return null;

  return (
    <div className="w-full bg-gradient-to-br from-orange-50 via-white to-pink-50 py-24 px-4 md:px-12 animate-fade-in-up">
      <div className="max-w-7xl mx-auto">
        
        {activeCategories.map((category) => {
           const items = BEFORE_AFTER_DATA[category as keyof typeof BEFORE_AFTER_DATA];
           const CATEGORY_SUBTITLES: Record<string, string> = {
            "Waterproofing": "Zero leakage, maximum protection. Witness our waterproofing mastery.",
            "Construction": "From barren land to architectural landmarks. We build with fearless precision.",
            "Piping": "Industrial-grade flow solutions. Optimized for safety, durability, and efficiency.",
            "Electrical": "Powering your infrastructure with modern safety standards and smart grids.",
            "Civil Instruments": "Precision calibration services ensuring 100% accuracy on the field."
           };
           const subtitle = CATEGORY_SUBTITLES[category] || "Witness the impact of our precision engineering and fearless execution.";
           
           const displayItems = items.slice(0, 6);

           return (
            <div key={category} className="mb-20">
              <div className="text-center mb-20 relative">
                  <StarIcon className="absolute top-0 left-[20%] text-brand-pink opacity-40 w-8 h-8 animate-pulse" />
                  <StarIcon className="absolute bottom-0 right-[20%] text-brand-dark opacity-20 w-6 h-6" />
                  <h2 className="text-4xl md:text-6xl font-serif font-bold text-brand-dark mb-6">
                      {category} Transformations
                  </h2>
                  <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
                      {subtitle}
                  </p>
              </div>

              {/* Magazine Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-32">
                  {displayItems.map((item, index) => (
                      <div key={index} className="relative group">
                          {/* Decorative background for the pair */}
                          <div className="absolute -inset-6 bg-white/60 border border-white rounded-2xl shadow-sm -z-10 rotate-1 transition-transform group-hover:rotate-0 duration-700"></div>

                          <div className="flex flex-row items-stretch gap-4 md:gap-6 h-64 md:h-80">
                              
                              {/* BEFORE CARD */}
                              <div className="relative flex-1 h-full">
                                  <div className="absolute inset-0 p-1.5 bg-white shadow-xl rotate-[-2deg] transition-transform duration-500 group-hover:rotate-0 z-10 rounded-sm">
                                      <img src={item.before} alt="Before" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                                  </div>
                                  <div className="absolute -bottom-5 left-2 right-6 z-30">
                                      <div className="bg-orange-50 border border-gray-900 p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center transition-transform group-hover:-translate-y-1 duration-300">
                                          <h4 className="font-serif font-bold text-xl text-gray-900 tracking-wide">BEFORE</h4>
                                          <p className="text-[10px] text-gray-500 font-sans mt-0.5 uppercase tracking-wider truncate px-1">{item.label}</p>
                                      </div>
                                  </div>
                              </div>

                              <div className="w-px bg-gray-300 mx-1 self-center h-2/3 relative hidden md:flex flex-col items-center justify-center opacity-50">
                                  <div className="w-1.5 h-1.5 bg-brand-dark rounded-full"></div>
                              </div>

                              {/* AFTER CARD */}
                              <div className="relative flex-1 h-full mt-10 md:mt-12">
                                  <div className="absolute inset-0 p-1.5 bg-white shadow-xl rotate-[2deg] transition-transform duration-500 group-hover:rotate-0 z-20 rounded-sm">
                                      <img src={item.after} alt="After" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="absolute -bottom-5 right-2 left-6 z-30">
                                      <div className="bg-pink-50 border border-gray-900 p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center transition-transform group-hover:-translate-y-1 duration-300">
                                          <h4 className="font-serif font-bold text-xl text-gray-900 tracking-wide">AFTER</h4>
                                          <p className="text-[10px] text-gray-500 font-sans mt-0.5 uppercase tracking-wider truncate px-1">NK Solution</p>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <div className="mt-16 text-center relative z-0 px-4">
                              <p className="font-serif italic text-xl text-gray-700">"{item.desc}"</p>
                          </div>

                          <StarIcon className="absolute -top-6 -right-6 text-yellow-400 w-8 h-8 animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                  ))}
              </div>
            </div>
           );
        })}
      </div>
    </div>
  );
};

export default BeforeAfterGallery;
