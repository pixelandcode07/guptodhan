"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

export type QuestionAnswer = {
  id: number
  image: string
  product: string
  customers_name: string
  email: string
  question: string
  answer_from_admin: string
  created_at: string
}

export const question_answer_columns: ColumnDef<QuestionAnswer>[] = [
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
    accessorKey: "customers_name",
    header: "Customers Name",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <div className="max-w-xs truncate" title={email}>
          {email}
        </div>
      );
    },
  },
  {
    accessorKey: "question",
    header: "Question",
    cell: ({ row }) => {
      const question = row.getValue("question") as string;
      return (
        <div className="max-w-xs truncate" title={question}>
          {question}
        </div>
      );
    },
  },
  {
    accessorKey: "answer_from_admin",
    header: "Answer From Admin",
    cell: ({ row }) => {
      const answer = row.getValue("answer_from_admin") as string;
      return (
        <div className="max-w-xs truncate" title={answer}>
          {answer || "-"}
        </div>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
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
