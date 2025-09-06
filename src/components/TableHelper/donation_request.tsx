"use client"

import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { Check, Eye, Trash } from "lucide-react"
import { Button } from "../ui/button"


export type DonationReqDataType = {
  serial: string,
  user_name: string,
  user_email: string,
  user_mobile: number,
  adress: string,
  message: string,
  status: "pending" | "active" | "inactive",
}

export const donation_request: ColumnDef<DonationReqDataType>[] = [
  {
    accessorKey: "serial",
    header: "Serial",
  },
  {
    accessorKey: "user_name",
    header: "Name",
  },
  {
    accessorKey: "user_email",
    header: "Email",
  },
  {
    accessorKey: "user_mobile",
    header: "Phone",
  },
  {
    accessorKey: "adress",
    header: "Address",
  },
  {
    accessorKey: "message",
    header: "Message",
  },
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
    accessorKey: "action",
    header: "Action",
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button className="bg-red-700 hover:bg-red-700 text-white cursor-pointer"><Trash /></Button>
          <Button className="bg-green-800 hover:bg-green-800 text-black cursor-pointer"><Check className="text-white" /></Button>
          <Button className="bg-yellow-400 hover:bg-yellow-400 text-black cursor-pointer"><Eye /></Button>
        </div>
      )
    }
  },
]