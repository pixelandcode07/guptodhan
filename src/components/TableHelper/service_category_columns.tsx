"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";
import { IServiceCategory } from "@/types/ServiceCategoryType";
import { confirmDelete } from "../ReusableComponents/ConfirmToast";

export const service_category_columns: ColumnDef<IServiceCategory>[] = [
  {
    accessorKey: "serial",
    header: "Serial",
    cell: ({ row }) => {
      const index = row.index + 1;
      return <span className="font-medium">{index}</span>;
    },
  },
  {
    accessorKey: "icon_url",
    header: "Category Icon",
    cell: ({ row }) => {
      const iconUrl = row.getValue("icon_url") as string;
      return iconUrl ? (
        <Image
          src={iconUrl}
          alt="Category Icon"
          width={60}
          height={60}
          className="rounded-lg object-cover border"
        />
      ) : (
        <div className="bg-gray-200 border-2 border-dashed rounded-lg w-14 h-14 flex items-center justify-center">
          <span className="text-xs text-gray-500">No Icon</span>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Category Name",
    cell: ({ row }) => {
      return <span className="font-medium">{row.getValue("name")}</span>;
    },
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => {
      return <code className="text-xs bg-muted px-2 py-1 rounded">{row.getValue("slug")}</code>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const desc = row.getValue("description") as string;

      const words = desc.trim().split(/\s+/);
      const truncated = words.slice(0, 20).join(" ");
      const hasMore = words.length > 20;

      return (
        <div className="max-w-xs"> {/* Prevents overflow in table */}
          <p
            className="text-sm text-gray-600 line-clamp-2"
            title={desc} // Full text on hover
          >
            {truncated}
            {hasMore && <span className="text-gray-500">...</span>}
          </p>
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
    header: "Actions",
    cell: ({ row, table }) => {
      const category = row.original;

      const handleDelete = async (category: IServiceCategory) => {
        const confirmed = await confirmDelete(`Delete "${category.name}" category?`);
        if (!confirmed) return;

        try {
          await toast.promise(
            axios.delete(`/api/v1/service-section/service-category/${category._id}`),
            {
              loading: "Deleting category...",
              success: "Category deleted successfully!",
              error: (err) => err.response?.data?.message || "Failed to delete category",
            }
          );

          // Table data update (optimistic update)
          const setData = table.options.meta?.setData as
            | React.Dispatch<React.SetStateAction<IServiceCategory[]>>
            | undefined;

          if (setData) {
            setData((prev) => prev.filter((item) => item._id !== category._id));
          }
        } catch (error) {
          console.error("Delete error:", error);
        }
      };

      return (
        <div className="flex items-center gap-2">
          <Link href={`/general/edit/service-category/${category._id}`}>
            <Button size="sm" variant="EditBtn" className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            onClick={() => handleDelete(category)}
            size="sm"
            variant="DeleteBtn"
            className="h-8 w-8 p-0"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];