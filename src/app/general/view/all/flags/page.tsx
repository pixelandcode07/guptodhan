"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Move } from "lucide-react";
import { createColumns, Flag } from "./columns";
import { DataTable } from "./data-table";

// Mock data - in a real app, this would come from an API
const mockFlags: Flag[] = [
  {
    id: 1,
    icon: "",
    name: "New Collection",
    status: "Active",
    featured: "Featured",
    createdAt: "2024-08-18 09:58:42 pm"
  },
  {
    id: 2,
    icon: "",
    name: "Best",
    status: "Inactive",
    featured: "Featured",
    createdAt: "2024-08-18 10:00:02 pm"
  },
  {
    id: 3,
    icon: "",
    name: "Popular",
    status: "Active",
    featured: "Featured",
    createdAt: "2024-08-18 10:00:20 pm"
  },
  {
    id: 4,
    icon: "",
    name: "Offer",
    status: "Active",
    featured: "Not Featured",
    createdAt: "2025-03-10 01:25:58 pm"
  },
  {
    id: 5,
    icon: "",
    name: "Eid Collection",
    status: "Active",
    featured: "Featured",
    createdAt: "2024-08-18 10:00:09 pm"
  }
];

export default function ViewAllFlagsPage() {
  const [flags, setFlags] = useState<Flag[]>(mockFlags);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFlags = flags.filter(flag =>
    flag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setFlags(flags.filter(flag => flag.id !== id));
  };

  const handleEdit = (id: number) => {
    // Handle edit functionality
    console.log("Edit flag:", id);
  };

  const handleToggleFeatured = (id: number) => {
    setFlags(flags.map(flag => 
      flag.id === id 
        ? { ...flag, featured: flag.featured === "Featured" ? "Not Featured" : "Featured" }
        : flag
    ));
    console.log(`Toggled featured status for flag ${id}`);
  };

  const handleRearrangeAll = () => {
    // Handle bulk rearrange functionality
    console.log("Rearrange all flags");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>PAGES</span>
          <span className="text-gray-400">→</span>
          <span className="text-blue-600 font-medium">FLAG</span>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">View All Flags</h1>
        </div>

        {/* Flag List Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
              <h2 className="text-lg font-semibold text-gray-900">Flag List</h2>
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
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                />
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Flag
                </Button>
                <Button variant="outline" onClick={handleRearrangeAll}>
                  <Move className="w-4 h-4 mr-2" />
                  Rearrange Flags
                </Button>
              </div>
            </div>
          </div>

          {/* DataTable */}
          <div className="p-6">
            <DataTable
              columns={createColumns(handleEdit, handleDelete, handleToggleFeatured)}
              data={filteredFlags}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
