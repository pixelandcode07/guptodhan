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

export const subcategory_columns: ColumnDef<SubCategory>[] = [
  { accessorKey: "id", header: "SL" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "subCategoryIcon",
    header: "Icon",
    cell: ({ row }) => {
      const url = row.getValue("subCategoryIcon") as string | undefined
      return url ? <img src={url} alt="icon" className="w-6 h-6 object-cover rounded" /> : <span className="text-xs text-gray-500">-</span>
    },
  },
  {
    accessorKey: "subCategoryBanner",
    header: "Image",
    cell: ({ row }) => {
      const url = row.getValue("subCategoryBanner") as string | undefined
      return url ? <img src={url} alt="banner" className="w-12 h-6 object-cover rounded" /> : <span className="text-xs text-gray-500">-</span>
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
