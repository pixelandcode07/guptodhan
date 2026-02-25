'use client';

import React from 'react';

// ✅ যেকোনো page এ কাজ করবে — Sidebar + Topbar + Content
const GeneralLoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ===== Sidebar ===== */}
      <div className="hidden md:flex w-64 min-h-screen bg-white shadow-sm flex-col p-4 gap-3 shrink-0">
        {/* Logo */}
        <div className="h-12 bg-gray-200 rounded-xl animate-pulse mb-4" />

        {/* Nav Groups */}
        {Array.from({ length: 3 }).map((_, g) => (
          <div key={g} className="flex flex-col gap-2 mb-2">
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-1" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-2 py-2 rounded-lg">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse shrink-0" />
                <div className="h-3 bg-gray-200 rounded flex-1 animate-pulse" />
              </div>
            ))}
          </div>
        ))}

        {/* Bottom user */}
        <div className="mt-auto flex items-center gap-3 pt-4 border-t border-gray-100">
          <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse shrink-0" />
          <div className="flex flex-col gap-1 flex-1">
            <div className="h-3 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* ===== Main Area ===== */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <div className="h-16 bg-white shadow-sm px-4 md:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu icon */}
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse md:hidden" />
            {/* Page title */}
            <div className="h-5 w-36 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            <div className="hidden md:block w-28 h-8 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* ===== Page Content ===== */}
        <div className="flex-1 p-4 md:p-6 flex flex-col gap-5 overflow-auto">

          {/* Page heading + button */}
          <div className="flex items-center justify-between">
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-9 w-28 bg-gray-200 rounded-lg animate-pulse" />
          </div>

          {/* Stats Cards — সব page এ না থাকলেও ক্ষতি নেই */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-2 w-full bg-gray-100 rounded-full animate-pulse" />
              </div>
            ))}
          </div>

          {/* Main Content Block — table/list/form সব এর জায়গায় */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-3">
              <div className="h-9 w-48 bg-gray-200 rounded-lg animate-pulse" />
              <div className="flex items-center gap-2">
                <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-3 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>

            {/* Table Rows */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-5 gap-4 px-4 py-4 border-b border-gray-50"
              >
                {/* First col — image + text */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse shrink-0" />
                  <div className="h-3 bg-gray-200 rounded flex-1 animate-pulse" />
                </div>
                {/* Other cols */}
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-3 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ))}

            {/* Pagination */}
            <div className="p-4 flex items-center justify-between border-t border-gray-100">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="flex items-center gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GeneralLoadingSkeleton;