"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

export type SmsTemplate = {
  id: number
  template_title: string
  template_description: string
  created_at: string
}

export const sms_template_columns: ColumnDef<SmsTemplate>[] = [
  {
    accessorKey: "id",
    header: "SL",
  },
  {
    accessorKey: "template_title",
    header: "Template Title",
    cell: ({ row }) => {
      const title = row.getValue("template_title") as string;
      return (
        <div className="max-w-xs truncate" title={title}>
          {title}
        </div>
      );
    },
  },
  {
    accessorKey: "template_description",
    header: "Template Description",
    cell: ({ row }) => {
      const description = row.getValue("template_description") as string;
      return (
        <div className="max-w-xs truncate" title={description}>
          {description}
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
