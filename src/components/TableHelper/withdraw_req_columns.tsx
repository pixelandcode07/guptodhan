"use client"

import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash } from "lucide-react"
import { Button } from "../ui/button"




export type Withdraw_req = {
  serial: string,
  vendor_name: string,
  amount: number,
  date_time: string,
  method: string,
  bank: string,
  bank_acc: string,
  mfs_acc: string,
  transction_id: string,
  status: string,
}

export const withdraw_req_columns: ColumnDef<Withdraw_req>[] = [
  {
    accessorKey: "serial",
    header: "Serial",
  },
  {
    accessorKey: "vendor_name",
    header: "Vendor Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "date_time",
    header: "date Time",
  },
  {
    accessorKey: "method",
    header: "Method",
  },
  {
    accessorKey: "bank",
    header: "Bank",
  },
  {
    accessorKey: "bank_acc",
    header: "Bank Account No.",
  },
  {
    accessorKey: "mfs_acc",
    header: "MFS Acc",
  },
  {
    accessorKey: "transction_id",
    header: "Transction ID",
  },
  {
    accessorKey: "status",
    header: "status",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: () => {
      // const action = row.getValue("action")
      return (
        <div className="flex items-center gap-2">
          {/* <Button className="bg-yellow-400 hover:bg-yellow-400 text-black cursor-pointer"><Edit /></Button>
          <Button className="bg-red-700 hover:bg-red-700 text-white cursor-pointer"><Trash /></Button> */}
          No design
        </div>
      )
    }
  },
]