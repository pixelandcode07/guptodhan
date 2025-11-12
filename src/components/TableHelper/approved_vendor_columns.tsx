// "use client"

// import { cn } from "@/lib/utils"
// import { ColumnDef } from "@tanstack/react-table"
// import { Check, Edit, Trash } from "lucide-react"
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

// export const approved_vendor_columns: ColumnDef<Payment>[] = [
//   {
//     accessorKey: "serial",
//     header: "Serial",
//   },
//   {
//     accessorKey: "owner_name",
//     header: "Name",
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
//     header: "Store",
//   },
//   {
//     accessorKey: "verified",
//     header: "Verified",
//     cell: ({ row }) => {
//       const verified = row.getValue("verified")

//       return (
//         <div className={cn(`p-1 rounded-md w-max text-xs`,
//           verified === "Yes" && "text-green-500",
//           verified === "No" && "text-red-500",
//         )}>{verified as string}</div>
//       )
//     }
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => {
//       const status = row.getValue("status")

//       return (
//         <div className={cn(`p-1 rounded-md w-max text-xs`,
//           status === "pending" && "text-yellow-400",
//           status === "approved" && "text-green-500",
//           status === "rejected" && "text-red-500",
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
//           {/* <Button className="bg-green-800 hover:bg-green-800 text-black cursor-pointer"><Check className="text-white" /></Button> */}
//           <Button className="bg-yellow-400 hover:bg-yellow-400 text-black cursor-pointer"><Edit /></Button>
//           {/* <Button className="bg-red-700 hover:bg-red-700 text-white cursor-pointer"><Trash /></Button> */}
//         </div>
//       )
//     }
//   },
// ]


// src/components/TableHelper/approved_vendor_columns.ts
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Edit, Check, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

export type Payment = {
  serial: string;
  vendor_id: number | string;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  Business_name: string;
  trade_license_number: number | string;
  store: string;
  status: "pending" | "active" | "inactive";
  created_at: string;
  verified?: string; // optional
};

export const approved_vendor_columns: ColumnDef<Payment>[] = [
  { accessorKey: "serial", header: "Serial" },
  { accessorKey: "owner_name", header: "Name" },
  { accessorKey: "owner_email", header: "Email" },
  { accessorKey: "owner_phone", header: "Phone" },
  { accessorKey: "Business_name", header: "Business Name" },
  { accessorKey: "trade_license_number", header: "Trade License" },
  { accessorKey: "store", header: "Store" },
  {
    accessorKey: "verified",
    header: "Verified",
    cell: ({ row }) => {
      const verified = row.getValue("verified") as string;
      return (
        <div
          className={cn(
            "px-2 py-1 rounded-md text-xs font-medium w-max",
            verified === "Yes" && "bg-green-100 text-green-700",
            verified === "No" && "bg-red-100 text-red-700"
          )}
        >
          {verified || "N/A"}
        </div>
      );
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
            "px-2 py-1 rounded-md text-xs font-medium w-max",
            status === "active" && "bg-green-100 text-green-700",
            status === "pending" && "bg-yellow-100 text-yellow-700",
            status === "inactive" && "bg-red-100 text-red-700"
          )}
        >
          {status}
        </div>
      );
    },
  },
  { accessorKey: "created_at", header: "Created At" },
  {
    accessorKey: "action",
    header: "Action",
    cell: () => (
      <div className="flex items-center gap-1">
        <Button size="icon" variant="ghost" className="h-8 w-8">
          <Edit className="h-4 w-4" />
        </Button>
        {/* <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600">
          <Check className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600">
          <Trash className="h-4 w-4" />
        </Button> */}
      </div>
    ),
  },
];