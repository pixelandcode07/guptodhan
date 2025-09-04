"use client"

import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { Check, Edit } from "lucide-react"
import { Button } from "../ui/button"


export type Payment = {
  serial: string,
  vendor_id: number,
  owner_name: string,
  owner_email: string,
  owner_phone: string,
  Business_name: string,
  trade_license_number: number,
  store: string,
  status: "pending" | "active" | "inactive",
  created_at: string,
}

export const inactive_vendor_columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "serial",
    header: "Serial",
  },
  {
    accessorKey: "owner_name",
    header: "Full Name",
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
    header: "Store Name",
  },
  // {
  //   accessorKey: "verified",
  //   header: "Verified",
  //   cell: ({ row }) => {
  //     const verified = row.getValue("verified")

  //     return (
  //       <div className={cn(`p-1 rounded-md w-max text-xs`,
  //         verified === "Yes" && "text-green-500",
  //         verified === "No" && "text-red-500",
  //       )}>{verified as string}</div>
  //     )
  //   }
  // },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")
      // status: "pending" | "active" | "inactive",
      return (
        <div className={cn(`p-1 rounded-md w-max text-xs`,
          status === "pending" && "text-yellow-400",
          status === "active" && "text-green-500",
          status === "inactive" && "text-white bg-red-500",
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
          {/* <Button className="bg-red-700 hover:bg-red-700 text-white cursor-pointer"><Trash /></Button> */}
        </div>
      )
    }
  },
]