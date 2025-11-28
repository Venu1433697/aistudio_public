import React from 'react';
import { FILTERS } from '../constants';

interface FiltersProps {
  activeFilter: string;
  onFilterChange: (value: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="w-full bg-white px-6 md:px-12 py-4 border-b border-gray-100 sticky top-20 md:top-24 z-40 overflow-x-auto no-scrollbar backdrop-blur-md bg-white/90">
      <div className="flex items-center gap-4 md:gap-8 min-w-max justify-center w-full">
        
        {/* Removed Popular button */}

        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`text-sm font-medium transition-all whitespace-nowrap px-4 py-2 rounded-full ${
              activeFilter === filter.value 
                ? 'bg-gray-900 text-white shadow-md transform scale-105' 
                : 'text-gray-500 hover:text-black hover:bg-gray-50'
            }`}
          >
            {filter.label}
          </button>
        ))}
        
        {/* Removed Filters button */}
      </div>
    </div>
  );
};

export default Filters;