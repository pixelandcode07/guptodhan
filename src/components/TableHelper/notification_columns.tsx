"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export type Notification = {
  id: number
  notification_channel: string
  notification_title: string
  notification_description: string
  sent_at: string
}

export const notification_columns: ColumnDef<Notification>[] = [
  {
    accessorKey: "id",
    header: "SL",
  },
  {
    accessorKey: "notification_channel",
    header: "Notification Channel",
    cell: ({ row }) => {
      const channel = row.getValue("notification_channel") as string;
      return (
        <div className="max-w-xs truncate font-mono text-sm" title={channel}>
          {channel}
        </div>
      );
    },
  },
  {
    accessorKey: "notification_title",
    header: "Notification Title",
    cell: ({ row }) => {
      const title = row.getValue("notification_title") as string;
      return (
        <div className="max-w-xs truncate" title={title}>
          {title}
        </div>
      );
    },
  },
  {
    accessorKey: "notification_description",
    header: "Notification Description",
    cell: ({ row }) => {
      const description = row.getValue("notification_description") as string;
      return (
        <div className="max-w-xs truncate" title={description}>
          {description}
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
