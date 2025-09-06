"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

export type EmailCredential = {
  id: number
  host_server: string
  port: number
  email: string
  password: string
  mail_from_name: string
  mail_from_email: string
  encryption: string
  status: "active" | "inactive"
}

export const email_credential_columns: ColumnDef<EmailCredential>[] = [
  {
    accessorKey: "id",
    header: "SL",
  },
  {
    accessorKey: "host_server",
    header: "Host Server",
    cell: ({ row }) => {
      const hostServer = row.getValue("host_server") as string;
      return (
        <div className="max-w-xs truncate" title={hostServer}>
          {hostServer}
        </div>
      );
    },
  },
  {
    accessorKey: "port",
    header: "Port",
    cell: ({ row }) => {
      const port = row.getValue("port") as number;
      return (
        <div className="text-sm">
          {port}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <div className="max-w-xs truncate" title={email}>
          {email}
        </div>
      );
    },
  },
  {
    accessorKey: "password",
    header: "Password",
    cell: ({ row }) => {
      const password = row.getValue("password") as string;
      return (
        <div className="max-w-xs truncate" title={password}>
          {password}
        </div>
      );
    },
  },
  {
    accessorKey: "mail_from_name",
    header: "Mail From Name",
    cell: ({ row }) => {
      const mailFromName = row.getValue("mail_from_name") as string;
      return (
        <div className="max-w-xs truncate" title={mailFromName}>
          {mailFromName}
        </div>
      );
    },
  },
  {
    accessorKey: "mail_from_email",
    header: "Mail From Email",
    cell: ({ row }) => {
      const mailFromEmail = row.getValue("mail_from_email") as string;
      return (
        <div className="max-w-xs truncate" title={mailFromEmail}>
          {mailFromEmail}
        </div>
      );
    },
  },
  {
    accessorKey: "encryption",
    header: "Encryption",
    cell: ({ row }) => {
      const encryption = row.getValue("encryption") as string;
      return (
        <div className="text-sm">
          {encryption}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          status === "active"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}>
          {status === "active" ? "Active" : "Inactive"}
        </div>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  },
]
