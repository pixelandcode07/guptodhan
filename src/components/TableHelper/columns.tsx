"use client"

import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { Edit, Trash } from "lucide-react"


export type Payment = {
  serial: string,
  category_id: number,
  category_name: string,
  slug: string,
  status: "active" | "inactive",
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "serial",
    header: "Serial",
  },
  {
    accessorKey: "category_name",
    header: "Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")

      return (
        <div className={cn(`p-1 rounded-md w-max text-xs`,
          status === "active" && "text-green-500",
          status === "inactive" && "text-red-500",
        )}>{status as string}</div>
      )
    }
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: () => {
      // const action = row.getValue("action")
      return (
        <div className="flex items-center gap-2">
          <Button className="bg-yellow-700 hover:bg-yellow-700 text-black cursor-pointer"><Edit /></Button>
          <Button className="bg-red-700 hover:bg-red-700 text-white cursor-pointer"><Trash /></Button>
        </div>
      )
    }
  },
]