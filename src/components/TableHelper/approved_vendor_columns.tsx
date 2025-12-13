"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Edit, Check, Trash, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Vendor } from "@/types/VendorType";
import { toast } from "sonner";
import { approveVendor, deleteVendor, rejectVendor } from "@/lib/MultiVendorApis/vendorActions";
import { confirmDelete } from "../ReusableComponents/ConfirmToast";
import Link from "next/link";

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

  // Trade License
  {
    accessorKey: "tradeLicenseNumber",
    header: "Trade License",
  },

  // {
  //   id: "verified",
  //   header: "Verified",
  //   cell: ({ row }) => {
  //     const verified = row.original.user.isActive ? "Yes" : "No";
  //     return (
  //       <div
  //         className={cn(
  //           "px-2 py-1 rounded-md text-xs font-medium w-max",
  //           verified === "Yes" && "bg-green-100 text-green-700",
  //           verified === "No" && "bg-red-100 text-red-700"
  //         )}
  //       >
  //         {verified}
  //       </div>
  //     );
  //   },
  // },
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
    cell: ({ row }) => {
      const vendor = row.original;

      // const handleApprove = async () => {
      //   toast.promise(approveVendor(vendor._id), {
      //     loading: 'Approving vendor...',
      //     success: (data) => data.message,
      //     error: (data) => data.message,
      //   });
      // };

      const handleReject = async () => {
        toast.promise(rejectVendor(vendor._id), {
          loading: 'Rejecting vendor...',
          success: (data) => data.message,
          error: (data) => data.message,
        });
      };

      const handleDelete = async () => {
        const confirmed = await confirmDelete(
          'Are you sure you want to delete this vendor and their account permanently?'
        );

        if (!confirmed) {
          toast.success('Deletion cancelled');
          return;
        }

        toast.promise(deleteVendor(vendor._id), {
          loading: 'Deleting vendor...',
          success: (data) => data.message,
          error: (data) => data.message,
        });
      };

      return (
        <div className="flex items-center gap-1">
          {/* {vendor.status === 'pending' && (
            <>
              <Button size="icon" className="h-8 w-8 bg-green-600" onClick={handleApprove}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" className="h-8 w-8 bg-red-600" onClick={handleReject}>
                <X className="h-4 w-4" />
              </Button>
            </>
          )} */}
          <Button size="icon" className="h-8 w-8 bg-red-600" onClick={handleReject}>
            <X className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="h-8 w-8 bg-blue-600 hover:bg-blue-700"
            asChild
            title="Edit Vendor"
          >
            <Link href={`/general/edit/vendor/${vendor._id}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="icon" className="h-8 w-8 bg-red-700" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  }
];