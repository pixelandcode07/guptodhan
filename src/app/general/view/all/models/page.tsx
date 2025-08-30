"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { createColumns, Model } from "./columns";
import { DataTable } from "./data-table";

// Mock data - in a real app, this would come from an API
const mockModels: Model[] = [
  {
    id: 1,
    brand: "Honor",
    modelName: "Honor Pad X9 WIFI",
    code: "",
    slug: "honor-pad-x9-wifi",
    status: "Active",
    createdAt: "2023-05-14 07:36:39 pm"
  },
  {
    id: 2,
    brand: "Honor",
    modelName: "Honor Pad X8a Wifi (4GB+64GB)",
    code: "",
    slug: "honor-pad-x8a-wifi-4gb-64gb",
    status: "Active",
    createdAt: "2023-05-14 07:36:45 pm"
  },
  {
    id: 3,
    brand: "Honor",
    modelName: "HONOR Pad X8a LTE",
    code: "",
    slug: "honor-pad-x8a-lte",
    status: "Active",
    createdAt: "2023-05-14 07:36:51 pm"
  },
  {
    id: 4,
    brand: "Honor",
    modelName: "Honor Pad 9",
    code: "",
    slug: "honor-pad-9",
    status: "Active",
    createdAt: "2023-05-14 07:36:57 pm"
  },
  {
    id: 5,
    brand: "Honor",
    modelName: "HONOR X5b",
    code: "",
    slug: "honor-x5b",
    status: "Active",
    createdAt: "2023-05-14 07:37:03 pm"
  },
  {
    id: 6,
    brand: "Honor",
    modelName: "HONOR 90 Lite",
    code: "",
    slug: "honor-90-lite",
    status: "Active",
    createdAt: "2023-05-14 07:37:09 pm"
  },
  {
    id: 7,
    brand: "Honor",
    modelName: "HONOR X8b",
    code: "",
    slug: "honor-x8b",
    status: "Active",
    createdAt: "2023-05-14 07:37:15 pm"
  },
  {
    id: 8,
    brand: "Honor",
    modelName: "HONOR X9a",
    code: "",
    slug: "honor-x9a",
    status: "Active",
    createdAt: "2023-05-14 07:37:21 pm"
  },
  {
    id: 9,
    brand: "Honor",
    modelName: "HONOR 90",
    code: "",
    slug: "honor-90",
    status: "Active",
    createdAt: "2023-05-14 07:37:27 pm"
  },
  {
    id: 10,
    brand: "Honor",
    modelName: "HONOR Magic5 Pro",
    code: "",
    slug: "honor-magic5-pro",
    status: "Active",
    createdAt: "2023-05-14 07:37:33 pm"
  },
  {
    id: 11,
    brand: "Honor",
    modelName: "HONOR Magic5 Lite",
    code: "",
    slug: "honor-magic5-lite",
    status: "Active",
    createdAt: "2023-05-14 07:37:39 pm"
  },
  {
    id: 12,
    brand: "Honor",
    modelName: "HONOR Magic5",
    code: "",
    slug: "honor-magic5",
    status: "Active",
    createdAt: "2023-05-14 07:37:45 pm"
  },
  {
    id: 13,
    brand: "Honor",
    modelName: "HONOR Magic4 Pro",
    code: "",
    slug: "honor-magic4-pro",
    status: "Active",
    createdAt: "2023-05-14 07:37:51 pm"
  },
  {
    id: 14,
    brand: "Honor",
    modelName: "HONOR Magic4",
    code: "",
    slug: "honor-magic4",
    status: "Active",
    createdAt: "2023-05-14 07:37:57 pm"
  },
  {
    id: 15,
    brand: "Honor",
    modelName: "HONOR Magic3 Pro+",
    code: "",
    slug: "honor-magic3-pro-plus",
    status: "Active",
    createdAt: "2023-05-14 07:38:03 pm"
  },
  {
    id: 16,
    brand: "Samsung",
    modelName: "Galaxy S24 Ultra",
    code: "SM-S928B",
    slug: "galaxy-s24-ultra",
    status: "Active",
    createdAt: "2023-05-14 07:38:09 pm"
  },
  {
    id: 17,
    brand: "Samsung",
    modelName: "Galaxy S24+",
    code: "SM-S926B",
    slug: "galaxy-s24-plus",
    status: "Active",
    createdAt: "2023-05-14 07:38:15 pm"
  },
  {
    id: 18,
    brand: "Samsung",
    modelName: "Galaxy S24",
    code: "SM-S921B",
    slug: "galaxy-s24",
    status: "Active",
    createdAt: "2023-05-14 07:38:21 pm"
  },
  {
    id: 19,
    brand: "Apple",
    modelName: "iPhone 15 Pro Max",
    code: "A3090",
    slug: "iphone-15-pro-max",
    status: "Active",
    createdAt: "2023-05-14 07:38:27 pm"
  },
  {
    id: 20,
    brand: "Apple",
    modelName: "iPhone 15 Pro",
    code: "A3092",
    slug: "iphone-15-pro",
    status: "Active",
    createdAt: "2023-05-14 07:38:33 pm"
  },
  {
    id: 21,
    brand: "Apple",
    modelName: "iPhone 15 Plus",
    code: "A3091",
    slug: "iphone-15-plus",
    status: "Active",
    createdAt: "2023-05-14 07:38:39 pm"
  },
  {
    id: 22,
    brand: "Apple",
    modelName: "iPhone 15",
    code: "A3093",
    slug: "iphone-15",
    status: "Active",
    createdAt: "2023-05-14 07:38:45 pm"
  },
  {
    id: 23,
    brand: "Nike",
    modelName: "Air Max 270",
    code: "AH8050",
    slug: "air-max-270",
    status: "Active",
    createdAt: "2023-05-14 07:38:51 pm"
  },
  {
    id: 24,
    brand: "Nike",
    modelName: "Air Force 1",
    code: "CW2288",
    slug: "air-force-1",
    status: "Active",
    createdAt: "2023-05-14 07:38:57 pm"
  },
  {
    id: 25,
    brand: "Adidas",
    modelName: "Ultraboost 22",
    code: "GZ0127",
    slug: "ultraboost-22",
    status: "Active",
    createdAt: "2023-05-14 07:39:03 pm"
  }
];

export default function ViewAllModelsPage() {
  const [models, setModels] = useState<Model[]>(mockModels);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredModels = models.filter(model =>
    model.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setModels(models.filter(model => model.id !== id));
  };

  const handleEdit = (id: number) => {
    // Handle edit functionality
    console.log("Edit model:", id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>PAGES</span>
          <span className="text-gray-400">→</span>
          <span className="text-blue-600 font-medium">MODEL</span>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">View All Models</h1>
        </div>

        {/* Model List Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
              <h2 className="text-lg font-semibold text-gray-900">Models</h2>
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
                  placeholder="Search:"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                />
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Model
                </Button>
              </div>
            </div>
          </div>

          {/* DataTable */}
          <div className="p-6">
            <DataTable
              columns={createColumns(handleEdit, handleDelete)}
              data={filteredModels}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
