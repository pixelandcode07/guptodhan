"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"

export type ContactRequestRow = {
  id: string
  sl: number
  name: string
  email: string
  message: string
  status: string
}

export const contact_requests_columns: ColumnDef<ContactRequestRow>[] = [
  { accessorKey: "sl", header: () => <span>SL</span> },
  { accessorKey: "name", header: () => <span>Name</span> },
  { accessorKey: "email", header: () => <span>Email</span> },
  { accessorKey: "message", header: () => <span>Message</span>,
    cell: ({ getValue }) => (
      <div className="max-w-[56ch] truncate" title={String(getValue() ?? '')}>
        {String(getValue() ?? '')}
      </div>
    )
  },
  { accessorKey: "status", header: () => <span>Status</span> },
  {
    id: "actions",
    header: () => <span>Action</span>,
    cell: () => (
      <button className="p-1.5 rounded bg-red-600/10 text-red-700 hover:bg-red-600/20" title="Delete">
        <Trash2 size={14} />
      </button>
    ),
    enableSorting: false,
  },
]


