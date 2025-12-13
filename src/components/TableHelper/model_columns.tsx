"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

export type Model = {
  _id: string
  id: number
  brand: string
  modelName: string
  code: string
  slug: string
  status: "Active" | "Inactive"
  created_at: string
}

export type ModelColumnHandlers = {
  onEdit: (model: Model) => void
  onDelete: (model: Model) => void
}

export const getModelColumns = ({ onEdit, onDelete }: ModelColumnHandlers): ColumnDef<Model>[] => [
  {
    accessorKey: "id",
    header: "SL",
    cell: ({ row }) => {
      const id = row.getValue("id") as number;
      return <span className="pl-4">{id}</span>;
    },
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "modelName",
    header: "Model Name",
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      const code = row.getValue("code") as string;
      return (
        <div className="text-gray-500">
          {code || "-"}
        </div>
      );
    },
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
    accessorKey: "created_at",
    header: "Created At",
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const model = row.original as Model
      return (
        <div className="flex items-center gap-2">
          <Button onClick={() => onEdit(model)} variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Edit className="w-4 h-4" />
          </Button>
          <Button onClick={() => onDelete(model)} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  },
]
