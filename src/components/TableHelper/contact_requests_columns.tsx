"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash2 } from "lucide-react"

export type ContactRequestRow = {
  id: string
  sl: number
  name: string
  email: string
  message: string
  status: string
}

export const getContactRequestsColumns = (
  onEdit: (row: ContactRequestRow) => void,
  onDelete: (row: ContactRequestRow) => void
): ColumnDef<ContactRequestRow>[] => [
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
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(row.original)}
          className="p-1.5 rounded bg-blue-600/10 text-blue-700 hover:bg-blue-600/20"
          title="Edit"
        >
          <Edit size={14} />
        </button>
        <button
          onClick={() => onDelete(row.original)}
          className="p-1.5 rounded bg-red-600/10 text-red-700 hover:bg-red-600/20"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    ),
    enableSorting: false,
  },
]


