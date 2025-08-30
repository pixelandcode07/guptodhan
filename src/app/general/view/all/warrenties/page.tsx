"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Move } from "lucide-react";
import { createColumns, Warranty } from "./columns";
import { DataTable } from "./data-table";

// Mock data - in a real app, this would come from an API
const mockWarranties: Warranty[] = [
  {
    id: 1,
    name: "10 Days Replacement Guarentee",
    createdAt: "2023-06-07 11:16:37 pm"
  },
  {
    id: 2,
    name: "10 Days Cashback Guarantee",
    createdAt: "2023-07-17 03:53:13 am"
  },
  {
    id: 3,
    name: "1 Year Replacement Warrenty",
    createdAt: "2023-06-07 11:16:37 pm"
  },
  {
    id: 4,
    name: "1 Yr Replacement & 2 Yr Service Warrenty",
    createdAt: "2023-07-17 03:53:13 am"
  },
  {
    id: 5,
    name: "2 Years Service Warrenty",
    createdAt: "2023-06-07 11:16:37 pm"
  }
];

export default function ViewAllWarrantiesPage() {
  const [warranties, setWarranties] = useState<Warranty[]>(mockWarranties);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWarranties = warranties.filter(warranty =>
    warranty.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setWarranties(warranties.filter(warranty => warranty.id !== id));
  };

  const handleEdit = (id: number) => {
    // Handle edit functionality
    console.log("Edit warranty:", id);
  };

  const handleRearrange = () => {
    // Handle rearrange functionality
    console.log("Rearrange warranties");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>PAGES</span>
          <span className="text-gray-400">→</span>
          <span className="text-blue-600 font-medium">PRODUCT WARRENTY</span>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">View All Warrenty Type</h1>
        </div>

        {/* Warranty Type List Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
              <h2 className="text-lg font-semibold text-gray-900">Warrenty Type List</h2>
            </div>

            {/* Table Controls */}
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Input
                  type="text"
                  placeholder="Filter warranties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                />
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Warrenty Type
                </Button>
                <Button variant="outline" onClick={handleRearrange}>
                  <Move className="w-4 h-4 mr-2" />
                  Rearrange
                </Button>
              </div>
            </div>
          </div>

          {/* DataTable */}
          <div className="p-6">
            <DataTable
              columns={createColumns(handleEdit, handleDelete)}
              data={filteredWarranties}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
