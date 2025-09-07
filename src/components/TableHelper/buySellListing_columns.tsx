"use client"

import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { Check, Edit, Eye, X } from "lucide-react"
import { Button } from "../ui/button"


export type BuySellListingType = {
  serial: string,
  category: string,
  product_image: string,
  title: string,
  price: number,
  discount: number,
  phone: string,
  postedBy: string,
  status: "pending" | "approved" | "rejected",
}

export const buySellListing_columns: ColumnDef<BuySellListingType>[] = [
  {
    accessorKey: "serial",
    header: "Serial",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "product_image",
    header: "Image",
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
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "discount",
    header: "Discount",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "postedBy",
    header: "Posted By",
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
          status === "approved" && "text-green-500",
          status === "rejected" && "text-white bg-red-500",
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
          <Button className="bg-green-800 hover:bg-green-800 text-black cursor-pointer"><Check className="text-white" /></Button>
          <Button className="bg-green-800 hover:bg-green-800 text-black cursor-pointer"><Eye className="text-white" /></Button>
          <Button className="bg-yellow-400 hover:bg-yellow-400 text-black cursor-pointer"><Edit /></Button>
          <Button className="bg-red-700 hover:bg-red-700 text-white cursor-pointer"><X /></Button>
        </div>
      )
    }
  },
]