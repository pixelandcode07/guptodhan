"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, Truck, CheckCircle2, Trash2 } from "lucide-react"

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
  { 
    accessorKey: "orderNo", 
    header: () => <span>Order No</span>,
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium text-blue-600">
        {row.getValue("orderNo")}
      </div>
    )
  },
  { accessorKey: "orderDate", header: () => <span>Order Date</span> },
  { accessorKey: "from", header: () => <span>From</span> },
  { 
    accessorKey: "name", 
    header: () => <span>Name</span>,
    cell: ({ row }) => (
      <div className="max-w-xs truncate" title={row.getValue("name") as string}>
        {row.getValue("name")}
      </div>
    )
  },
  { 
    accessorKey: "phone", 
    header: () => <span>Phone</span>,
    cell: ({ row }) => (
      <div className="font-mono text-sm">
        {row.getValue("phone")}
      </div>
    )
  },
  { 
    accessorKey: "total", 
    header: () => <span>Total</span>,
    cell: ({ row }) => {
      const total = row.getValue("total") as number;
      return (
        <div className="font-mono text-sm font-semibold text-green-600">
          ৳{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      );
    }
  },
  { 
    accessorKey: "payment", 
    header: () => <span>Payment</span>,
    cell: ({ row }) => {
      const payment = row.getValue("payment") as string;
      const isPaid = payment.toLowerCase().includes('paid') || payment.toLowerCase().includes('success');
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          isPaid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
        }`}>
          {payment}
        </span>
      );
    }
  },
  { 
    accessorKey: "status", 
    header: () => <span>Status</span>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
          case 'pending': return "bg-yellow-100 text-yellow-800";
          case 'processing': return "bg-blue-100 text-blue-800";
          case 'shipped': return "bg-purple-100 text-purple-800";
          case 'delivered': return "bg-green-100 text-green-800";
          case 'cancelled': return "bg-red-100 text-red-800";
          default: return "bg-gray-100 text-gray-800";
        }
      };
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(status)}`}>
          {status}
        </span>
      );
    }
  },
  {
    id: "actions",
    header: () => <span>Action</span>,
    cell: () => (
      <div className="flex items-center gap-2">
        <button className="p-1.5 rounded bg-blue-500/10 text-blue-600 hover:bg-blue-500/20" title="Order details">
          <Eye size={14} />
        </button>
        <button className="p-1.5 rounded bg-teal-500/10 text-teal-600 hover:bg-teal-500/20" title="Tracking the order">
          <Truck size={14} />
        </button>
        <button className="p-1.5 rounded bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" title="Deliver">
          <CheckCircle2 size={14} />
        </button>
        <button className="p-1.5 rounded bg-red-600/10 text-red-700 hover:bg-red-600/20" title="Delete">
          <Trash2 size={14} />
        </button>
      </div>
    ),
    enableSorting: false,
  },
]


