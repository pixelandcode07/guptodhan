"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

export type Unit = {
  _id: string
  id: number
  productUnitId: string
  name: string
  status: "Active" | "Inactive"
  created_at: string
}

export type UnitColumnHandlers = {
  onEdit: (unit: Unit) => void
  onDelete: (unit: Unit) => void
}

export const getUnitColumns = ({ onEdit, onDelete }: UnitColumnHandlers): ColumnDef<Unit>[] => [
  {
    accessorKey: "id",
    header: "SL",
    cell: ({ row }) => {
      return (
        <div className="pl-4">
          {row.getValue("id")}
        </div>
      )
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
      const status = row.getValue("status") as string
      return (
        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          status === "Active" 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {status}
        </div>
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
    cell: ({ row }) => {
      const unit = row.original as Unit
      return (
        <div className="flex items-center gap-2">
          <Button onClick={() => onEdit(unit)} variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Edit className="w-4 h-4" />
          </Button>
          <Button onClick={() => onDelete(unit)} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  },
]
