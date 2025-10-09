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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search Models
          </label>
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            placeholder="Search by name or brand..."
            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Status Filter
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors bg-white"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Quick Stats */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Quick Info
          </label>
          <div className="flex gap-2">
            <div className="flex-1 bg-green-50 border border-green-200 rounded-md px-3 py-2 text-center">
              <div className="text-xs text-green-600 font-medium">Active</div>
              <div className="text-sm font-semibold text-green-700">
                {statusFilter === "Active" ? "Filtered" : "All"}
              </div>
            </div>
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-center">
              <div className="text-xs text-gray-600 font-medium">Total</div>
              <div className="text-sm font-semibold text-gray-700">
                {searchText ? "Filtered" : "All"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
