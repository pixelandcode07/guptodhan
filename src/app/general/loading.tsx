'use client';

import React from 'react';

const FancyLoadingPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-pink-500 animate-spin-slow"></div>
        <div className="absolute inset-2 rounded-full bg-gray-900"></div>
      </div>
      <p className="mt-6 text-white text-lg font-medium absolute bottom-20 text-center w-full">
        Loading...
      </p>
    </div>
  );
};

export default FancyLoadingPage;
