"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export type SmsHistory = {
  id: number
  sms_template: string
  sending_type: string
  contact: string
  sms_receivers: string
  order_count_range: string
  order_value_range: string
  sent_at: string
}

export const sms_history_columns: ColumnDef<SmsHistory>[] = [
  {
    accessorKey: "id",
    header: "SL",
  },
  {
    accessorKey: "sms_template",
    header: "SMS Template",
    cell: ({ row }) => {
      const template = row.getValue("sms_template") as string;
      return (
        <div className="max-w-xs truncate" title={template}>
          {template}
        </div>
      );
    },
  },
  {
    accessorKey: "sending_type",
    header: "Sending Type",
    cell: ({ row }) => {
      const type = row.getValue("sending_type") as string;
      return (
        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          type === "Bulk"
            ? "bg-blue-100 text-blue-800"
            : type === "Individual"
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}>
          {type}
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
          {contact}
        </div>
      );
    },
  },
  {
    accessorKey: "sms_receivers",
    header: "SMS Receivers",
    cell: ({ row }) => {
      const receivers = row.getValue("sms_receivers") as string;
      return (
        <div className="max-w-xs truncate" title={receivers}>
          {receivers}
        </div>
      );
    },
  },
  {
    accessorKey: "order_count_range",
    header: "Order Count Range",
    cell: ({ row }) => {
      const range = row.getValue("order_count_range") as string;
      return (
        <div className="text-sm">
          {range}
        </div>
      );
    },
  },
  {
    accessorKey: "order_value_range",
    header: "Order Value Range",
    cell: ({ row }) => {
      const range = row.getValue("order_value_range") as string;
      return (
        <div className="text-sm">
          {range}
        </div>
      );
    },
  },
  {
    accessorKey: "sent_at",
    header: "Sent At",
    cell: ({ row }) => {
      const sentAt = row.getValue("sent_at") as string;
      return (
        <div className="text-sm">
          {sentAt}
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
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  },
]
