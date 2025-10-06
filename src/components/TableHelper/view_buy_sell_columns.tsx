"use client"

import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "../ui/button"
import Image from "next/image"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"


export type BuySellDataType = {
  _id: string;
  name: string;
  icon: string;
  slug: string;
  status: "active" | "inactive";
}

export const view_buy_sell_columns = (handleDelete: (_id: string) => void): ColumnDef<BuySellDataType>[] => [
  {
    id: "serial",
    header: "Serial",
    cell: ({ row }) => {
      return <span className="text-center">{row.index + 1}</span>
    },
  },
  {
    id: "col_name",
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "col_icon",
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
    id: "col_slug",
    accessorKey: "slug",
    header: "Slug",
  },
  {
    id: "col_status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      // const status = row.getValue("status")
      const status = row.original.status
      // status: "pending" | "active" | "inactive",
      return (
        <div className={cn(`p-1 rounded-md w-max text-xs`,
          // status === "pending" && "text-yellow-400",
          status === "active" && "text-green-500",
          status === "inactive" && "text-red-500",
        )}>{status as string}</div>
      )
    }
  },
  // {
  //   id: "col_action",
  //   header: "Action",
  //   cell: ({ row }) => {
  //     const documentId = row.original._id;
  //     return (
  //       <div className="flex gap-2">
  //         <Link href={`/general/edit/buy/sell/category/${documentId}`}>
  //           <Button variant={'EditBtn'} size={'sm'}><Edit /></Button>
  //         </Link>
  //         <Button
  //           variant={'DeleteBtn'} size={'sm'}
  //           onClick={() => handleDelete(documentId)}
  //         >
  //           <Trash />
  //         </Button>
  //       </div>
  //     );
  //   },
  // },
  {
    id: "col_action",
    header: "Actions",
    cell: ({ row }) => {
      const documentId = row.original._id;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <MoreHorizontal className="h-4 w-4" />
              {/* Actions */}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
            >
              <Link href={`/general/edit/buy/sell/category/${documentId}`} className="flex items-center gap-2 cursor-pointer">
                <Edit className="h-4 w-4 text-yellow-500" />
                Edit
              </Link>

            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer text-red-600"
              onClick={() => handleDelete(documentId)}
            >
              <Trash className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]