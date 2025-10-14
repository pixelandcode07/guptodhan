import React from 'react';

export default function Loadding() {
  return (
    <div className="card bg-white shadow rounded p-6 animate-pulse">
      <div className="h-6 w-1/4 bg-gray-300 rounded mb-4"></div>
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="h-10 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
