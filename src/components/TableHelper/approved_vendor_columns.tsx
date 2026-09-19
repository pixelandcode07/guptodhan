"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Edit, X, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Vendor } from "@/types/VendorType";
import { toast } from "sonner";
import { deleteVendor, rejectVendor } from "@/lib/MultiVendorApis/vendorActions";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Action Cell Component (to handle states properly inside columns)
const ActionCell = ({ vendor }: { vendor: Vendor }) => {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleReject = async () => {
    toast.promise(rejectVendor(vendor._id), {
      loading: 'Rejecting vendor...',
      success: (data) => data.message,
      error: (data) => data.message,
    });
    setRejectOpen(false);
  };

  const handleDelete = async () => {
    toast.promise(deleteVendor(vendor._id), {
      loading: 'Deleting vendor...',
      success: (data) => data.message,
      error: (data) => data.message,
    });
    setDeleteOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-1">
        {/* Reject Button */}
        <Button size="icon" className="h-8 w-8 bg-red-600 hover:bg-red-700" onClick={() => setRejectOpen(true)}>
          <X className="h-4 w-4" />
        </Button>
        
        {/* Edit Button (Direct Link, no confirm needed) */}
        <Button size="icon" className="h-8 w-8 bg-blue-600 hover:bg-blue-700" asChild title="Edit Vendor">
          <Link href={`/general/edit/vendor/${vendor._id}`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>

        {/* Delete Button */}
        <Button size="icon" className="h-8 w-8 bg-red-700 hover:bg-red-800" onClick={() => setDeleteOpen(true)}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      {/* Reject Confirmation Modal */}
      <AlertDialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will reject the vendor <b>{vendor.user.name}</b>. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="bg-red-600 hover:bg-red-700">Yes, Reject</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the vendor <b>{vendor.user.name}</b> and their account from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-700 hover:bg-red-800">Yes, Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const approved_vendor_columns: ColumnDef<Vendor>[] = [
  {
    id: "serial",
    header: "Serial",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorFn: (row) => row.user.name,
    id: "owner_name",
    header: "Name",
  },
  {
    accessorFn: (row) => row.user.email,
    id: "owner_email",
    header: "Email",
  },
  {
    accessorFn: (row) => row.user.phoneNumber,
    id: "owner_phone",
    header: "Phone",
  },
  {
    accessorKey: "businessName",
    header: "Business Name",
  },
  {
    accessorKey: "tradeLicenseNumber",
    header: "Trade License",
  },
  {
    id: 'verified',
    header: 'Verified',
    cell: ({ row }) => {
      const isActive = row.original.user?.isActive;

      return (
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
            isActive === true && "bg-green-100 text-green-700",
            isActive === false && "bg-red-100 text-red-700",
            isActive === undefined && "bg-gray-100 text-gray-500"
          )}
        >
          {isActive === undefined ? "N/A" : isActive ? "Yes" : "No"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Vendor["status"];
      const display = status.charAt(0).toUpperCase() + status.slice(1);
      return (
        <div
          className={cn(
            "px-2 py-1 rounded-md text-xs font-medium w-max",
            status === "approved" && "bg-green-100 text-green-700",
            status === "pending" && "bg-yellow-100 text-yellow-700",
            status === "rejected" && "bg-red-100 text-red-700"
          )}
        >
          {display}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);
      return date.toLocaleDateString();
    },
  },
  {
    id: 'action',
    header: 'Action',
    cell: ({ row }) => <ActionCell vendor={row.original} />,
  }
];