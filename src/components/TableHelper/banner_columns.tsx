"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Image from "next/image" // ✅ Import Next.js Image component for performance

// ✅ Use a more standard type that includes the database _id
export type Banner = {
  _id: string
  bannerImage: string
  subTitle: string
  bannerTitle: string
  bannerDescription: string
  buttonText: string
  bannerPosition: string
  status: "active" | "inactive"
}

// ✅ Turn the columns into a function that accepts handlers
export const getBannerColumns = (
    handleEdit: (id: string) => void,
    handleDelete: (id: string) => void
): ColumnDef<Banner>[] => [
  {
    accessorKey: "bannerImage",
    header: "Banner",
    cell: ({ row }) => {
      const imageUrl = row.getValue("bannerImage") as string;
      return (
        <div className="w-20 h-12 bg-gray-100 rounded flex items-center justify-center relative">
          {imageUrl ? (
            // ✅ Use next/image for optimization
            <Image 
              src={imageUrl} 
              alt="Banner" 
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          ) : (
            <div className="text-xs text-gray-500">No Image</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "bannerTitle",
    header: "Title",
    cell: ({ row }) => <div className="max-w-xs truncate">{row.getValue("bannerTitle")}</div>,
  },
  {
    accessorKey: "subTitle",
    header: "Sub Title",
     cell: ({ row }) => <div className="max-w-xs truncate">{row.getValue("subTitle") || "-"}</div>,
  },
  {
    accessorKey: "bannerPosition",
    header: "Position",
    cell: ({ row }) => (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
        { (row.getValue("bannerPosition") as string).replace('-', ' ') }
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
          status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const banner = row.original;
      return (
        <div className="flex items-center gap-2">
          {/* ✅ Connect the Edit button to the handleEdit function */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
            onClick={() => handleEdit(banner._id)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          {/* ✅ Connect the Delete button to the handleDelete function */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleDelete(banner._id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  },
]