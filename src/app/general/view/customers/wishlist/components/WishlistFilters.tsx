"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface WishlistFiltersProps {
  searchText: string;
  setSearchText: (text: string) => void;
}

export default function WishlistFilters({
  searchText,
  setSearchText,
}: WishlistFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search wishlist by product name, customer name, or email..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 h-10 sm:h-11 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
