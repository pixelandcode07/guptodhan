"use client";

import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

interface UnitsHeaderProps {
  onAddClick: () => void;
}

export default function UnitsHeader({ onAddClick }: UnitsHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Title Section */}
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg sm:rounded-xl">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Product Units
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Manage product measurement units
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={onAddClick}
              className="w-full sm:w-auto h-10 sm:h-auto bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-4 py-2"
            >
              <Package className="w-4 h-4 mr-2" />
              <span className="sm:hidden">Add Unit</span>
              <span className="hidden sm:inline">Add New Unit</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
