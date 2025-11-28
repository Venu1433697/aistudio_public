import React from 'react';
import { Loader2 } from 'lucide-react';

interface BeautifulLoaderProps {
    message?: string;
}

export const BeautifulLoader: React.FC<BeautifulLoaderProps> = ({ message = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="relative">
                {/* Outer spinning ring */}
                <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                {/* Inner pulsing dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full animate-pulse"></div>
            </div>
            <p className="text-gray-600 font-medium animate-pulse">{message}</p>
        </div>
    );
};
