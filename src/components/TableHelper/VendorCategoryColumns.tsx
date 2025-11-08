"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { VendorCategory } from "@/types/VendorCategoryType";
import { deleteVendorCategory } from "@/lib/MultiVendorApis/deleteVendorCategory";
import { toast } from "sonner";
import Link from "next/link";

export const VendorCategoryColumns: ColumnDef<VendorCategory>[] = [
  {
    id: "serial",
    header: "Serial",
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "slug", header: "Slug" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium w-max",
            status === "active" && "bg-green-100 text-green-700",
            status === "inactive" && "bg-red-100 text-red-700"
          )}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div className="text-sm text-gray-600">{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row, table }) => {
      const category = row.original;
      console.log("Category ID for Edit:", category._id);

      const handleDelete = async () => {
        const confirmed = confirm(`Delete "${category.name}"?`);
        if (!confirmed) return;

        try {
          await toast.promise(
            deleteVendorCategory(category._id),
            {
              loading: "Deleting...",
              success: "Deleted successfully!",
              error: (err) => err.message || "Failed to delete",
            }
          );

          // Optimistic UI update
          const setData = table.options.meta?.setData as
            | React.Dispatch<React.SetStateAction<VendorCategory[]>>
            | undefined;
          if (setData) {
            setData((prev) => prev.filter((item) => item._id !== category._id));
          }
        } catch (error) {
          // toast already shows error
        }
      };

      return (
        <div className="flex items-center justify-center gap-2">
          {/* Edit Button */}
          <Link href={`/general/edit/vendor/category/${category._id}`}>
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 border-yellow-500 text-yellow-600 hover:bg-yellow-50"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </Link>

          {/* Delete Button */}
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 border-red-500 text-red-600 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];