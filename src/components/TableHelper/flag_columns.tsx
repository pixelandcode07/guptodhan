"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ArrowUp } from "lucide-react"

export type Flag = {
  id: number
  icon: string
  name: string
  status: "Active" | "Inactive"
  featured: "Featured" | "Not Featured"
  created_at: string
}

export const flag_columns: ColumnDef<Flag>[] = [
  {
    accessorKey: "id",
    header: "SL",
  },
  {
    accessorKey: "icon",
    header: "Icon",
    cell: ({ row }) => {
      const icon = row.getValue("icon") as string;
      return (
        <div className="flex items-center space-x-2">
          {icon ? (
            <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-600 text-xs">
              {icon}
            </div>
          ) : (
            <div className="w-16 h-12 bg-gray-50 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
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
    cell: ({ row }) => {
      const flag = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`w-6 h-6 p-0 ${
              flag.featured === "Featured" 
                ? "text-green-600 hover:text-green-700 hover:bg-green-50" 
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
            title={flag.featured === "Featured" ? "Remove from Featured" : "Add to Featured"}
          >
            <ArrowUp className="w-3 h-3" />
          </Button>
        </div>
      )
    },
  },
]
