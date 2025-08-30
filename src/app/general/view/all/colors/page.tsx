"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { createColumns, Color } from "./columns";
import { DataTable } from "./data-table";

// Mock data - in a real app, this would come from an API
const mockColors: Color[] = [
  {
    id: 1,
    name: "Jam",
    code: "#551841",
    createdAt: "2023-06-05 10:34:14 am"
  },
  {
    id: 2,
    name: "Badami",
    code: "#dbba9b",
    createdAt: "2023-07-17 03:50:39 am"
  },
  {
    id: 3,
    name: "Pixel Colour",
    code: "#a1887f",
    createdAt: "2023-07-17 03:52:02 am"
  },
  {
    id: 4,
    name: "Turquoiso",
    code: "#40e0d0",
    createdAt: "2023-06-05 10:34:27 am"
  },
  {
    id: 5,
    name: "Mint green",
    code: "#eaffea",
    createdAt: "2023-06-05 10:34:33 am"
  },
  {
    id: 6,
    name: "Ivory",
    code: "#fffcee",
    createdAt: "2023-06-05 10:34:40 am"
  },
  {
    id: 7,
    name: "Gray",
    code: "#808080",
    createdAt: "2023-06-05 10:34:47 am"
  },
  {
    id: 8,
    name: "Rupali silvar",
    code: "#a9a9a9",
    createdAt: "2023-06-05 10:34:54 am"
  },
  {
    id: 9,
    name: "Space Gray",
    code: "#a7adba",
    createdAt: "2023-06-05 10:35:01 am"
  },
  {
    id: 10,
    name: "Ocean blue",
    code: "#c8ecf8",
    createdAt: "2023-06-05 10:35:08 am"
  },
  {
    id: 11,
    name: "Velvet Black",
    code: "#241f20",
    createdAt: "2023-06-05 10:35:15 am"
  },
  {
    id: 12,
    name: "Silk Purple",
    code: "#55146e",
    createdAt: "2023-06-05 10:35:22 am"
  },
  {
    id: 13,
    name: "Black",
    code: "#0b0a0a",
    createdAt: "2023-06-05 10:35:29 am"
  },
  {
    id: 14,
    name: "Epi green",
    code: "#dcf8ee",
    createdAt: "2023-06-05 10:35:36 am"
  },
  {
    id: 15,
    name: "Desert gold",
    code: "#f9f2e9",
    createdAt: "2023-06-05 10:35:43 am"
  }
];

export default function ViewAllColorsPage() {
  const [colors, setColors] = useState<Color[]>(mockColors);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredColors = colors.filter(color =>
    color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    color.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: number) => {
    // Handle edit functionality
    console.log("Edit color:", id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>PAGES</span>
          <span className="text-gray-400">→</span>
          <span className="text-blue-600 font-medium">COLOR</span>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">View All Colors</h1>
        </div>

        {/* Color List Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
              <h2 className="text-lg font-semibold text-gray-900">Color List</h2>
            </div>

            {/* Table Controls */}
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Show</span>
                  <select 
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    value={15}
                    onChange={(e) => console.log("Entries per page:", e.target.value)}
                  >
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-gray-600">entries</span>
                </div>
                <Input
                  type="text"
                  placeholder="Search colors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                />
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Color
                </Button>
              </div>
            </div>
          </div>

          {/* DataTable */}
          <div className="p-6">
            <DataTable
              columns={createColumns(handleEdit)}
              data={filteredColors}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
