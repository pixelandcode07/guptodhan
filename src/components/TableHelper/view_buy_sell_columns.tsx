"use client"

import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "../ui/button"
import Image from "next/image"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

// SubCategory type as per your DB structure
export interface SubCategoryType {
  _id: string
  name: string
  icon?: string
  status?: "active" | "inactive"
  category?: string
}


// Main type for ViewBuySellDataType
export type ViewBuySellDataType = {
  _id: string;
  name: string;
  icon: string;
  slug?: string;
  status: "active" | "inactive";
  subCategories?: SubCategoryType[]; // Populated from /api/v1/public/categories-with-subcategories
}

export const view_buy_sell_columns = (handleDelete: (_id: string) => void): ColumnDef<ViewBuySellDataType>[] => [
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
      return (
        <Image src={row.original.icon} alt="Category Icon" width={50} height={50} className="rounded" />
      )
    },
  },
  {
    id: "col_subcategories", // Repurposed to show subcategories (comma-separated names)
    header: "Slug",
    cell: ({ row }) => {
      const subs = row.original.subCategories || [];
      if (subs.length === 0) {
        return <span className="text-gray-500">No subcategories</span>;
      }
      // Filter active subcategories only (optional)
      const activeSubs = subs.filter(sub => sub.status === 'active');
      if (activeSubs.length === 0) {
        return <span className="text-gray-500">No active subcategories</span>;
      }
      // Show comma-separated names (truncate if too long)
      const subNames = activeSubs.map(sub => sub.name).join(', ');
      return (
        <div className="text-sm max-w-[200px] truncate" title={subNames}>
          {subNames.length > 50 ? `${subNames.substring(0, 50)}...` : subNames}
        </div>
      );
    }
  },
  {
    id: "col_status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <div className={cn(`p-1 rounded-md w-max text-xs capitalize`,
          // status === "pending" && "text-yellow-500 bg-yellow-100",
          status === "active" && "text-green-500 bg-green-100",
          status === "inactive" && "text-red-500 bg-red-100",
        )}>
          {status}
        </div>
      )
    }
  },
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
              className="flex items-center gap-1 h-8"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href={`/general/edit/buy/sell/category/${documentId}`}
                className="flex items-center gap-2 w-full"
              >
                <Edit className="h-4 w-4 text-yellow-500" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 text-red-600 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleDelete(documentId);
              }}
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