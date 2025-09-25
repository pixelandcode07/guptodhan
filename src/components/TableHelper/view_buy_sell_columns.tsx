"use client"

import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash } from "lucide-react"
import { Button } from "../ui/button"
import Image from "next/image"
import Link from "next/link"


export type BuySellDataType = {
  _id: string;
  name: string;
  icon: string;
  slug: string;
  status: "pending" | "active" | "inactive";
}

export const view_buy_sell_columns: ColumnDef<BuySellDataType>[] = [
  {
    id: "serial",
    header: "Serial",
    cell: ({ row }) => {
      return <span className="text-center">{row.index + 1}</span>
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "icon",
    header: "Icon",
    cell: ({ row }) => {
      // const logoUrl = row.getValue("icon") as string
      return (
        <Image src={row.original.icon} alt="Store Logo" width={50} height={50} />
      )
    },
  },
  {
    accessorKey: "name",
    header: "Slug",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      // const status = row.getValue("status")
      const status = row.original.status
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
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const documentId = row.original._id;
      return (
        <div className="flex gap-2">
          <Link href={`/general/edit/buy/sell/category/${documentId}`}>
            <Button className="bg-yellow-400 text-black"><Edit /></Button>
          </Link>
          <Button
            className="bg-red-700 text-white"
          // onClick={() => handleDelete(documentId)}
          >
            <Trash />
          </Button>
        </div>
      );
    },
  },
]