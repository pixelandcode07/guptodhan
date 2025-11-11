"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export type Review = {
  id: number
  dbId?: string
  image: string
  product: string
  rating: number
  review: string
  reply_from_admin: string
  customer: string
  name: string
  status: "Active" | "Inactive"
  created_at: string
}

export const createReviewColumns = (onDelete: (reviewId: string) => void): ColumnDef<Review>[] => [
  {
    accessorKey: "id",
    header: () => <span className="text-xs sm:text-sm">SL</span>,
  },
  {
    accessorKey: "image",
    header: () => <span className="text-xs sm:text-sm">Image</span>,
    cell: ({ row }) => {
      const image = row.getValue("image") as string;
      return (
        <div className="w-12 h-10 sm:w-16 sm:h-12 bg-gray-100 rounded flex items-center justify-center">
          {image ? (
            <img src={image} alt="Product" className="w-full h-full object-cover rounded" />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-[10px] sm:text-xs text-gray-500">
              No Image
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "product",
    header: () => <span className="text-xs sm:text-sm">Product</span>,
    cell: ({ row }) => {
      const product = row.getValue("product") as string;
      return (
        <div className="max-w-[120px] sm:max-w-[200px] md:max-w-xs truncate text-xs sm:text-sm" title={product}>
          {product}
        </div>
      );
    },
  },
  {
    accessorKey: "rating",
    header: () => <span className="text-xs sm:text-sm">Rating</span>,
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number;
      return (
        <div className="flex items-center flex-wrap">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-xs sm:text-sm ${
                  i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="ml-1 text-[10px] sm:text-xs text-gray-600">({rating})</span>
        </div>
      );
    },
  },
  {
    accessorKey: "review",
    header: () => <span className="text-xs sm:text-sm">Review</span>,
    cell: ({ row }) => {
      const review = row.getValue("review") as string;
      return (
        <div className="max-w-[150px] sm:max-w-[200px] md:max-w-xs truncate text-xs sm:text-sm" title={review}>
          {review}
        </div>
      );
    },
  },
  {
    accessorKey: "reply_from_admin",
    header: () => <span className="text-xs sm:text-sm">Reply From Admin</span>,
    cell: ({ row }) => {
      const reply = row.getValue("reply_from_admin") as string;
      return (
        <div className="max-w-[150px] sm:max-w-[200px] md:max-w-xs truncate text-xs sm:text-sm" title={reply}>
          {reply || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "customer",
    header: () => <span className="text-xs sm:text-sm">Customer</span>,
    cell: ({ row }) => {
      const customer = row.getValue("customer") as string;
      return (
        <div className="max-w-[120px] sm:max-w-[150px] truncate text-xs sm:text-sm" title={customer}>
          {customer}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: () => <span className="text-xs sm:text-sm">Name</span>,
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="max-w-[100px] sm:max-w-[120px] truncate text-xs sm:text-sm" title={name}>
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <span className="text-xs sm:text-sm">Status</span>,
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
    header: () => <span className="text-xs sm:text-sm">Action</span>,
    cell: ({ row }) => {
      const review = row.original;
      return (
        <div className="flex items-center gap-1 sm:gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3 text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline ml-1">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="mx-4 sm:mx-auto max-w-[90vw] sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-base sm:text-lg">Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-sm sm:text-base">
                  This action cannot be undone. This will permanently delete the review from{" "}
                  <strong>{review.name}</strong> for product <strong>{review.product}</strong>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => review.dbId && onDelete(review.dbId)}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                >
                  Delete Review
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    },
  },
]

// Backward compatibility - default columns without delete functionality
export const review_columns = createReviewColumns(() => {});
