"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { Edit, Trash } from "lucide-react"
import Image from "next/image"

export type BlogComment = {
  serial: string
  blog: string
  name: string
  email: string
  comment: string
  reply_from_admin: string
  status: "Pending" | "Approved" | "Rejected"
}

export const blog_comments_columns: ColumnDef<BlogComment>[] = [
  {
    accessorKey: "serial",
    header: "SL",
  },
  {
    accessorKey: "blog",
    header: "Blog",
    cell: ({ row }) => {
      const text = row.getValue("blog") as string
      return <div className="max-w-[260px] whitespace-normal leading-snug">{text}</div>
    }
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "comment",
    header: "Blog Comments",
    cell: ({ row }) => {
      const c = row.getValue("comment") as string
      return <div className="max-w-[560px] whitespace-normal leading-snug text-[13px]">{c}</div>
    }
  },
  {
    accessorKey: "reply_from_admin",
    header: "Reply From Admin",
    cell: ({ row }) => {
      const r = row.getValue("reply_from_admin") as string
      return <div className="max-w-[280px] whitespace-normal leading-snug text-[13px]">{r || ""}</div>
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const color = status === 'Approved' ? 'bg-green-100 text-green-700' : status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
      return <span className={`px-2 py-1 rounded text-xs ${color}`}>{status}</span>
    }
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black h-8 w-8 p-0"><Edit className="h-4 w-4" /></Button>
          <Button className="bg-red-700 hover:bg-red-800 text-white h-8 w-8 p-0"><Trash className="h-4 w-4" /></Button>
        </div>
      )
    }
  },
]
