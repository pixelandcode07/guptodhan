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
    header: "SL",
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.getValue("image") as string;
      return (
        <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center">
          {image ? (
            <img src={image} alt="Product" className="w-full h-full object-cover rounded" />
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
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number;
      return (
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-sm ${
                i < rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
          <span className="ml-1 text-xs text-gray-600">({rating})</span>
        </div>
      );
    },
  },
  {
    accessorKey: "review",
    header: "Review",
    cell: ({ row }) => {
      const review = row.getValue("review") as string;
      return (
        <div className="max-w-xs truncate" title={review}>
          {review}
        </div>
      );
    },
  },
  {
    accessorKey: "reply_from_admin",
    header: "Reply From Admin",
    cell: ({ row }) => {
      const reply = row.getValue("reply_from_admin") as string;
      return (
        <div className="max-w-xs truncate" title={reply}>
          {reply || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "name",
    header: "Name",
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
    cell: ({ row }) => {
      const review = row.original;
      return (
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the review from{" "}
                  <strong>{review.name}</strong> for product <strong>{review.product}</strong>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => review.dbId && onDelete(review.dbId)}
                  className="bg-red-600 hover:bg-red-700"
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
