"use client"

import { Plus } from "lucide-react";

export default function ModelFormHeader() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        {/* Title Section */}
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl shadow-md">
            <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Add New Model
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Create a new product model for your inventory
            </p>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="hidden sm:flex items-center gap-2 ml-auto">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
          <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
