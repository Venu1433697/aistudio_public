import React, { useState, useEffect } from 'react';
import { HERO_IMAGES } from '../constants';

const Hero: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000); // Change every 6 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center text-center py-20 px-6 bg-brand-dark text-white min-h-[550px] justify-center">
      
      {/* Dynamic Background Carousel */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-black/30 z-10" /> {/* LIGHTER overlay (changed from bg-black/60 to bg-black/30) */}
        {HERO_IMAGES.map((img, index) => (
          <img 
            key={index}
            src={img} 
            alt="Background" 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            style={{ 
              transition: 'opacity 1.5s ease-in-out, transform 10s ease-out' 
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center">
        {/* Dynamic Tagline */}
        <div className="inline-block px-4 py-2 mb-8 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white font-semibold text-sm animate-fade-in-up">
          Building Solutions Across Karnataka
        </div>

        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white max-w-4xl leading-tight mb-8 drop-shadow-lg">
          Fearless Construction & <br className="hidden md:block"/>
          <span className="italic text-brand-pink">Waterproofing</span> Solutions.
        </h1>
        
        <p className="text-gray-200 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed drop-shadow-md">
          Specializing in residential & commercial waterproofing, industrial piping, and precision civil engineering instrument services.
        </p>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            {HERO_IMAGES.map((_, idx) => (
                <button 
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/40'}`}
                />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;