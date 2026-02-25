"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

export type SubCategory = {
  _id?: string
  subCategoryId?: string
  id: number
  category?: string
  name: string
  subCategoryIcon?: string
  subCategoryBanner?: string
  slug?: string
  isFeatured?: boolean
  isNavbar?: boolean
  status: "Active" | "Inactive"
  created_at: string
}

// ✅ Helper function: URL valid kina check korar jonno
const isValidImageUrl = (url: any) => {
  return typeof url === 'string' && url.trim().length > 5 && url.includes('http');
};

export const subcategory_columns: ColumnDef<SubCategory>[] = [
  { accessorKey: "id", header: "SL" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "subCategoryIcon",
    header: "Icon",
    cell: ({ row }) => {
      const url = row.getValue("subCategoryIcon");
      return isValidImageUrl(url) ? (
        <img src={url as string} alt="icon" className="w-8 h-8 object-cover rounded shadow-sm border border-gray-100" />
      ) : (
        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">No Icon</span>
      )
    },
  },
  {
    accessorKey: "subCategoryBanner",
    header: "Image",
    cell: ({ row }) => {
      const url = row.getValue("subCategoryBanner");
      return isValidImageUrl(url) ? (
        <img src={url as string} alt="banner" className="w-16 h-8 object-cover rounded shadow-sm border border-gray-100" />
      ) : (
        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">No Image</span>
      )
    },
  },
  { accessorKey: "slug", header: "Slug" },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => {
      const val = row.getValue("isFeatured") as boolean | undefined
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${val ? 'bg-cyan-100 text-cyan-800' : 'bg-gray-100 text-gray-600'}`}>
          {val ? 'Featured' : 'Not Featured'}
        </span>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {status}
        </span>
      )
    },
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

export type SubCategoryColumnHandlers = {
  onEdit: (row: SubCategory) => void
  onDelete: (row: SubCategory) => void
}

export const getSubCategoryColumns = ({ onEdit, onDelete }: SubCategoryColumnHandlers): ColumnDef<SubCategory>[] => [
  ...subcategory_columns.slice(0, -1),
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const data = row.original as SubCategory
      return (
        <div className="flex items-center gap-2">
          <Button onClick={() => onEdit(data)} variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Edit className="w-4 h-4" />
          </Button>
          <Button onClick={() => onDelete(data)} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  },
]