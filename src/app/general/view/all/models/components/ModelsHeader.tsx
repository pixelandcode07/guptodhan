"use client"

import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import Link from "next/link";

export default function ModelsHeader() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title Section */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Product Models
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage and organize your product models
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0">
          <Button 
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto" 
            asChild
          >
            <Link href="/general/add/new/model">
              <Plus className="w-4 h-4 mr-2" />
              Add New Model
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
