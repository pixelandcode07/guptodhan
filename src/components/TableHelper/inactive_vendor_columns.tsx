"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Edit, Check, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Vendor } from "@/types/VendorType";
import { toast } from "sonner";
import { approveVendor, deleteVendor } from "@/lib/MultiVendorApis/vendorActions";
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
  const [approveOpen, setApproveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleApprove = async () => {
    toast.promise(approveVendor(vendor._id), {
      loading: 'Approving vendor...',
      success: (data) => data.message,
      error: (data) => data.message,
    });
    setApproveOpen(false);
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
        {/* Approve Button */}
        <Button size="icon" className="h-8 w-8 bg-green-600 hover:bg-green-700" onClick={() => setApproveOpen(true)}>
          <Check className="h-4 w-4" />
        </Button>
        
        {/* Edit Button (Direct Link) */}
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

      {/* Approve Confirmation Modal */}
      <AlertDialog open={approveOpen} onOpenChange={setApproveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will approve and activate the vendor <b>{vendor.user.name}</b>. Do you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} className="bg-green-600 hover:bg-green-700">Yes, Approve</AlertDialogAction>
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

export const inactive_vendor_columns: ColumnDef<Vendor>[] = [
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
    id: "verified",
    header: "Verified",
    cell: ({ row }) => {
      const verified = row.original.user.isActive ? "Yes" : "No";
      return (
        <div
          className={cn(
            "px-2 py-1 rounded-md text-xs font-medium w-max",
            verified === "Yes" && "bg-green-100 text-green-700",
            verified === "No" && "bg-red-100 text-red-700"
          )}
        >
          {verified}
        </div>
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