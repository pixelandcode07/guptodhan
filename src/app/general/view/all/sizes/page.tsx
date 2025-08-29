"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Move } from "lucide-react";
import { createColumns, Size } from "./columns";
import { DataTable } from "./data-table";

// Mock data - in a real app, this would come from an API
const mockSizes: Size[] = [
  {
    id: 1,
    name: "L",
    status: "Active",
    createdAt: "2024-08-18 09:57:21 pm"
  },
  {
    id: 2,
    name: "S",
    status: "Active",
    createdAt: "2024-08-18 09:57:12 pm"
  },
  {
    id: 3,
    name: "M L XI",
    status: "Active",
    createdAt: "2025-07-03 05:03:46 pm"
  },
  {
    id: 4,
    name: "XXL",
    status: "Active",
    createdAt: "2025-03-08 12:14:49 pm"
  },
  {
    id: 5,
    name: "XL",
    status: "Active",
    createdAt: "2024-08-18 09:57:26 pm"
  },
  {
    id: 6,
    name: "M",
    status: "Active",
    createdAt: "2024-08-18 09:57:16 pm"
  }
];

export default function ViewAllSizesPage() {
  const [sizes, setSizes] = useState<Size[]>(mockSizes);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSizes = sizes.filter(size =>
    size.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setSizes(sizes.filter(size => size.id !== id));
  };

  const handleEdit = (id: number) => {
    // Handle edit functionality
    console.log("Edit size:", id);
  };

  const handleRearrange = () => {
    // Handle rearrange functionality
    console.log("Rearrange sizes");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>PAGES</span>
          <span className="text-gray-400">→</span>
          <span className="text-blue-600 font-medium">PRODUCT SIZE</span>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">View All Sizes</h1>
        </div>

        {/* Product Sizes Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
              <h2 className="text-lg font-semibold text-gray-900">Product Sizes</h2>
            </div>

            {/* Table Controls */}
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Input
                  type="text"
                  placeholder="Filter sizes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                />
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Size
                </Button>
                <Button variant="outline" onClick={handleRearrange}>
                  <Move className="w-4 h-4 mr-2" />
                  Rearrange Size
                </Button>
              </div>
            </div>
          </div>

          {/* DataTable */}
          <div className="p-6">
            <DataTable 
              columns={createColumns(handleEdit, handleDelete)} 
              data={filteredSizes}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
