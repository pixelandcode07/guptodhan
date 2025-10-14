"use client"

import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface ModelsFiltersProps {
  searchText: string;
  setSearchText: (value: string) => void;
  statusFilter: "" | "Active" | "Inactive";
  setStatusFilter: (value: "" | "Active" | "Inactive") => void;
}

export default function ModelsFilters({
  searchText,
  setSearchText,
  statusFilter,
  setStatusFilter,
}: ModelsFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filters</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Search Input */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
            <Search className="w-3 h-3 sm:w-4 sm:h-4" />
            Search Models
          </label>
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            placeholder="Search by name or brand..."
            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors h-10 sm:h-auto text-sm sm:text-base"
          />
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700">
            Status Filter
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors bg-white h-10 sm:h-auto"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
}
