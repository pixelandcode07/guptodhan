"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

export type PromoCode = {
  id: number
  title: string
  effective_date: string
  expiry_date: string
  type: "Percentage" | "Fixed Amount"
  value: string
  min_spend: string
  code: string
  status: "Active" | "Inactive" | "Expired"
  _id: string
}

export const getPromoCodeColumns = ({ onEdit, onDelete }: { onEdit: (row: PromoCode) => void; onDelete: (row: PromoCode) => void }): ColumnDef<PromoCode>[] => [
  {
    accessorKey: "id",
    header: "SL",
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <div className="max-w-xs truncate" title={title}>
          {title}
        </div>
      );
    },
  },
  {
    accessorKey: "effective_date",
    header: "Effective Date",
    cell: ({ row }) => {
      const date = row.getValue("effective_date") as string;
      return (
        <div className="text-sm">
          {date}
        </div>
      );
    },
  },
  {
    accessorKey: "expiry_date",
    header: "Expiry Date",
    cell: ({ row }) => {
      const date = row.getValue("expiry_date") as string;
      return (
        <div className="text-sm">
          {date}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          type === "Percentage"
            ? "bg-blue-100 text-blue-800"
            : "bg-green-100 text-green-800"
        }`}>
          {type}
        </div>
      );
    },
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      const value = row.getValue("value") as string;
      return (
        <div className="font-mono text-sm">
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: "min_spend",
    header: "Min. Spend",
    cell: ({ row }) => {
      const minSpend = row.getValue("min_spend") as string;
      return (
        <div className="font-mono text-sm">
          {minSpend}
        </div>
      );
    },
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      const code = row.getValue("code") as string;
      return (
        <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          {code}
        </div>
      );
    },
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
            : status === "Inactive"
            ? "bg-red-100 text-red-800"
            : "bg-gray-100 text-gray-800"
        }`}>
          {status}
        </div>
      );
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
export const promo_codes_columns: ColumnDef<PromoCode>[] = getPromoCodeColumns({ 
  onEdit: () => {}, 
  onDelete: () => {} 
})
