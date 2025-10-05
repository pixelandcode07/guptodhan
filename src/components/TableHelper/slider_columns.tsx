"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"

// Avoid exporting types to prevent deploy issues per request

export const slider_columns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "SL",
  },
  {
    accessorKey: "slider",
    header: "Slider",
    cell: ({ row }) => {
      const slider = row.getValue("slider") as string;
      return (
        <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center">
          {slider ? (
            <img src={slider} alt="Slider" className="w-full h-full object-cover rounded" />
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
    accessorKey: "slider_link",
    header: "Slider Link",
    cell: ({ row }) => {
      const sliderLink = row.getValue("slider_link") as string;
      return (
        <div className="max-w-xs truncate text-blue-600" title={sliderLink}>
          {sliderLink || "-"}
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
    accessorKey: "button_link",
    header: "Button Link",
    cell: ({ row }) => {
      const buttonLink = row.getValue("button_link") as string;
      return (
        <div className="max-w-xs truncate text-blue-600" title={buttonLink}>
          {buttonLink || "-"}
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
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          status === "Active" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
        }`}>
          {status}
        </span>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const onDelete = async () => {
        const item = row.original as any;
        if (!item?._id) return;
        toast.warning('Delete this slider?', {
          description: 'This action cannot be undone.',
          action: {
            label: 'Delete',
            onClick: async () => {
              await toast.promise(
                (async () => {
                  const res = await fetch(`/api/v1/slider-form/${item._id}`, { method: 'DELETE' });
                  if (!res.ok) {
                    const j = await res.json().catch(() => ({}));
                    throw new Error(j?.message || 'Failed to delete');
                  }
                })(),
                {
                  loading: 'Deleting...',
                  success: 'Slider deleted',
                  error: (e) => e?.message || 'Delete failed',
                }
              );
              window.location.reload();
            },
          },
        });
      };
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50">
            <Edit className="w-4 h-4" />
          </Button>
          <Button onClick={onDelete} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  },
]
