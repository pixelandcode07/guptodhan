"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Edit, Trash2 } from "lucide-react"

// This type is used to define the shape of our data.
export type Brand = {
  id: number
  name: string
  logo: string
  banner: string
  categories: string[]
  subcategories: string[]
  childcategories: string[]
  slug: string
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

export const createColumns = (handleEdit: (id: number) => void, handleDelete: (id: number) => void): ColumnDef<Brand>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SL" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "logo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Logo" />
    ),
    cell: ({ row }) => {
      const logo = row.getValue("logo") as string;
      return (
        <div className="flex items-center space-x-2">
          <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs font-semibold">
            {logo}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "banner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Banner" />
    ),
    cell: ({ row }) => {
      const banner = row.getValue("banner") as string;
      return (
        <div className="flex items-center space-x-2">
          <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs font-semibold">
            {banner}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "categories",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categories" />
    ),
    cell: ({ row }) => {
      const categories = row.getValue("categories") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {categories.map((category, index) => (
            <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {category}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "subcategories",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subcategories" />
    ),
    cell: ({ row }) => {
      const subcategories = row.getValue("subcategories") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {subcategories.map((subcategory, index) => (
            <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {subcategory}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "childcategories",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Childcategories" />
    ),
    cell: ({ row }) => {
      const childcategories = row.getValue("childcategories") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {childcategories.map((childcategory, index) => (
            <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {childcategory}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "slug",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Slug" />
    ),
    cell: ({ row }) => <div className="font-mono text-sm text-gray-600">{row.getValue("slug")}</div>,
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
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const brand = row.original;
      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(brand.id)}
            className="text-blue-600 hover:text-yellow-700 hover:bg-yellow-50"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(brand.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
