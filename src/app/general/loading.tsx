'use client';

import React from 'react';

const GeneralLoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* Sidebar Skeleton */}
      <div className="w-64 bg-white shadow-sm p-4 flex flex-col gap-4">
        {/* Logo */}
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse mb-4" />
        
        {/* Menu items */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Topbar Skeleton */}
        <div className="h-16 bg-white shadow-sm px-6 flex items-center justify-between">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            <div className="w-24 h-8 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 flex flex-col gap-6">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse" />
                </div>
                <div className="h-7 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Chart + Side Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-56 bg-gray-100 rounded-lg animate-pulse" />
            </div>
            {/* Side */}
            <div className="bg-white rounded-xl p-5 shadow-sm flex flex-col gap-4">
              <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="h-5 w-36 bg-gray-200 rounded animate-pulse mb-4" />
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
            {/* Table Rows */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4 py-3 border-t border-gray-100">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="h-4 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default GeneralLoadingSkeleton;