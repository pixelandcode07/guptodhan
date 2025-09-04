"use client"

import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { Check, Edit, Trash } from "lucide-react"
import { Button } from "../ui/button"


export type Payment = {
  serial: string,
  vandor_name: string,
  amount: number,
  date_time: "02/09/2025",
  method: string,
  bank_name: string,
  bank_account: number,
  store: string,
  verified: 'Yes' | 'No',
  status: "pending" | "active" | "inactive",
  created_at: string,
}

export const vendor_req_columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "serial",
    header: "Serial",
  },
  {
    accessorKey: "owner_name",
    header: "Name",
  },
  {
    accessorKey: "owner_email",
    header: "Email",
  },
  {
    accessorKey: "owner_phone",
    header: "Phone",
  },
  {
    accessorKey: "Business_name",
    header: "Business Name",
  },
  {
    accessorKey: "trade_license_number",
    header: "Trade License Number",
  },
  {
    accessorKey: "store",
    header: "Store",
  },
  {
    accessorKey: "verified",
    header: "Verified",
    cell: ({ row }) => {
      const verified = row.getValue("verified")

      return (
        <div className={cn(`p-1 rounded-md w-max text-xs`,
          verified === "Yes" && "text-green-500",
          verified === "No" && "text-red-500",
        )}>{verified as string}</div>
      )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")

      return (
        <div className={cn(`p-1 rounded-md w-max text-xs`,
          status === "pending" && "text-yellow-400",
          status === "active" && "text-green-500",
          status === "inactive" && "text-red-500",
        )}>{status as string}</div>
      )
    }
  },
  {
    accessorKey: "created_at",
    header: "Created At",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button className="bg-green-800 hover:bg-green-800 text-black cursor-pointer"><Check className="text-white" /></Button>
          <Button className="bg-yellow-400 hover:bg-yellow-400 text-black cursor-pointer"><Edit /></Button>
          <Button className="bg-red-700 hover:bg-red-700 text-white cursor-pointer"><Trash /></Button>
        </div>
      )
    }
  },

]