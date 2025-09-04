"use client"

import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import {  Edit, X } from "lucide-react"
import { Button } from "../ui/button"


export type StoresDataType = {
  serial: string,
  store_logo: string,
  store_name: string,
  business_name: string,
  total_product: number,
  total_earnings: number,
  current_balance: number,
  commission: number,
  status: "pending" | "active" | "inactive",
  created_at: string,
}

export const all_store_columns: ColumnDef<StoresDataType>[] = [
  {
    accessorKey: "serial",
    header: "Serial",
  },
  {
    accessorKey: "store_logo",
    header: "Store Logo",
     cell: ({ row }) => {
    const logoUrl = row.getValue("store_logo") as string
    return (
      <img
        src={logoUrl}
        alt="Store Logo"
        className="h-10 w-10 object-cover rounded-md"
      />
    )
  },
  },
  {
    accessorKey: "store_name",
    header: "Store Name",
  },
  {
    accessorKey: "business_name",
    header: "Business Name",
  },
  {
    accessorKey: "total_product",
    header: "Total Product",
  },
  {
    accessorKey: "total_earnings",
    header: "Total Earnings",
  },
  {
    accessorKey: "current_balance",
    header: "Current Balance",
  },
  {
    accessorKey: "commission",
    header: "Commission",
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
    accessorKey: "created_at",
    header: "Created At",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          {/* <Button className="bg-green-800 hover:bg-green-800 text-black cursor-pointer"><Check className="text-white" /></Button> */}
          <Button className="bg-yellow-400 hover:bg-yellow-400 text-black cursor-pointer"><Edit /></Button>
          <Button className="bg-red-700 hover:bg-red-700 text-white cursor-pointer"><X /></Button>
        </div>
      )
    }
  },
]