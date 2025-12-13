"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

export type DeliveryCharge = {
  _id?: string
  id: number
  division: string
  district: string
  district_bangla: string
  delivery_charge: number
}

export type DeliveryChargeHandlers = { onEdit: (row: DeliveryCharge) => void }

export const getDeliveryChargesColumns = ({ onEdit }: DeliveryChargeHandlers): ColumnDef<DeliveryCharge>[] => [
  {
    accessorKey: "id",
    header: "SL",
  },
  {
    accessorKey: "division",
    header: "Division",
    cell: ({ row }) => {
      const division = row.getValue("division") as string;
      return (
        <div className="max-w-xs truncate" title={division}>
          {division}
        </div>
      );
    },
  },
  {
    accessorKey: "district",
    header: "District",
    cell: ({ row }) => {
      const district = row.getValue("district") as string;
      return (
        <div className="max-w-xs truncate" title={district}>
          {district}
        </div>
      );
    },
  },
  {
    accessorKey: "district_bangla",
    header: "District (Bangla)",
    cell: ({ row }) => {
      const districtBangla = row.getValue("district_bangla") as string;
      return (
        <div className="max-w-xs truncate" title={districtBangla}>
          {districtBangla}
        </div>
      );
    },
  },
  {
    accessorKey: "delivery_charge",
    header: "Delivery Charge",
    cell: ({ row }) => {
      const charge = row.getValue("delivery_charge") as number;
      return (
        <div className="text-green-600 font-medium">
          BDT {charge}/=
        </div>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const record = row.original as DeliveryCharge
      return (
        <div className="flex items-center gap-2">
          <Button onClick={() => onEdit(record)} variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  },
]
