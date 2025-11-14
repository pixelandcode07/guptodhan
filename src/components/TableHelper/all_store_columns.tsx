// "use client"

// import { cn } from "@/lib/utils"
// import { ColumnDef } from "@tanstack/react-table"
// import { Edit, X } from "lucide-react"
// import { Button } from "../ui/button"
// import Image from "next/image"


// export type StoresDataType = {
//   serial: string,
//   store_logo: string,
//   store_name: string,
//   business_name: string,
//   total_product: number,
//   total_earnings: number,
//   current_balance: number,
//   commission: number,
//   status: "pending" | "active" | "inactive",
//   created_at: string,
// }

// export const all_store_columns: ColumnDef<StoresDataType>[] = [
//   {
//     accessorKey: "serial",
//     header: "Serial",
//   },
//   {
//     accessorKey: "store_logo",
//     header: "Store Logo",
//     cell: ({ row }) => {
//       const logoUrl = row.getValue("store_logo") as string
//       return (
//         <Image src={logoUrl} alt="Store Logo" width={50} height={50} />
//       )
//     },
//   },
//   {
//     accessorKey: "store_name",
//     header: "Store Name",
//   },
//   {
//     accessorKey: "business_name",
//     header: "Business Name",
//   },
//   {
//     accessorKey: "total_product",
//     header: "Total Product",
//   },
//   {
//     accessorKey: "total_earnings",
//     header: "Total Earnings",
//   },
//   {
//     accessorKey: "current_balance",
//     header: "Current Balance",
//   },
//   {
//     accessorKey: "commission",
//     header: "Commission",
//   },
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
//           {/* <Button className="bg-green-800 hover:bg-green-800 text-black cursor-pointer"><Check className="text-white" /></Button> */}
//           <Button className="bg-yellow-400 hover:bg-yellow-400 text-black cursor-pointer"><Edit /></Button>
//           <Button className="bg-red-700 hover:bg-red-700 text-white cursor-pointer"><X /></Button>
//         </div>
//       )
//     }
//   },
// ]

// components/TableHelper/all_store_columns.ts

"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, X } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { StoreInterface } from "@/types/StoreInterface";
import { confirmDelete } from "../ReusableComponents/ConfirmToast";
import { toast } from "sonner";
import axios from "axios";

// export type StoresDataType = {
//   id: string;
//   storeId: string;
//   store_logo: string;
//   store_name: string;
//   store_address: string;
//   store_email: string;
//   status: "active" | "pending" | "inactive";
//   created_at: string;
//   commission: number;
// };

export const all_store_columns: ColumnDef<StoreInterface>[] = [
  {
    accessorKey: "serial",
    header: "Serial",
    cell: ({ row }) => {
      const index = row.index + 1;
      return <span className="font-medium">{index}</span>;
    },
  },
  {
    accessorKey: "storeLogo",
    header: "Store Logo",
    cell: ({ row }) => {
      const logoUrl = row.getValue("storeLogo") as string;
      return logoUrl ? (
        <Image
          src={logoUrl}
          alt="Store Logo"
          width={50}
          height={50}
          className="rounded-md object-cover"
        />
      ) : (
        <div className="bg-gray-200 border-2 border-dashed rounded-md w-12 h-12 flex items-center justify-center">
          <span className="text-xs text-gray-500">No Logo</span>
        </div>
      );
    },
  },
  {
    accessorKey: "storeName",
    header: "Store Name",
  },
  {
    accessorKey: "storeAddress",
    header: "Address",
  },
  {
    accessorKey: "storeEmail",
    header: "Email",
  },
  {
    accessorKey: "commission",
    header: "Commission (%)",
    cell: ({ row }) => {
      const commission = row.getValue("commission") as number;
      return <span className="font-medium">{commission}%</span>;
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
            `px-2 py-1 rounded-full text-xs font-medium w-max`,
            status === "active" && "bg-green-100 text-green-700",
            status === "pending" && "bg-yellow-100 text-yellow-700",
            status === "inactive" && "bg-red-100 text-red-700"
          )}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);
      return (
        <span className="text-sm text-gray-600">
          {date.toLocaleDateString("en-GB")}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row, table }) => {
      const store = row.original;
      console.log('Store ID:', store._id);

      const handleDelete = async (store: StoreInterface) => {
        const confirmed = await confirmDelete(`Delete "${store.storeName}"?`);
        if (!confirmed) return;

        try {
          await toast.promise(
            axios.delete(`/api/v1/vendor-store/${store._id}`),
            {
              loading: "Deleting...",
              success: "Store deleted successfully!",
              error: (err) => err.response?.data?.message || "Failed to delete store",
            }
          );
          const setData = table.options.meta?.setData as
            | React.Dispatch<React.SetStateAction<StoreInterface[]>>
            | undefined;

          if (setData) {
            setData((prev) => prev.filter((item) => item._id !== store._id));
          }
        } catch (error) {
          console.error("Delete error:", error);
        }
      };



      return (
        <div className="flex items-center gap-1">
          <Link href={`/general/edit/store/${store._id}`}>
            <Button size="sm" variant="EditBtn" className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button onClick={() => handleDelete(store)} size="sm" variant="DeleteBtn" className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }
  }
];