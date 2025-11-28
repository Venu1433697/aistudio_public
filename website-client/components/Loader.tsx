
import React from 'react';

interface LoaderProps {
  category?: string;
}

const Loader: React.FC<LoaderProps> = ({ category }) => {
  // Ensure category is defined and format it correctly
  const safeCategory = category && category !== 'all' ? category : '';
  
  const displayMessage = safeCategory 
    ? `Loading ${safeCategory === 'instruments' ? 'Civil Instruments' : safeCategory.charAt(0).toUpperCase() + safeCategory.slice(1)} Solutions...`
    : 'Loading Solutions...';

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] bg-white animate-fade-in">
      <div className="relative w-32 h-32 mb-8">
        {/* Crane / Building Animation */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-200 rounded-full"></div>
        
        {/* Block 1 */}
        <div className="absolute bottom-2 left-4 w-8 h-8 bg-brand-pink animate-bounce delay-75 rounded-sm shadow-sm"></div>
        {/* Block 2 */}
        <div className="absolute bottom-2 left-12 w-8 h-12 bg-brand-dark animate-bounce delay-150 rounded-sm shadow-sm"></div>
        {/* Block 3 */}
        <div className="absolute bottom-2 right-4 w-8 h-16 bg-gray-400 animate-bounce delay-300 rounded-sm shadow-sm"></div>
        
        {/* Floating element */}
        <div className="absolute top-0 right-0 text-yellow-400 animate-spin-slow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" /></svg>
        </div>
      </div>
      
      <h3 className="font-serif text-2xl font-bold text-brand-dark animate-pulse">
        {displayMessage}
      </h3>
      <p className="text-gray-400 text-sm mt-2 font-medium tracking-wide">Fetching expert solutions</p>
    </div>
  );
};

export default Loader;
