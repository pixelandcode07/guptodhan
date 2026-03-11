"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"

export type Product = {
  id: number
  _id?: string  // MongoDB product ID for navigation
  image: string
  category: string
  slug?: string;
  name: string
  store: string
  price: string
  offer_price: string
  stock: string
  flag: string
  status: "Active" | "Inactive"
  created_at: string
}

export type ProductColumnHandlers = {
  onView?: (product: Product) => void
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  onToggleStatus?: (product: Product) => void
}

export const getProductColumns = ({ onView, onEdit, onDelete, onToggleStatus }: ProductColumnHandlers): ColumnDef<Product>[] => [
  {
    accessorKey: "id",
    header: "SL",
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.getValue("image") as string;
      const product = row.original as Product;
      return (
        <button
          onClick={() => onView?.(product)}
          className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
          title="Click to view product details"
        >
          {image ? (
            <img src={image} alt="Product" className="w-full h-full object-cover rounded" />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
              No Image
            </div>
          )}
        </button>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const product = row.original as Product;
      return (
        <button
          onClick={() => onView?.(product)}
          className="max-w-xs truncate text-left hover:text-blue-600 hover:underline transition-colors cursor-pointer"
          title={`Click to view details: ${name}`}
        >
          {name}
        </button>
      );
    },
  },
  {
    accessorKey: "store",
    header: "Store",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as string;
      return (
        <div className="font-mono text-sm">
          {price}
        </div>
      );
    },
  },
  {
    accessorKey: "offer_price",
    header: "Offer Price",
    cell: ({ row }) => {
      const offerPrice = row.getValue("offer_price") as string;
      return (
        <div className="font-mono text-sm">
          {offerPrice}
        </div>
      );
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue("stock") as string;
      return (
        <div className="font-mono text-sm">
          {stock}
        </div>
      );
    },
  },
  {
    accessorKey: "flag",
    header: "Flag",
    cell: ({ row }) => {
      const flag = row.getValue("flag") as string;
      return (
        <div className="text-gray-500">
          {flag || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const product = row.original as Product;
      
      return (
        <button
          onClick={() => onToggleStatus?.(product)}
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md ${
            status === "Active" 
              ? "bg-green-100 text-green-800 hover:bg-green-200" 
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }`}
          title={`Click to ${status === "Active" ? "deactivate" : "activate"} this product`}
        >
          {status}
        </button>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const product = row.original as Product
      return (
        <div className="flex items-center gap-2">
          <Button onClick={() => onView?.(product)} variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
            <Eye className="w-4 h-4" />
          </Button>
          <Button onClick={() => onEdit?.(product)} variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50">
            <Edit className="w-4 h-4" />
          </Button>
          {onDelete && (
            <Button onClick={() => onDelete(product)} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    },
  },
]
