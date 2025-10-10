"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function PromoCodeHeader() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Promo Codes</h1>
              <p className="text-sm text-gray-600">Manage discount codes and promotional offers</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/general/add/new/code">
            <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 h-10 sm:h-11 px-3 sm:px-6 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add New Promo</span>
              <span className="sm:hidden">Add New Promo</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
