"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Edit, Eye, X, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export type BuySellListingType = {
  id: string;
  serial: string;
  product_name: string;
  product_image: string;
  category: string;
  actual_price: number;
  discount_price: number;
  status: "pending" | "approved" | "rejected";
  postedBy: string;
};

// Placeholder action handlers
const handleApprove = (id: string) => {
  console.log("Approve clicked for ID:", id);
};
const handleView = (id: string) => {
  console.log("View clicked for ID:", id);
};
const handleEdit = (id: string) => {
  console.log("Edit clicked for ID:", id);
};
const handleReject = (id: string) => {
  console.log("Reject clicked for ID:", id);
};

export const buySellListing_columns: ColumnDef<BuySellListingType>[] = [
  {
    accessorKey: "serial",
    header: "Serial",
  },
  {
    accessorKey: "product_name",
    header: "Product Name",
  },
  {
    accessorKey: "product_image",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.getValue("product_image") as string;
      return (
        <div className="h-12 w-12 relative">
          <Image
            src={imageUrl}
            alt="Product Image"
            fill
            className="object-cover rounded-md"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "actual_price",
    header: "Actual Price",
    cell: ({ row }) => {
      const price = row.getValue("actual_price") as number;
      return <span>${price.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "discount_price",
    header: "Discount Price",
    cell: ({ row }) => {
      const price = row.getValue("discount_price") as number;
      return <span className="text-green-600">${price.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div
          className={cn(
            "px-2 py-1 rounded-md w-max text-xs capitalize",
            status === "pending" && "text-yellow-500 bg-yellow-100",
            status === "approved" && "text-green-600 bg-green-100",
            status === "rejected" && "text-white bg-red-500"
          )}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "postedBy",
    header: "Posted By",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const id = row.original.id; // ✅ get ID from row
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
              onClick={() => handleApprove(id)}
            >
              <Check className="h-4 w-4 text-green-600" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleView(id)}
            >
              <Eye className="h-4 w-4 text-blue-600" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleEdit(id)}
            >
              <Edit className="h-4 w-4 text-yellow-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer text-red-600"
              onClick={() => handleReject(id)}
            >
              <X className="h-4 w-4" />
              Reject
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
