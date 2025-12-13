// components/TableHelper/buySellListing_columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Check, X, Edit, Eye, MoreHorizontal, Trash2, PackageCheck } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { approveAd, rejectAd, deleteAd, markAdAsSold } from "@/lib/BuyandSellApis/fetchBuyAndSellAction";
import { confirmDelete } from "../ReusableComponents/ConfirmToast";
import { cn } from "@/lib/utils";
import { ClassifiedAdListing } from "@/types/ClassifiedAdsType";
import Link from "next/link";

// Server Actions
const handleApprove = async (id: string) => {
  const res = await approveAd(id);
  toast[res.success ? "success" : "error"]("Status Updated", {
    description: res.success ? "Ad approved successfully!" : res.message,
  });
};

const handleReject = async (id: string) => {
  const res = await rejectAd(id);
  toast[res.success ? "success" : "error"]("Status Updated", {
    description: res.success ? "Ad rejected successfully!" : res.message,
  });
};

const handleMarkAsSold = async (id: string) => {
  const res = await markAdAsSold(id);
  toast[res.success ? "success" : "error"]("Marked as Sold", {
    description: res.success ? "Ad status changed to sold!" : res.message,
  });
};

const handleDelete = async (id: string) => {
  const confirmed = await confirmDelete("Are you sure you want to permanently delete this ad?");
  if (!confirmed) return;

  const res = await deleteAd(id);
  toast[res.success ? "success" : "error"]("Ad Deleted", {
    description: res.success ? "Ad removed permanently!" : res.message,
  });
};

export const buySellListing_columns: ColumnDef<ClassifiedAdListing>[] = [
  // Serial
  {
    id: "serial",
    header: "Serial",
    cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
  },

  // Product Name
  {
    accessorKey: "title",
    header: "Product Name",
    cell: ({ row }) => <span className="font-medium">{row.getValue("title")}</span>,
  },

  // Image
  {
    id: "image",
    header: "Image",
    cell: ({ row }) => {
      const firstImage = row.original.images[0] || null;
      return firstImage ? (
        <div className="relative h-12 w-12 rounded-md overflow-hidden border">
          <Image src={firstImage} alt="Ad" fill className="object-cover" />
        </div>
      ) : (
        <div className="h-12 w-12 bg-gray-200 border rounded-md flex items-center justify-center text-xs text-gray-500">
          No Image
        </div>
      );
    },
  },

  // Category + Subcategory
  {
    id: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category?.name || "N/A";
      const subCategory = row.original.subCategory?.name;
      return (
        <div className="text-sm">
          <div className="font-medium">{category}</div>
          {subCategory && <div className="text-xs text-gray-500">{subCategory}</div>}
        </div>
      );
    },
  },

  // Price
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      const isNegotiable = row.original.isNegotiable;
      return (
        <div className="font-medium">
          ৳{price.toLocaleString()}
          {isNegotiable && <span className="text-xs text-green-600 ml-1">(Negotiable)</span>}
        </div>
      );
    },
  },

  // Status Badge
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as ClassifiedAdListing["status"];
      return (
        <span
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium capitalize",
            status === "pending" && "bg-yellow-100 text-yellow-800",
            status === "active" && "bg-green-100 text-green-800",
            status === "inactive" && "bg-red-100 text-red-800",
            status === "sold" && "bg-gray-100 text-gray-800"
          )}
        >
          {status}
        </span>
      );
    },
  },

  // Posted By
  {
    id: "postedBy",
    header: "Posted By",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center gap-2">
          {user.profilePicture ? (
            <Image src={user.profilePicture} alt={user.name} width={28} height={28} className="rounded-full" />
          ) : (
            <div className="w-7 h-7 bg-gray-300 rounded-full" />
          )}
          <span className="text-sm font-medium">{user.name || "Unknown"}</span>
        </div>
      );
    },
  },

  // Actions — তোমার চাহিদা অনুযায়ী
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const ad = row.original;
      const { status, _id: id } = ad;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">

            {/* Approve — শুধু pending হলে */}
            {status === "pending" && (
              <DropdownMenuItem
                className="flex items-center gap-2 text-green-600 cursor-pointer"
                onClick={() => handleApprove(id)}
              >
                <Check className="h-4 w-4" /> Approve
              </DropdownMenuItem>
            )}

            {/* Reject — pending বা active হলে */}
            {(status === "pending" || status === "active") && (
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-600 cursor-pointer"
                onClick={() => handleReject(id)}
              >
                <X className="h-4 w-4" /> Reject
              </DropdownMenuItem>
            )}

            {/* Mark as Sold — শুধু active হলে */}
            {status === "active" && (
              <DropdownMenuItem
                className="flex items-center gap-2 text-purple-600 cursor-pointer"
                onClick={() => handleMarkAsSold(id)}
              >
                <PackageCheck className="h-4 w-4" /> Mark as Sold
              </DropdownMenuItem>
            )}

            {/* Edit */}
            <DropdownMenuItem className="flex items-center gap-2 text-yellow-600">
              <Link href={`/general/buy/sell/edit/${id}`} className="w-full flex gap-2 items-center">
                <Edit className="h-4 w-4" /> Edit Ad
              </Link>
            </DropdownMenuItem>

            {/* Delete */}
            <DropdownMenuItem
              className="flex items-center gap-2 text-red-600 cursor-pointer"
              onClick={() => handleDelete(id)}
            >
              <Trash2 className="h-4 w-4" /> Delete Permanently
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];