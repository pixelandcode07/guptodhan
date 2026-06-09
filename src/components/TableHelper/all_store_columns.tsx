"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, X, Eye } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { StoreInterface } from "@/types/StoreInterface";
import { confirmDelete } from "../ReusableComponents/ConfirmToast";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox"; // ✅ Checkbox Import

// =========================================================================
// ✅ 1. Call For Price Toggle Component
// =========================================================================
const CallForPriceToggle = ({ store }: { store: StoreInterface }) => {
  const [isChecked, setIsChecked] = useState(store.callForPricePermission || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsLoading(true);
    setIsChecked(checked); // Optimistic UI Update

    try {
      const formData = new FormData();
      formData.append('callForPricePermission', String(checked));

      const res = await axios.patch(`/api/v1/vendor-store/${store._id}`, formData);

      if (res.data.success) {
        toast.success(`${checked ? 'Granted' : 'Revoked'} Call for Price permission for ${store.storeName}`);
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      setIsChecked(!checked); // Rollback if failed
      toast.error('Failed to update permission');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Switch 
      checked={isChecked} 
      onCheckedChange={handleToggle} 
      disabled={isLoading}
      className={isChecked ? 'bg-blue-600' : 'bg-gray-300'}
    />
  );
};

// =========================================================================
// 🚀 ALL STORE COLUMNS DEFINITION
// =========================================================================
export const all_store_columns: ColumnDef<StoreInterface>[] = [
  // ✅ 4. Checkbox Column added at the beginning
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "serial",
    header: "Serial",
    cell: ({ row }) => {
      const index = row.index + 1;
      return <span className="font-medium text-xs">{index}</span>;
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
          width={40}
          height={40}
          className="rounded-md object-cover border border-gray-100 shadow-sm"
          unoptimized // Added to avoid next/image domain errors
        />
      ) : (
        <div className="bg-gray-100 border-2 border-dashed border-gray-200 rounded-md w-10 h-10 flex items-center justify-center">
          <span className="text-[10px] text-gray-400">No Logo</span>
        </div>
      );
    },
  },
  {
    accessorKey: "storeName",
    header: "Store Name",
    cell: ({ row }) => <span className="font-bold text-gray-800">{row.getValue("storeName")}</span>,
  },
  {
    accessorKey: "storeAddress",
    header: "Address",
    cell: ({ row }) => {
      const address = row.getValue("storeAddress") as string;
      return <span className="text-gray-600 max-w-[150px] truncate block" title={address}>{address}</span>;
    }
  },
  // ✅ 2. Phone Number Column Added
  {
    accessorKey: "storePhone",
    header: "Phone Number",
    cell: ({ row }) => <span className="text-gray-700 font-medium">{row.getValue("storePhone") || "N/A"}</span>,
  },
  {
    accessorKey: "storeEmail",
    header: "Email",
  },
  {
    accessorKey: "commission",
    header: "Commission",
    cell: ({ row }) => {
      const commission = row.getValue("commission") as number;
      return <span className="font-bold text-blue-600">{commission}%</span>;
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
            `px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase w-max tracking-wider`,
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
  // ✅ 1. Call For Price Toggle Column Added
  {
    id: "callForPricePermission",
    header: "Call For Price",
    cell: ({ row }) => <CallForPriceToggle store={row.original} />,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);
      return (
        <span className="text-xs text-gray-500 font-medium">
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
          
          // @ts-ignore
          const setData = table.options.meta?.setData as React.Dispatch<React.SetStateAction<StoreInterface[]>> | undefined;

          if (setData) {
            setData((prev) => prev.filter((item) => item._id !== store._id));
          }
        } catch (error) {
          console.error("Delete error:", error);
        }
      };

      return (
        <div className="flex items-center gap-1.5">
          {/* ✅ 3. Visit Store Eye Icon Added */}
          <Link href={`/home/visit-store/${store._id}`} target="_blank">
            <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200" title="Visit Store">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>

          <Link href={`/general/edit/store/${store._id}`}>
            <Button size="sm" variant="EditBtn" className="h-8 w-8 p-0" title="Edit Store">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          
          <Button onClick={() => handleDelete(store)} size="sm" variant="DeleteBtn" className="h-8 w-8 p-0" title="Delete Store">
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }
  }
];