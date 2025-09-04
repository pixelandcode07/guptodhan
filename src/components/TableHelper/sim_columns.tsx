"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

export type Sim = {
  id: number
  name: string
  created_at: string
}

export const sim_columns: ColumnDef<Sim>[] = [
  {
    accessorKey: "id",
    header: "SL",
  },
  {
    accessorKey: "name",
    header: "Name",
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


