"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

export type Color = {
  _id: string
  id: number
  productColorId: string
  name: string
  code: string
  status: "Active" | "Inactive"
  created_at: string
}

export type ColorColumnHandlers = {
  onEdit: (color: Color) => void
  onDelete: (color: Color) => void
}

export const getColorColumns = ({ onEdit }: ColorColumnHandlers): ColumnDef<Color>[] => [
  {
    accessorKey: "id",
    header: "SL",
  },
  {
    id: "colorSwatch",
    header: "Color",
    cell: ({ row }) => {
      const color = row.getValue("code") as string;
      return (
        <div className="flex items-center space-x-2">
          <div 
            className="w-8 h-8 rounded border border-gray-300"
            style={{ backgroundColor: color }}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => <div className="font-mono text-sm text-gray-600">{row.getValue("code")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return <span>{status}</span>
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
      const color = row.original as Color
      return (
        <div className="flex items-center gap-2">
          <Button onClick={() => onEdit(color)} variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Edit className="w-4 h-4" />
          </Button>
          {/* <Button onClick={() => onDelete(color)} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button> */}
        </div>
      )
    },
  },
]