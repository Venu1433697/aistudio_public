import React from 'react';

export const LeafDecoration: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none overflow-hidden rounded-tl-3xl">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-[-50px] left-[-50px]"
      >
        {/* Dark Teal Leaf */}
        <path
          d="M150 0C150 82.8427 82.8427 150 0 150V0H150Z"
          fill="#0f766e"
          fillOpacity="0.6"
          style={{ mixBlendMode: 'screen' }}
        />
        {/* Blue Leaf */}
        <path
            d="M220 0C220 121.5 121.5 220 0 220C0 98.4975 98.4975 0 220 0Z"
            fill="#1d4ed8"
            fillOpacity="0.4"
            className="translate-x-[20px]"
        />
        {/* Lighter Teal Overlay */}
        <path
          d="M100 0C100 55.2285 55.2285 100 0 100V0H100Z"
          fill="#2dd4bf"
          fillOpacity="0.3"
        />
      </svg>
    </div>
  );
};