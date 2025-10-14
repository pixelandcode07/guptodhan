"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

export type DeviceCondition = {
  _id?: string
  id: number
  name: string
  status?: "Active" | "Inactive"
  created_at: string
}

export type DeviceConditionColumnHandlers = {
  onEdit: (condition: DeviceCondition) => void
  onDelete: (condition: DeviceCondition) => void
}

export const getDeviceConditionColumns = ({ onEdit, onDelete }: DeviceConditionColumnHandlers): ColumnDef<DeviceCondition>[] => [
  {
    accessorKey: "id",
    header: "SL",
    cell: ({ row }) => {
      const id = row.getValue("id") as number;
      return <span className="pl-4">{id}</span>;
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
      if (!status) return <span className="text-gray-400">-</span>;
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
    accessorKey: "created_at",
    header: "Created At",
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const condition = row.original as DeviceCondition
      return (
        <div className="flex items-center gap-2">
          <Button onClick={() => onEdit(condition)} variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Edit className="w-4 h-4" />
          </Button>
          <Button onClick={() => onDelete(condition)} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  },
]


