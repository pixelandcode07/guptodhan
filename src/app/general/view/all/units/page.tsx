"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { createColumns, Unit } from "./columns";
import { DataTable } from "./data-table";

// Mock data - in a real app, this would come from an API
const mockUnits: Unit[] = [
  {
    id: 1,
    name: "Meter",
    status: "Active",
    createdAt: "2023-05-14 07:36:39 pm"
  },
  {
    id: 2,
    name: "Ton",
    status: "Active",
    createdAt: "2023-05-14 07:36:45 pm"
  },
  {
    id: 3,
    name: "Litre",
    status: "Active",
    createdAt: "2023-05-14 07:36:51 pm"
  },
  {
    id: 4,
    name: "Gram",
    status: "Active",
    createdAt: "2023-05-14 07:36:57 pm"
  },
  {
    id: 5,
    name: "KG",
    status: "Active",
    createdAt: "2023-05-14 07:37:03 pm"
  },
  {
    id: 6,
    name: "Piece",
    status: "Active",
    createdAt: "2023-05-14 07:37:09 pm"
  }
];

export default function ViewAllUnitsPage() {
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || unit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: number) => {
    setUnits(units.filter(unit => unit.id !== id));
  };

  const handleEdit = (id: number) => {
    // Handle edit functionality
    console.log("Edit unit:", id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>PAGES</span>
          <span className="text-gray-400">→</span>
          <span className="text-blue-600 font-medium">UNIT</span>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">View All Units</h1>
        </div>

        {/* Unit List Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
              <h2 className="text-lg font-semibold text-gray-900">Unit List</h2>
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
                <Input
                  type="text"
                  placeholder="Search units..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                />
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Unit
                </Button>
              </div>
            </div>
          </div>

          {/* Table Filters Row */}
          <div className="px-6 py-3 border-b bg-gray-50">
            <div className="grid grid-cols-5 gap-4">
              <div></div> {/* SL column - no filter */}
              <div>
                <Input
                  type="text"
                  placeholder="Filter by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-sm"
                />
              </div>
              <div>
                <select
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div></div> {/* Created At column - no filter */}
              <div></div> {/* Action column - no filter */}
            </div>
          </div>

          {/* DataTable */}
          <div className="p-6">
            <DataTable
              columns={createColumns(handleEdit, handleDelete)}
              data={filteredUnits}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
