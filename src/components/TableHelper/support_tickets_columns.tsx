"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"

export type SupportTicketRow = {
  _id: string;
  sl: number;
  ticketNo: string;
  customer: string;
  customerImage?: string; 
  subject: string;
  attachment: string | null;
  status: string;
  createdAt: string; 
}

// ✅ Safe URL Formatter for your VPS CDN Setup
const getSafeUrl = (link: string) => {
  if (!link || link === '-') return "#";
  
  // If the link already starts with http/https, return it as it is
  if (link.startsWith("http://") || link.startsWith("https://")) {
    return link;
  }

  // If it's just a path, attach the CDN base url directly
  let cleanPath = link.replace(/^[h/]+/, ""); 
  return `https://cdn.guptodhan.com/${cleanPath}`;
};

export const support_tickets_columns: ColumnDef<SupportTicketRow>[] = [
  // Checkbox Column
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        className="w-4 h-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="w-4 h-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  
  // SL Column
  { 
    accessorKey: "sl", 
    header: () => <span>SL</span>,
    cell: ({ row }) => <span className="font-medium text-gray-700">{row.index + 1}</span>
  },
  
  // Ticket No
  { 
    accessorKey: "ticketNo", 
    header: () => <span>Ticket No</span>,
    cell: ({ row }) => <span className="font-mono text-sm text-blue-600 font-semibold">{row.getValue("ticketNo")}</span>
  },
  
  // Customer Column with Image
  { 
    accessorKey: "customer", 
    header: () => <span>Customer</span>,
    cell: ({ row }) => {
      const name = row.getValue("customer") as string;
      const image = row.original.customerImage;
      
      return (
        <div className="flex items-center gap-2">
          {image ? (
            <Image src={image} alt={name} width={28} height={28} className="rounded-full object-cover border border-gray-200" />
          ) : (
            <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-[10px] text-gray-500 font-bold uppercase border border-gray-300">
              {name?.charAt(0) || "U"}
            </div>
          )}
          <span className="text-sm font-medium text-gray-800">{name}</span>
        </div>
      );
    }
  },
  
  // Subject
  { 
    accessorKey: "subject", 
    header: () => <span>Subject</span>,
    cell: ({ row }) => <span className="text-sm text-gray-700 truncate max-w-[150px] inline-block" title={row.getValue("subject")}>{row.getValue("subject")}</span>
  },
  
  // ✅ Attachment (Fixed and safe)
  { 
    accessorKey: "attachment", 
    header: () => <span>Attachment</span>,
    cell: ({ row }) => {
      const link = row.getValue("attachment") as string;
      if (!link || link === '-') return <span className="text-gray-400 text-xs">-</span>;
      
      const safeLink = getSafeUrl(link);

      return (
        <a href={safeLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs font-semibold" title={safeLink}>
          View File
        </a>
      );
    }
  },

  // Created At Date
  { 
    accessorKey: "createdAt", 
    header: () => <span>Date</span>,
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(date).toLocaleDateString('en-GB')}</span>;
    }
  },

  // Status
  { 
    accessorKey: "status", 
    header: () => <span>Status</span>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let color = "bg-gray-100 text-gray-700";
      
      if (status === 'Pending') color = "bg-yellow-100 text-yellow-700";
      if (status === 'In Progress') color = "bg-blue-100 text-blue-700";
      if (status === 'Solved') color = "bg-green-100 text-green-700";
      if (status === 'Rejected') color = "bg-red-100 text-red-700";
      if (status === 'On Hold') color = "bg-orange-100 text-orange-700";

      return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${color}`}>{status}</span>;
    }
  },
];