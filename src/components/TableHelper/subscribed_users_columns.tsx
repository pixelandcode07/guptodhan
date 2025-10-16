"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"

export type SubscribedUserRow = {
  id: string
  sl: number
  email: string
  subscribedOn: string
}

export const getSubscribedUsersColumns = (
  onDelete: (row: SubscribedUserRow) => void
): ColumnDef<SubscribedUserRow>[] => [
  { accessorKey: "sl", header: () => <span>SL</span> },
  { accessorKey: "email", header: () => <span>Email</span> },
  { accessorKey: "subscribedOn", header: () => <span>Subscribed On</span> },
  {
    id: "actions",
    header: () => <span>Action</span>,
    cell: ({ row }) => (
      <button
        onClick={() => onDelete(row.original)}
        className="p-1.5 rounded bg-red-600/10 text-red-700 hover:bg-red-600/20"
        title="Delete"
      >
        <Trash2 size={14} />
      </button>
    ),
    enableSorting: false,
  },
]


