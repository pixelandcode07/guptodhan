"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Move } from "lucide-react";
import { createColumns, DeviceCondition } from "./columns";
import { DataTable } from "./data-table";

// Mock data - in a real app, this would come from an API
const mockDeviceConditions: DeviceCondition[] = [
  {
    id: 1,
    name: "Brand New (Official)",
    createdAt: "2023-06-05 10:34:14 am"
  },
  {
    id: 2,
    name: "Brand New (Unofficial)",
    createdAt: "2023-07-17 03:50:39 am"
  },
  {
    id: 3,
    name: "Used (Few Scratches)",
    createdAt: "2023-07-17 03:52:02 am"
  },
  {
    id: 4,
    name: "Used (Fresh Condition)",
    createdAt: "2023-06-05 10:34:27 am"
  },
  {
    id: 5,
    name: "Refurbished",
    createdAt: "2023-06-05 10:34:33 am"
  }
];

export default function ViewAllDeviceConditionsPage() {
  const [deviceConditions, setDeviceConditions] = useState<DeviceCondition[]>(mockDeviceConditions);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDeviceConditions = deviceConditions.filter(condition =>
    condition.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setDeviceConditions(deviceConditions.filter(condition => condition.id !== id));
  };

  const handleEdit = (id: number) => {
    // Handle edit functionality
    console.log("Edit device condition:", id);
  };

  const handleRearrange = () => {
    // Handle rearrange functionality
    console.log("Rearrange device conditions");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>PAGES</span>
          <span className="text-gray-400">→</span>
          <span className="text-blue-600 font-medium">DEVICE CONDITION</span>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">View All Device Conditions</h1>
        </div>

        {/* Device Condition List Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
              <h2 className="text-lg font-semibold text-gray-900">Device Condition List</h2>
            </div>

            {/* Table Controls */}
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Input
                  type="text"
                  placeholder="Filter device conditions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                />
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Device Condition
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
              data={filteredDeviceConditions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
