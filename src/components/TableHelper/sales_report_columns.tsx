"use client"

import { ColumnDef } from "@tanstack/react-table"

// আপনার API রেসপন্স অনুযায়ী এই টাইপটি পরিবর্তন করতে হতে পারে
export type OrderReport = {
  _id: string;
  orderId: string;
  orderDate: string;
  userId: {
    name: string;
    email: string;
  };
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  paymentMethodId: {
    name: string;
  };
}

export const sales_report_columns: ColumnDef<OrderReport>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
    cell: ({ row }) => new Date(row.original.orderDate).toLocaleDateString(),
  },
  {
    accessorKey: "userId.name",
    header: "Customer Name",
  },
  {
    accessorKey: "userId.email",
    header: "Customer Email",
  },
  {
    accessorKey: "paymentMethodId.name",
    header: "Payment Method",
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      const status = row.original.paymentStatus;
      const color = status === 'Paid' ? 'text-green-600' : 'text-red-600';
      return <span className={`font-medium ${color}`}>{status}</span>
    }
  },
  {
    accessorKey: "orderStatus",
    header: "Order Status",
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount (৳)",
    cell: ({ row }) => `৳ ${row.original.totalAmount.toLocaleString()}`,
  },
]