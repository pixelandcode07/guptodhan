'use client';

import React from 'react';
import BuySellCard from './BuySellCard';
import { ClassifiedAdListing } from '@/types/ClassifiedAdsType';

interface BuySellGridProps {
  ads: ClassifiedAdListing[];
}

export default function BuySellGrid({ ads }: BuySellGridProps) {
  // যদি কোনো ডাটা না থাকে
  if (!ads || ads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[250px] text-gray-500">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className="text-lg font-medium">No ads found</p>
        <p className="text-sm">Please check back later.</p>
      </div>
    );
  }

  // সব ক্যাটাগরির ডাটা গ্রিড আকারে শো করবে
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-6">
      {ads.map((ad, index) => (
        <BuySellCard key={ad._id} ad={ad} index={index} />
      ))}
    </div>
  );
}