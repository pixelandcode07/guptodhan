"use client";

import { Heart } from "lucide-react";

export default function WishlistHeader() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-pink-100 rounded-lg">
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Customer Wishlist</h1>
          <p className="text-sm text-gray-600">View customer wishlist items and preferences</p>
        </div>
      </div>
    </div>
  );
}
