"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye } from "lucide-react"

export type SupportTicketRow = {
  id: string
  sl: number
  ticketNo: string
  customer: string
  subject: string
  attachment: string | null
  status: string
}

export const support_tickets_columns: ColumnDef<SupportTicketRow>[] = [
  { accessorKey: "sl", header: () => <span>SL</span> },
  { accessorKey: "ticketNo", header: () => <span>Ticket No</span> },
  { accessorKey: "customer", header: () => <span>Customer</span> },
  { accessorKey: "subject", header: () => <span>Subject</span> },
  { accessorKey: "attachment", header: () => <span>Attachment</span> },
  { accessorKey: "status", header: () => <span>Status</span> },
  {
    id: "actions",
    header: () => <span>Action</span>,
    cell: () => (
      <button className="p-1.5 rounded bg-blue-500/10 text-blue-600 hover:bg-blue-500/20" title="View">
        <Eye size={14} />
      </button>
    ),
    enableSorting: false,
  },
]


