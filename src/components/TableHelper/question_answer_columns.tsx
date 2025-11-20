"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export type QuestionAnswer = {
  id: number;
  qaRecordId: string;
  productId?: string;
  image: string;
  product: string;
  customers_name: string;
  email: string;
  question: string;
  answer_from_admin: string;
  created_at: string;
};

type ActionHandlers = {
  onEdit: (qa: QuestionAnswer, action?: { type: "reply" | "viewProduct" }) => void;
  onDelete: (qa: QuestionAnswer) => void;
};

export const getQuestionAnswerColumns = (
  handlers: ActionHandlers
): ColumnDef<QuestionAnswer>[] => [
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
      const qaRecord = row.original;
      if (!qaRecord.productId) {
        return (
          <div className="max-w-xs truncate" title={product}>
            {product}
          </div>
        );
      }
      return (
        <button
          type="button"
          className="max-w-xs truncate text-left text-blue-600 underline-offset-2 hover:underline"
          title={product}
          onClick={() => handlers.onEdit(qaRecord, { type: "viewProduct" })}
        >
          {product}
        </button>
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
    cell: ({ row }) => {
      const original = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => handlers.onEdit(original)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => handlers.onDelete(original)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
