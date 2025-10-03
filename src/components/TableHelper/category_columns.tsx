"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

export type Category = {
  _id?: string
  categoryId?: string
  id: number
  name: string
  categoryIcon?: string
  categoryBanner?: string
  slug?: string
  isFeatured?: boolean
  isNavbar?: boolean
  status: "Active" | "Inactive"
  created_at: string
}

export const category_columns: ColumnDef<Category>[] = [
  {
    accessorKey: "id",
    header: "SL",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "categoryIcon",
    header: "Icon",
    cell: ({ row }) => {
      const url = row.getValue("categoryIcon") as string | undefined
      return url ? <img src={url} alt="icon" className="w-6 h-6 object-cover rounded" /> : <span className="text-xs text-gray-500">-</span>
    },
  },
  {
    accessorKey: "categoryBanner",
    header: "Banner Image",
    cell: ({ row }) => {
      const url = row.getValue("categoryBanner") as string | undefined
      return url ? <img src={url} alt="banner" className="w-12 h-6 object-cover rounded" /> : <span className="text-xs text-gray-500">-</span>
    },
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
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
    accessorKey: "isNavbar",
    header: "Show On Navbar",
    cell: ({ row }) => {
      const val = row.getValue("isNavbar") as boolean | undefined
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${val ? 'bg-teal-100 text-teal-800' : 'bg-rose-100 text-rose-800'}`}>
          {val ? 'Yes' : 'No'}
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
