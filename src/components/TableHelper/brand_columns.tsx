"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

export type Brand = {
  id: number
  name: string
  logo: string
  banner: string
  categories: string[]
  subcategories: string[]
  childcategories: string[]
  slug: string
  status: "Active" | "Inactive"
  featured: "Featured" | "Not Featured"
  created_at: string
}

export const brand_columns: ColumnDef<Brand>[] = [
  {
    accessorKey: "id",
    header: "SL",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => {
      const logo = row.getValue("logo") as string;
      return (
        <div className="flex items-center space-x-2">
          <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs font-semibold">
            {logo}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "banner",
    header: "Banner",
    cell: ({ row }) => {
      const banner = row.getValue("banner") as string;
      return (
        <div className="flex items-center space-x-2">
          <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs font-semibold">
            {banner}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "categories",
    header: "Categories",
    cell: ({ row }) => {
      const categories = row.getValue("categories") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {categories.map((category, index) => (
            <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {category}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "subcategories",
    header: "Subcategories",
    cell: ({ row }) => {
      const subcategories = row.getValue("subcategories") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {subcategories.map((subcategory, index) => (
            <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {subcategory}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "childcategories",
    header: "Childcategories",
    cell: ({ row }) => {
      const childcategories = row.getValue("childcategories") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {childcategories.map((childcategory, index) => (
            <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {childcategory}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => <div className="font-mono text-sm text-gray-600">{row.getValue("slug")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          status === "Active" 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => {
      const featured = row.getValue("featured") as string;
      return (
        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          featured === "Featured" 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {featured}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
  },
  {
    id: "action",
    header: "Action",
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  },
]
