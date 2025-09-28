"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

export type Brand = {
  _id: string
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

export type BrandColumnHandlers = {
  onEdit: (brand: Brand) => void
  onDelete: (brand: Brand) => void
}

export const getBrandColumns = ({ onEdit, onDelete }: BrandColumnHandlers): ColumnDef<Brand>[] => [
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
          {logo ? (
            <img 
              src={logo} 
              alt="Brand Logo" 
              className="w-12 h-8 object-cover rounded border"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600 text-xs font-semibold border ${logo ? 'hidden' : ''}`}>
            {logo ? logo.substring(0, 2).toUpperCase() : 'N/A'}
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
          {banner ? (
            <img 
              src={banner} 
              alt="Brand Banner" 
              className="w-12 h-8 object-cover rounded border"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600 text-xs font-semibold border ${banner ? 'hidden' : ''}`}>
            {banner ? banner.substring(0, 2).toUpperCase() : 'N/A'}
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
        <div className="flex flex-wrap gap-1 max-w-32">
          {categories && categories.length > 0 ? (
            categories.map((category, index) => (
              <span key={index} className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                {category}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">No categories</span>
          )}
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
        <div className="flex flex-wrap gap-1 max-w-32">
          {subcategories && subcategories.length > 0 ? (
            subcategories.map((subcategory, index) => (
              <span key={index} className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-green-50 text-green-700 border border-green-200">
                {subcategory}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">No subcategories</span>
          )}
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
        <div className="flex flex-wrap gap-1 max-w-32">
          {childcategories && childcategories.length > 0 ? (
            childcategories.map((childcategory, index) => (
              <span key={index} className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                {childcategory}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">No child categories</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => {
      const slug = row.getValue("slug") as string;
      return (
        <div className="font-mono text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border max-w-24 truncate" title={slug}>
          {slug}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          status === "Active" 
            ? "bg-green-100 text-green-800 border border-green-200" 
            : "bg-red-100 text-red-800 border border-red-200"
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
            ? "bg-yellow-100 text-yellow-800 border border-yellow-200" 
            : "bg-gray-100 text-gray-600 border border-gray-200"
        }`}>
          {featured}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string;
      return (
        <div className="text-xs text-gray-600">
          {new Date(date).toLocaleDateString()}
        </div>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const brand = row.original as Brand
      return (
        <div className="flex items-center gap-2">
          <Button onClick={() => onEdit(brand)} variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Edit className="w-4 h-4" />
          </Button>
          <Button onClick={() => onDelete(brand)} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  },
]
