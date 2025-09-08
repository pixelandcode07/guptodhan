"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, Pencil, XCircle, CheckCircle2, Trash2 } from "lucide-react"

export type OrderRow = {
  id: string
  sl: number
  orderNo: string
  orderDate: string
  from: string
  name: string
  phone: string
  total: number
  payment: string
  status: string
}

export const ordersColumns: ColumnDef<OrderRow>[] = [
  {
    id: "select",
    header: () => <input type="checkbox" />,
    cell: () => <input type="checkbox" />,
    enableSorting: false,
  },
  { accessorKey: "sl", header: () => <span>SL</span> },
  { accessorKey: "orderNo", header: () => <span>Order No</span> },
  { accessorKey: "orderDate", header: () => <span>Order Date</span> },
  { accessorKey: "from", header: () => <span>From</span> },
  { accessorKey: "name", header: () => <span>Name</span> },
  { accessorKey: "phone", header: () => <span>Phone</span> },
  { accessorKey: "total", header: () => <span>Total</span> },
  { accessorKey: "payment", header: () => <span>Payment</span> },
  { accessorKey: "status", header: () => <span>Status</span> },
  {
    id: "actions",
    header: () => <span>Action</span>,
    cell: () => (
      <div className="flex items-center gap-2">
        <button className="p-1.5 rounded bg-blue-500/10 text-blue-600 hover:bg-blue-500/20" title="Order details">
          <Eye size={14} />
        </button>
        <button className="p-1.5 rounded bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" title="Approve">
          <CheckCircle2 size={14} />
        </button>
        <button className="p-1.5 rounded bg-amber-500/10 text-amber-600 hover:bg-amber-500/20" title="Edit order">
          <Pencil size={14} />
        </button>
        <button className="p-1.5 rounded bg-rose-500/10 text-rose-600 hover:bg-rose-500/20" title="Cancel order">
          <XCircle size={14} />
        </button>
        <button className="p-1.5 rounded bg-red-600/10 text-red-700 hover:bg-red-600/20" title="Delete order">
          <Trash2 size={14} />
        </button>
      </div>
    ),
    enableSorting: false,
  },
]


