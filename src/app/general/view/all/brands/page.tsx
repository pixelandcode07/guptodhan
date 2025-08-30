"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Move } from "lucide-react";
import { createColumns, Brand } from "./columns";
import { DataTable } from "./data-table";


const mockBrands: Brand[] = [
  {
    id: 1,
    name: "Honor",
    logo: "honor",
    banner: "honor",
    categories: ["Mobile"],
    subcategories: ["Smart Phone"],
    childcategories: ["Honor"],
    slug: "honor",
    status: "Active",
    featured: "Not Featured",
    createdAt: "2023-05-14 07:36:39 pm"
  },
  {
    id: 2,
    name: "Samsung",
    logo: "samsung",
    banner: "samsung",
    categories: ["Mobile", "Electronics"],
    subcategories: ["Smart Phone", "Tablet"],
    childcategories: ["Galaxy", "Note"],
    slug: "samsung",
    status: "Active",
    featured: "Not Featured",
    createdAt: "2023-05-14 07:36:45 pm"
  },
  {
    id: 3,
    name: "Apple",
    logo: "apple",
    banner: "apple",
    categories: ["Mobile", "Electronics"],
    subcategories: ["Smart Phone", "Laptop"],
    childcategories: ["iPhone", "MacBook"],
    slug: "apple",
    status: "Active",
    featured: "Not Featured",
    createdAt: "2023-05-14 07:36:51 pm"
  },
  {
    id: 4,
    name: "Nike",
    logo: "nike",
    banner: "nike",
    categories: ["Sports", "Fashion"],
    subcategories: ["Shoes", "Clothing"],
    childcategories: ["Running", "Basketball"],
    slug: "nike",
    status: "Active",
    featured: "Not Featured",
    createdAt: "2023-05-14 07:36:57 pm"
  },
  {
    id: 5,
    name: "Adidas",
    logo: "adidas",
    banner: "adidas",
    categories: ["Sports", "Fashion"],
    subcategories: ["Shoes", "Clothing"],
    childcategories: ["Football", "Training"],
    slug: "adidas",
    status: "Active",
    featured: "Not Featured",
    createdAt: "2023-05-14 07:37:03 pm"
  },
  {
    id: 6,
    name: "Regal Furniture",
    logo: "Regal",
    banner: "furniture",
    categories: ["Home & Living"],
    subcategories: ["Furniture"],
    childcategories: ["Sofa", "Bed"],
    slug: "regal-furniture",
    status: "Active",
    featured: "Not Featured",
    createdAt: "2023-05-14 07:37:09 pm"
  },
  {
    id: 7,
    name: "IKEA",
    logo: "IKEA",
    banner: "ikea",
    categories: ["Home & Living"],
    subcategories: ["Furniture", "Decor"],
    childcategories: ["Kitchen", "Living Room"],
    slug: "ikea",
    status: "Active",
    featured: "Not Featured",
    createdAt: "2023-05-14 07:37:15 pm"
  },
  {
    id: 8,
    name: "havit",
    logo: "havit",
    banner: "HAVIT",
    categories: ["Gadget", "Computer"],
    subcategories: ["Charger", "All Laptop", "Processor"],
    childcategories: ["Gaming", "Office"],
    slug: "havit",
    status: "Active",
    featured: "Not Featured",
    createdAt: "2023-05-14 07:37:21 pm"
  },
  {
    id: 9,
    name: "Logitech",
    logo: "logitech",
    banner: "logitech",
    categories: ["Computer", "Gadget"],
    subcategories: ["Mouse", "Keyboard"],
    childcategories: ["Gaming", "Office"],
    slug: "logitech",
    status: "Active",
    featured: "Not Featured",
    createdAt: "2023-05-14 07:37:27 pm"
  },
  {
    id: 10,
    name: "Thirty Three",
    logo: "33",
    banner: "33",
    categories: ["Fashion"],
    subcategories: ["Clothing"],
    childcategories: ["Men", "Women"],
    slug: "thirty-three",
    status: "Active",
    featured: "Not Featured",
    createdAt: "2023-05-14 07:37:33 pm"
  }
];

export default function ViewAllBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>(mockBrands);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setBrands(brands.filter(brand => brand.id !== id));
  };

  const handleEdit = (id: number) => {
    // Handle edit functionality
    console.log("Edit brand:", id);
  };

  const handleRearrange = () => {
    // Handle rearrange functionality
    console.log("Rearrange brands");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>PAGES</span>
          <span className="text-gray-400">→</span>
          <span className="text-blue-600 font-medium">BRAND</span>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">View All Brands</h1>
        </div>

        {/* Brand List Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
              <h2 className="text-lg font-semibold text-gray-900">Brand List</h2>
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
                  placeholder="Search brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                />
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Brand
                </Button>
                <Button variant="outline" onClick={handleRearrange}>
                  <Move className="w-4 h-4 mr-2" />
                  Rearrange Brand
                </Button>
              </div>
            </div>
          </div>

          {/* DataTable */}
          <div className="p-6">
            <DataTable
              columns={createColumns(handleEdit, handleDelete)}
              data={filteredBrands}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
