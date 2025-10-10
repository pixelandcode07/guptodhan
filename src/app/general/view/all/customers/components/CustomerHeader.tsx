"use client";

import { Users } from "lucide-react";

export default function CustomerHeader() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">All Customers</h1>
          <p className="text-sm text-gray-600">Manage and view customer information</p>
        </div>
      </div>
    </div>
  );
}
