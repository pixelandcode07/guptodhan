"use client";

import { Plus, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ChildCategoriesHeaderProps {
  onAddClickHref?: string;
}

export default function ChildCategoriesHeader({ onAddClickHref = "/general/add/new/childcategory" }: ChildCategoriesHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl shadow-md">
            <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Child Categories</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage, organize and arrange your child categories</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button asChild className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto h-10 sm:h-auto text-sm sm:text-base">
            <Link href={onAddClickHref}>
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add New Child Category</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
