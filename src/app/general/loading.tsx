'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';

const FancyLoadingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Rotating gradient ring with icon */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-500 via-amber-400 to-orange-500 animate-spin blur-[1px]"></div>
        <div className="absolute inset-[6px] rounded-full bg-gray-900 flex items-center justify-center">
          <ShoppingBag className="text-yellow-400 w-8 h-8 animate-bounce" />
        </div>
      </div>

      {/* Brand Name */}
      <h1 className="mt-8 text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-orange-400 tracking-wide">
        Guptodhan
      </h1>

      {/* Loading text */}
      <p className="mt-3 text-gray-300 text-sm md:text-base tracking-wide animate-pulse">
        Unlocking your treasures...
      </p>

      {/* Background glowing gradients */}
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-r from-yellow-500 to-orange-400 opacity-10 rounded-full blur-3xl animate-pulse -top-20 -right-20"></div>
      <div className="absolute w-[300px] h-[300px] bg-gradient-to-r from-amber-500 to-yellow-400 opacity-10 rounded-full blur-3xl animate-pulse bottom-0 left-0"></div>
    </div>
  );
};

export default FancyLoadingPage;
