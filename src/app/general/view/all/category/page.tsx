"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";
import { createColumns, Category } from "./columns";
import { DataTable } from "./data-table";

// Mock data - in a real app, this would come from an API
const mockCategories: Category[] = [
  {
    id: 1,
    name: "hhh",
    icon: "",
    bannerImage: "",
    slug: "hhh",
    featured: "Not Featured",
    showOnNavbar: "No",
    status: "Active",
    createdAt: "2024-01-01 10:00:00 am"
  },
  {
    id: 2,
    name: "Special Offers",
    icon: "",
    bannerImage: "",
    slug: "special-offers",
    featured: "Not Featured",
    showOnNavbar: "No",
    status: "Active",
    createdAt: "2024-01-02 10:00:00 am"
  },
  {
    id: 3,
    name: "Mobile",
    icon: "📱",
    bannerImage: "SUPER SALE",
    slug: "desktop",
    featured: "Featured",
    showOnNavbar: "Yes",
    status: "Active",
    createdAt: "2024-01-03 10:00:00 am"
  },
  {
    id: 4,
    name: "Gadget",
    icon: "👜",
    bannerImage: "",
    slug: "gadget",
    featured: "Featured",
    showOnNavbar: "Yes",
    status: "Active",
    createdAt: "2024-01-04 10:00:00 am"
  },
  {
    id: 5,
    name: "Electronics",
    icon: "📦",
    bannerImage: "",
    slug: "electronics",
    featured: "Featured",
    showOnNavbar: "Yes",
    status: "Active",
    createdAt: "2024-01-05 10:00:00 am"
  },
  {
    id: 6,
    name: "Men's Fashion",
    icon: "👔",
    bannerImage: "",
    slug: "mens-fashion",
    featured: "Featured",
    showOnNavbar: "Yes",
    status: "Active",
    createdAt: "2024-01-06 10:00:00 am"
  },
  {
    id: 7,
    name: "Women Fashion",
    icon: "👗",
    bannerImage: "",
    slug: "women-fashion",
    featured: "Featured",
    showOnNavbar: "Yes",
    status: "Active",
    createdAt: "2024-01-07 10:00:00 am"
  },
  {
    id: 8,
    name: "Shoes",
    icon: "👠",
    bannerImage: "",
    slug: "shoes",
    featured: "Featured",
    showOnNavbar: "Yes",
    status: "Active",
    createdAt: "2024-01-08 10:00:00 am"
  },
  {
    id: 9,
    name: "Home & Living",
    icon: "🛋️",
    bannerImage: "",
    slug: "home-living",
    featured: "Featured",
    showOnNavbar: "No",
    status: "Active",
    createdAt: "2024-01-09 10:00:00 am"
  },
  {
    id: 10,
    name: "Computer",
    icon: "🖥️",
    bannerImage: "🖥️",
    slug: "computer",
    featured: "Featured",
    showOnNavbar: "Yes",
    status: "Active",
    createdAt: "2024-01-10 10:00:00 am"
  },
  {
    id: 11,
    name: "Sports & Outdoor",
    icon: "⚽",
    bannerImage: "",
    slug: "sports-outdoor",
    featured: "Not Featured",
    showOnNavbar: "No",
    status: "Active",
    createdAt: "2024-01-11 10:00:00 am"
  },
  {
    id: 12,
    name: "Books & Media",
    icon: "📚",
    bannerImage: "",
    slug: "books-media",
    featured: "Not Featured",
    showOnNavbar: "No",
    status: "Active",
    createdAt: "2024-01-12 10:00:00 am"
  },
  {
    id: 13,
    name: "Health & Beauty",
    icon: "💄",
    bannerImage: "",
    slug: "health-beauty",
    featured: "Featured",
    showOnNavbar: "Yes",
    status: "Active",
    createdAt: "2024-01-13 10:00:00 am"
  },
  {
    id: 14,
    name: "Automotive",
    icon: "🚗",
    bannerImage: "",
    slug: "automotive",
    featured: "Not Featured",
    showOnNavbar: "No",
    status: "Active",
    createdAt: "2024-01-14 10:00:00 am"
  },
  {
    id: 15,
    name: "Toys & Games",
    icon: "🎮",
    bannerImage: "",
    slug: "toys-games",
    featured: "Not Featured",
    showOnNavbar: "No",
    status: "Active",
    createdAt: "2024-01-15 10:00:00 am"
  },
  {
    id: 16,
    name: "Pet Supplies",
    icon: "🐕",
    bannerImage: "",
    slug: "pet-supplies",
    featured: "Not Featured",
    showOnNavbar: "No",
    status: "Active",
    createdAt: "2024-01-16 10:00:00 am"
  },
  {
    id: 17,
    name: "Garden & Tools",
    icon: "🌱",
    bannerImage: "",
    slug: "garden-tools",
    featured: "Not Featured",
    showOnNavbar: "No",
    status: "Active",
    createdAt: "2024-01-17 10:00:00 am"
  },
  {
    id: 18,
    name: "Jewelry & Watches",
    icon: "💍",
    bannerImage: "",
    slug: "jewelry-watches",
    featured: "Featured",
    showOnNavbar: "Yes",
    status: "Active",
    createdAt: "2024-01-18 10:00:00 am"
  }
];

export default function ViewAllCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  const handleEdit = (id: number) => {
    // Handle edit functionality
    console.log("Edit category:", id);
  };

  const handleRearrangeAll = () => {
    // Handle bulk rearrange functionality
    console.log("Rearrange all categories");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>PAGES</span>
          <span className="text-gray-400">→</span>
          <span className="text-blue-600 font-medium">CATEGORY</span>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">View All Categories</h1>
        </div>

        {/* Category List Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
              <h2 className="text-lg font-semibold text-gray-900">Category List</h2>
            </div>

            {/* Table Controls */}
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Show</span>
                  <select 
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    value={10}
                    onChange={(e) => console.log("Entries per page:", e.target.value)}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-gray-600">entries</span>
                </div>
                <Button variant="outline" onClick={handleRearrangeAll}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Rearrange Category
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Search:</span>
                <Input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                />
              </div>
            </div>
          </div>

          {/* DataTable */}
          <div className="p-6">
            <DataTable
              columns={createColumns(handleEdit, handleDelete)}
              data={filteredCategories}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
