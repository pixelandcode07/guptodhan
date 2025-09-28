"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"


export type Color = {
  id: number
  name: string
  code: string
 
}

export const color_columns: ColumnDef<Color>[] = [
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
    id: "action",
    header: "Action",
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Edit className="w-4 h-4" />
          </Button>
          
        </div>
      )
    },
  },
]
