// "use client"

// import { cn } from "@/lib/utils"
// import { ColumnDef } from "@tanstack/react-table"
// import { Check, Edit } from "lucide-react"
// import { Button } from "../ui/button"


// export type Payment = {
//   serial: string,
//   vendor_id: number,
//   owner_name: string,
//   owner_email: string,
//   owner_phone: string,
//   Business_name: string,
//   trade_license_number: number,
//   store: string,
//   status: "pending" | "active" | "inactive",
//   created_at: string,
// }

// export const inactive_vendor_columns: ColumnDef<Payment>[] = [
//   {
//     accessorKey: "serial",
//     header: "Serial",
//   },
//   {
//     accessorKey: "owner_name",
//     header: "Full Name",
//   },
//   {
//     accessorKey: "owner_email",
//     header: "Email",
//   },
//   {
//     accessorKey: "owner_phone",
//     header: "Phone",
//   },
//   {
//     accessorKey: "Business_name",
//     header: "Business Name",
//   },
//   {
//     accessorKey: "trade_license_number",
//     header: "Trade License Number",
//   },
//   {
//     accessorKey: "store",
//     header: "Store Name",
//   },
//   // {
//   //   accessorKey: "verified",
//   //   header: "Verified",
//   //   cell: ({ row }) => {
//   //     const verified = row.getValue("verified")

//   //     return (
//   //       <div className={cn(`p-1 rounded-md w-max text-xs`,
//   //         verified === "Yes" && "text-green-500",
//   //         verified === "No" && "text-red-500",
//   //       )}>{verified as string}</div>
//   //     )
//   //   }
//   // },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => {
//       const status = row.getValue("status")
//       // status: "pending" | "active" | "inactive",
//       return (
//         <div className={cn(`p-1 rounded-md w-max text-xs`,
//           status === "pending" && "text-yellow-400",
//           status === "active" && "text-green-500",
//           status === "inactive" && "text-white bg-red-500",
//         )}>{status as string}</div>
//       )
//     }
//   },
//   {
//     accessorKey: "created_at",
//     header: "Created At",
//   },
//   {
//     accessorKey: "action",
//     header: "Action",
//     cell: () => {
//       return (
//         <div className="flex items-center gap-2">
//           <Button className="bg-green-800 hover:bg-green-800 text-black cursor-pointer"><Check className="text-white" /></Button>
//           <Button className="bg-yellow-400 hover:bg-yellow-400 text-black cursor-pointer"><Edit /></Button>
//           {/* <Button className="bg-red-700 hover:bg-red-700 text-white cursor-pointer"><Trash /></Button> */}
//         </div>
//       )
//     }
//   },
// ]


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

export const inactive_vendor_columns: ColumnDef<Vendor>[] = [
  // Serial – you can compute it client-side or pass it from the server
  {
    id: "serial",
    header: "Serial",
    cell: ({ row }) => row.index + 1,
  },

  // Owner Name (from user)
  {
    accessorFn: (row) => row.user.name,
    id: "owner_name",
    header: "Name",
  },

  // Owner Email (from user)
  {
    accessorFn: (row) => row.user.email,
    id: "owner_email",
    header: "Email",
  },

  // Owner Phone (from user)
  {
    accessorFn: (row) => row.user.phoneNumber,
    id: "owner_phone",
    header: "Phone",
  },

  // Business Name
  {
    accessorKey: "businessName",
    header: "Business Name",
  },

  // Trade License
  {
    accessorKey: "tradeLicenseNumber",
    header: "Trade License",
  },

  // Verified badge – you can decide the logic (here we treat `isActive` as verified)
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

  // Status badge – only "active" will be shown because we filter the data
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Vendor["status"];
      // Capitalize first letter for nicer display
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

  // Created At (format if you want)
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

      // const handleReject = async () => {
      //   toast.promise(rejectVendor(vendor._id), {
      //     loading: 'Rejecting vendor...',
      //     success: (data) => data.message,
      //     error: (data) => data.message,
      //   });
      // };

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