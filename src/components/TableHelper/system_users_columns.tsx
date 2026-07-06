"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, XCircle, Trash2, ShieldCheck, Mail, Phone, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type SystemUserRow = {
  _id: string;
  sl: number;
  name: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// We wrap it in a function so we can pass external handlers
export const getSystemUsersColumns = (
  onDelete: (id: string) => void,
  onStatusChange: (id: string, newStatus: boolean) => void,
  onRoleChange: (id: string, newRole: string) => void
): ColumnDef<SystemUserRow>[] => [
  
  // 1. Checkbox Column
  {
    id: "select",
    header: ({ table }) => (
      <div className="px-1">
        <input
          type="checkbox"
          className="w-4 h-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-1">
        <input
          type="checkbox"
          className="w-4 h-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // 2. SL
  {
    accessorKey: "sl",
    header: "SL",
    cell: ({ row }) => <span className="font-medium text-gray-700">{row.index + 1}</span>,
  },

  // 3. User Info (Avatar + Name)
  {
    accessorKey: "name",
    header: "USER INFO",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2 min-w-[150px]">
          {user.profilePicture ? (
            <Image src={user.profilePicture} alt={user.name} width={32} height={32} className="rounded-full object-cover border border-gray-200" />
          ) : (
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold uppercase border border-blue-200 flex-shrink-0">
              {user.name?.charAt(0) || "U"}
            </div>
          )}
          <span className="font-semibold text-gray-900 truncate">{user.name}</span>
        </div>
      );
    },
  },

  // 4. Contact Details
  {
    accessorKey: "contact",
    header: "CONTACT DETAILS",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col gap-1 text-[11px] min-w-[160px]">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Mail className="h-3 w-3 text-blue-500 flex-shrink-0" />
            <span className="truncate">{user.email || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Phone className="h-3 w-3 text-green-500 flex-shrink-0" />
            <span className="truncate">{user.phoneNumber || "N/A"}</span>
          </div>
        </div>
      );
    },
  },

  // 5. Role (Editable Dropdown)
  {
    accessorKey: "role",
    header: "ROLE",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <select
          value={user.role}
          onChange={(e) => onRoleChange(user._id, e.target.value)}
          className="h-7 text-xs border border-gray-300 rounded px-2 outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 bg-white min-w-[110px]"
        >
          <option value="user">User</option>
          <option value="vendor">Vendor</option>
          <option value="service-provider">Service Provider</option>
          <option value="admin">Admin</option>
        </select>
      );
    },
  },

  // 6. Dates (Created & Updated)
  {
    accessorKey: "dates",
    header: "JOINED & UPDATED",
    cell: ({ row }) => {
      const created = new Date(row.original.createdAt).toLocaleDateString('en-GB');
      const updated = new Date(row.original.updatedAt).toLocaleDateString('en-GB');
      return (
        <div className="flex flex-col text-[10px] text-gray-500 min-w-[130px]">
          <div className="flex items-center gap-1">
             <CalendarDays className="h-3 w-3 text-gray-400 flex-shrink-0" />
             Joined: <span className="font-medium text-gray-700">{created}</span>
          </div>
          <div className="pl-4">
             Updated: {updated}
          </div>
        </div>
      );
    },
  },

  // 7. Status (Active/Inactive)
  {
    accessorKey: "isActive",
    header: () => <div className="text-center">STATUS</div>,
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return (
        <div className="flex justify-center">
          <button
            onClick={() => onStatusChange(row.original._id, !isActive)}
            className={cn(
              "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap",
              isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"
            )}
            title="Click to toggle status"
          >
            {isActive ? "Active" : "Inactive"}
          </button>
        </div>
      );
    },
  },

  // 8. Actions
  {
    id: "actions",
    header: () => <div className="text-right pr-4">ACTIONS</div>,
    cell: ({ row }) => (
      <div className="flex justify-end items-center gap-1 pr-4">
        <Button
          variant="ghost" size="sm"
          onClick={() => onDelete(row.original._id)}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          title="Delete User"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];