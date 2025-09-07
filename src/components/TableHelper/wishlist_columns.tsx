"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Wishlist = {
  id: number
  category: string
  image: string
  product: string
  customer_name: string
  email: string
  contact: string
  created_at: string
}

export const wishlist_columns: ColumnDef<Wishlist>[] = [
  {
    accessorKey: "id",
    header: "SL",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return (
        <div className="max-w-xs truncate" title={category}>
          {category}
        </div>
      );
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.getValue("image") as string;
      return (
        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
          {image ? (
            <img src={image} alt="Product" className="w-12 h-12 rounded object-cover" />
          ) : (
            <div className="w-12 h-12 bg-gray-300 rounded"></div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => {
      const product = row.getValue("product") as string;
      return (
        <div className="max-w-xs truncate" title={product}>
          {product}
        </div>
      );
    },
  },
  {
    accessorKey: "customer_name",
    header: "Customer Name",
    cell: ({ row }) => {
      const customerName = row.getValue("customer_name") as string;
      return (
        <div className="max-w-xs truncate" title={customerName}>
          {customerName}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <div className="max-w-xs truncate" title={email}>
          {email || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => {
      const contact = row.getValue("contact") as string;
      return (
        <div className="max-w-xs truncate" title={contact}>
          {contact || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as string;
      return (
        <div className="text-sm">
          {createdAt}
        </div>
      );
    },
  },
]
