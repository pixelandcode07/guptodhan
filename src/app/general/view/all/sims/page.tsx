"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { createColumns, Sim } from "./columns";
import { DataTable } from "./data-table";

// Mock data - in a real app, this would come from an API
const mockSims: Sim[] = [
  {
    id: 1,
    name: "Dual e-SIM",
    createdAt: "2023-06-05 10:25:43 am"
  },
  {
    id: 2,
    name: "Dual SIM",
    createdAt: "2023-06-05 10:25:36 am"
  },
  {
    id: 3,
    name: "Single e-SIM",
    createdAt: "2023-06-05 10:25:30 am"
  },
  {
    id: 4,
    name: "Single SIM",
    createdAt: "2023-06-05 10:25:24 am"
  }
];

export default function ViewAllSimsPage() {
  const [sims, setSims] = useState<Sim[]>(mockSims);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSims = sims.filter(sim =>
    sim.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setSims(sims.filter(sim => sim.id !== id));
  };

  const handleEdit = (id: number) => {
    // Handle edit functionality
    console.log("Edit sim:", id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>PAGES</span>
          <span className="text-gray-400">→</span>
          <span className="text-blue-600 font-medium">SIM</span>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">View All Sim Types</h1>
        </div>

        {/* Sim Type List Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
              <h2 className="text-lg font-semibold text-gray-900">Sim Type List</h2>
            </div>

            {/* Table Controls */}
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Input
                  type="text"
                  placeholder="Filter sims..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                />
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sim Type
                </Button>
              </div>
            </div>
          </div>

          {/* DataTable */}
          <div className="p-6">
            <DataTable
              columns={createColumns(handleEdit, handleDelete)}
              data={filteredSims}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
