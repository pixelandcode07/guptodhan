"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

export type ChildCategory = {
  _id: string
  id: number
  category: string
  subCategory: string
  categoryId?: string
  subCategoryId?: string
  icon?: string
  name: string
  slug: string
  status: "Active" | "Inactive"
  created_at: string
}

export const getChildCategoryColumns = ({ onEdit, onDelete }: { onEdit: (row: ChildCategory) => void; onDelete: (row: ChildCategory) => void }): ColumnDef<ChildCategory>[] => [
  {
    accessorKey: "id",
    header: "SL",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "subCategory",
    header: "Sub Category",
  },
  {
    accessorKey: "icon",
    header: "Icon",
    cell: ({ row }) => {
      const icon = row.getValue("icon") as string
      return (
        <div className="w-16 h-12 bg-gray-50 rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-500">
          {icon ? (
            <img src={icon} alt="Icon" className="w-full h-full object-cover rounded" />
          ) : (
            "No Icon"
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Name",
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
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => onEdit(row.original)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => onDelete(row.original)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  },
]

// Legacy export for backward compatibility
export const childcategory_columns: ColumnDef<ChildCategory>[] = getChildCategoryColumns({ 
  onEdit: () => {}, 
  onDelete: () => {} 
})
