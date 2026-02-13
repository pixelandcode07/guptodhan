"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Check, X, EyeOff, RotateCcw, PackageCheck, Trash2, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { confirmDelete } from "../ReusableComponents/ConfirmToast";
import { cn } from "@/lib/utils";
import { ClassifiedAdListing } from "@/types/ClassifiedAdsType";

// You need to create/update these server actions
// (same pattern as approveAd, rejectAd, etc.)
import {
  approveAd,
  rejectAd,
  deleteAd,
  markAdAsSold,
  markAdAsPending,     // new
  markAdAsActive,       // new
  markAdAsInactive,     // new
} from "@/lib/BuyandSellApis/fetchBuyAndSellAction";

// ────────────────────────────────────────────────
//  Server Action Handlers (you need to implement these)
// ────────────────────────────────────────────────

const handleApprove = async (id: string) => {
  const res = await approveAd(id);
  toast[res.success ? "success" : "error"]("Status Updated", {
    description: res.success ? "Ad approved (active) successfully!" : res.message,
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
  toast[res.success ? "success" : "error"]("Status Updated", {
    description: res.success ? "Ad marked as sold!" : res.message,
  });
};

const handleMakePending = async (id: string) => {
  const res = await markAdAsPending(id);
  toast[res.success ? "success" : "error"]("Status Updated", {
    description: res.success ? "Ad moved back to pending!" : res.message,
  });
};

const handleMakeActive = async (id: string) => {
  const res = await markAdAsActive(id);
  toast[res.success ? "success" : "error"]("Status Updated", {
    description: res.success ? "Ad activated successfully!" : res.message,
  });
};

const handleMakeInactive = async (id: string) => {
  const res = await markAdAsInactive(id);
  toast[res.success ? "success" : "error"]("Status Updated", {
    description: res.success ? "Ad marked as inactive!" : res.message,
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
            status === "sold" && "bg-gray-100 text-gray-800",
            status === "rejected" && "bg-orange-100 text-orange-800"
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

  // Actions Dropdown
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
          <DropdownMenuContent align="end" className="w-56">

            {/* Make Pending — useful for rejected or inactive ads */}
            {(status === "rejected" || status === "inactive" || status === "active") && (
              <DropdownMenuItem
                className="flex items-center gap-2 text-amber-600 cursor-pointer"
                onClick={() => handleMakePending(id)}
              >
                <RotateCcw className="h-4 w-4" /> Make Pending
              </DropdownMenuItem>
            )}

            {/* Make Active */}
            {(status === "pending" || status === "inactive" || status === "rejected") && (
              <DropdownMenuItem
                className="flex items-center gap-2 text-green-600 cursor-pointer"
                onClick={() => handleMakeActive(id)}
              >
                <Check className="h-4 w-4" /> Mark as Active
              </DropdownMenuItem>
            )}

            {/* Make Inactive */}
            {status === "active" && (
              <DropdownMenuItem
                className="flex items-center gap-2 text-orange-600 cursor-pointer"
                onClick={() => handleMakeInactive(id)}
              >
                <EyeOff className="h-4 w-4" /> Mark as Inactive
              </DropdownMenuItem>
            )}

            {/* Mark as Sold */}
            {status === "active" && (
              <DropdownMenuItem
                className="flex items-center gap-2 text-purple-600 cursor-pointer"
                onClick={() => handleMarkAsSold(id)}
              >
                <PackageCheck className="h-4 w-4" /> Mark as Sold
              </DropdownMenuItem>
            )}

            {/* Reject */}
            {(status === "pending" || status === "active") && (
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-600 cursor-pointer"
                onClick={() => handleReject(id)}
              >
                <X className="h-4 w-4" /> Reject
              </DropdownMenuItem>
            )}

            {/* Delete */}
            <DropdownMenuItem
              className="flex items-center gap-2 text-red-700 font-medium cursor-pointer mt-1 border-t pt-1"
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