"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

export type Subcategory = {
  id: number
  category: string
  name: string
  icon: string
  image: string
  slug: string
  featured: "Featured" | "Not Featured"
  status: "Active" | "Inactive"
  created_at: string
}

export const subcategory_columns: ColumnDef<Subcategory>[] = [
  {
    accessorKey: "id",
    header: "SL",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "icon",
    header: "Icon",
    cell: ({ row }) => {
      const icon = row.getValue("icon") as string
      return (
        <div className="w-16 h-12 bg-gray-50 rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-500">
          {icon}
        </div>
      )
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.getValue("image") as string
      return (
        <div className="w-16 h-12 bg-gray-50 rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-500">
          {image}
        </div>
      )
    },
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => <div className="font-mono text-sm text-gray-600">{row.getValue("slug")}</div>,
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => {
      const featured = row.getValue("featured") as string
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          featured === "Featured" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {featured}
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
