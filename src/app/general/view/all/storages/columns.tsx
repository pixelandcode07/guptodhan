"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Edit, Trash2 } from "lucide-react"


export type Storage = {
  id: number
  ram: string
  rom: string
  status: "Active" | "Inactive"
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

export const createColumns = (handleEdit: (id: number) => void): ColumnDef<Storage>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SL" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "ram",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="RAM" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("ram")}</div>,
  },
  {
    accessorKey: "rom",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ROM" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("rom")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "Active" ? "default" : "secondary"} className="bg-green-100 text-green-800">
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const storage = row.original;
      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(storage.id)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
