"use client";

import { ColumnDef } from "@tanstack/react-table";

export const recentOrdersColumns: ColumnDef<any>[] = [
    { accessorKey: "orderId", header: "Order ID" },
    { accessorKey: "shippingName", header: "Customer" },
    { accessorKey: "totalAmount", header: "Amount", cell: ({ row }) => `৳${row.original.totalAmount}` },
    { accessorKey: "paymentStatus", header: "Payment" },
    { accessorKey: "orderStatus", header: "Status" },
    { accessorKey: "orderDate", header: "Date", cell: ({ row }) => new Date(row.original.orderDate).toLocaleDateString() },
];