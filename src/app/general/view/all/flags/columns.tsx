"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react"

// This type is used to define the shape of our data.
export type Flag = {
  id: number
  icon: string
  name: string
  status: "Active" | "Inactive"
  featured: "Featured" | "Not Featured"
  createdAt: string
}

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: any;
  title: string;
}

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={className}>{title}</div>;
  }

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-auto p-0 font-semibold text-gray-700 hover:bg-gray-100"
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

export const createColumns = (handleEdit: (id: number) => void, handleDelete: (id: number) => void, handleToggleFeatured: (id: number) => void): ColumnDef<Flag>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SL" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "icon",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Icon" />
    ),
    cell: ({ row }) => {
      const icon = row.getValue("icon") as string;
      return (
        <div className="flex items-center space-x-2">
          {icon ? (
            <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-600 text-xs">
              {icon}
            </div>
          ) : (
            <div className="w-16 h-12 bg-gray-50 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          status === "Active" 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "featured",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Featured" />
    ),
    cell: ({ row }) => {
      const featured = row.getValue("featured") as string;
      return (
        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          featured === "Featured" 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {featured}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => <div className="text-gray-600">{row.getValue("createdAt")}</div>,
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const flag = row.original;
      
      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(flag.id)}
            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(flag.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleFeatured(flag.id)}
            className={`w-6 h-6 p-0 ${
              flag.featured === "Featured" 
                ? "text-green-600 hover:text-green-700 hover:bg-green-50" 
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
            title={flag.featured === "Featured" ? "Remove from Featured" : "Add to Featured"}
          >
            <ArrowUp className="w-3 h-3" />
          </Button>
        </div>
      );
    },
  },
];
