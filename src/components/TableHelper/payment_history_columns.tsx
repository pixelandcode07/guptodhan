"use client"

import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash } from "lucide-react"
import { Button } from "../ui/button"

export type PaymentHistoryData = {
  serial: string,
  payment_through: string,
  transaction_id: string,
  card_type: string,
  card_brand: string,
  amount: number,
  store_amount: number,
  currency: string,
  bank_tran_id: string,
  datetime: string,
  status: "VALID" | "INVALID" | "PENDING",
}

export const payment_history_columns: ColumnDef<PaymentHistoryData>[] = [
  {
    accessorKey: "serial",
    header: "SL",
  },
  {
    accessorKey: "payment_through",
    header: "Payment Through",
  },
  {
    accessorKey: "transaction_id",
    header: "Transaction ID",
  },
  {
    accessorKey: "card_type",
    header: "Card Type",
  },
  {
    accessorKey: "card_brand",
    header: "Card Brand",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number
      return <span className="font-medium">৳{amount}</span>
    }
  },
  {
    accessorKey: "store_amount",
    header: "Store Amount",
    cell: ({ row }) => {
      const amount = row.getValue("store_amount") as number
      return <span className="font-medium">৳{amount}</span>
    }
  },
  {
    accessorKey: "currency",
    header: "Currency",
  },
  {
    accessorKey: "bank_tran_id",
    header: "Bank Tran ID",
  },
  {
    accessorKey: "datetime",
    header: "Datetime",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      return (
        <div className={cn(`p-1 rounded-md w-max text-xs font-medium`,
          status === "VALID" && "bg-green-100 text-green-700",
          status === "INVALID" && "bg-red-100 text-red-700",
          status === "PENDING" && "bg-yellow-100 text-yellow-700",
        )}>{status}</div>
      )
    }
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black cursor-pointer"><Edit /></Button>
          <Button className="bg-red-700 hover:bg-red-800 text-white cursor-pointer"><Trash /></Button>
        </div>
      )
    }
  },
]
