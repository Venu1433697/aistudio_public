
import React from 'react';
import { PROJECTS } from '../constants';

const ImageSlider: React.FC = () => {
  // Duplicate array to create infinite scrolling effect
  const sliderImages = [...PROJECTS, ...PROJECTS];

  return (
    <div className="w-full bg-white py-16 overflow-hidden border-t border-gray-100">
      <div className="mb-10 text-center px-4">
          <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest">Our Portfolio 360° View</h3>
      </div>
      
      {/* Slider Container */}
      <div className="relative w-full">
        <div className="flex gap-6 animate-scroll whitespace-nowrap hover:pause">
          {sliderImages.map((project, index) => (
            <div 
                key={`${project.id}-${index}`} 
                className="w-80 md:w-96 h-64 shrink-0 rounded-xl overflow-hidden shadow-lg relative group cursor-pointer"
            >
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{project.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .hover\\:pause:hover {
            animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default ImageSlider;
