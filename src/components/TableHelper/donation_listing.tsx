"use client"

import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash } from "lucide-react"
import { Button } from "../ui/button"
import Image from "next/image"


export type DonationListingDataType = {
  serial: string,
  category_name: string,
  store_logo: string,
  slug: string,
  total_item: number,
  donated_by: string
  status: "pending" | "active" | "inactive",
}

export const donation_listing: ColumnDef<DonationListingDataType>[] = [
  {
    accessorKey: "serial",
    header: "Serial",
  },
  {
    accessorKey: "category_name",
    header: "Category",
  },
  {
    accessorKey: "store_logo",
    header: "Image",
    cell: ({ row }) => {
      const logoUrl = row.getValue("store_logo") as string
      return (
        <Image src={logoUrl} alt="Store Logo" width={50} height={50} />
      )
    },
  },
  {
    accessorKey: "slug",
    header: "Title",
  },
  {
    accessorKey: "total_item",
    header: "Total items",
  },
  {
    accessorKey: "donated_by",
    header: "Donated by",
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
          {/* <Button className="bg-green-800 hover:bg-green-800 text-black cursor-pointer"><Check className="text-white" /></Button> */}
          {/* <Button className="bg-yellow-400 hover:bg-yellow-400 text-black cursor-pointer"><Edit /></Button> */}
          <Button className="bg-red-700 hover:bg-red-700 text-white cursor-pointer"><Trash /></Button>
        </div>
      )
    }
  },
]