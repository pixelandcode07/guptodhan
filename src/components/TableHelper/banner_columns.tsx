"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

export type Banner = {
  id: number
  banner: string
  sub_title: string
  title: string
  description: string
  button_text: string
  position: string
  status: "Active" | "Inactive"
  created_at: string
}

export const banner_columns: ColumnDef<Banner>[] = [
  {
    accessorKey: "id",
    header: "SL",
  },
  {
    accessorKey: "banner",
    header: "Banner",
    cell: ({ row }) => {
      const banner = row.getValue("banner") as string;
      return (
        <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center">
          {banner ? (
            <img src={banner} alt="Banner" className="w-full h-full object-cover rounded" />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
              No Image
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "sub_title",
    header: "Sub Title",
    cell: ({ row }) => {
      const subTitle = row.getValue("sub_title") as string;
      return (
        <div className="max-w-xs truncate" title={subTitle}>
          {subTitle || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <div className="max-w-xs truncate" title={title}>
          {title || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-xs truncate" title={description}>
          {description || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "button_text",
    header: "Button Text",
    cell: ({ row }) => {
      const buttonText = row.getValue("button_text") as string;
      return (
        <div className="font-medium text-blue-600">
          {buttonText || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "position",
    header: "Position",
    cell: ({ row }) => {
      const position = row.getValue("position") as string;
      return (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {position}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {status}
        </span>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  },
]
