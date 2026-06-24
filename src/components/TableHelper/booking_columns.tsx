"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, XCircle, Eye, CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, isValid } from "date-fns";

export interface Booking {
  _id: string;
  order_id: string;
  customer_id: string;
  provider_id: string;
  service_id: any;
  booking_date: string;
  time_slot: string;
  location_details: string;
  estimated_cost: number;
  status: string;
  contact_info: {
    name: string;
    phone: string;
    email?: string;
  };
  customer_notes?: string;
  provider_notes?: string;
  provider_rejection_message?: string;
  createdAt: string;
}

const safeFormat = (dateStr: string) => {
  const date = new Date(dateStr);
  return isValid(date) ? format(date, 'dd MMM yyyy, hh:mm a') : 'N/A';
};

const statusColor: Record<string, string> = {
  'Pending Confirmation': 'bg-yellow-100 text-yellow-700',
  'Confirmed': 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-purple-100 text-purple-700',
  'Completed': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700',
};

// We wrap it in a function so we can pass external handlers (like opening a modal)
export const getBookingColumns = (
  onViewDetails: (booking: Booking) => void,
  onConfirm: (id: string) => void,
  onComplete: (id: string) => void,
  onCancel: (id: string) => void,
  processingId: string | null
): ColumnDef<Booking>[] => [
  
  // 1. Checkbox Column
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center space-x-2">
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

  // 2. Order ID
  {
    accessorKey: "order_id",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="text-xs font-mono font-bold text-blue-600">
        {row.getValue("order_id")}
      </span>
    ),
  },

  // 3. Contact Info
  {
    accessorKey: "contact_info",
    header: "Contact",
    cell: ({ row }) => {
      const contact = row.original.contact_info;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">{contact?.name}</span>
          <span className="text-xs text-gray-500">{contact?.phone}</span>
        </div>
      );
    },
  },

  // 4. Date & Time
  {
    accessorKey: "booking_date",
    header: "Date & Time",
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div className="flex flex-col text-sm text-gray-700">
          <div className="flex items-center gap-1">
             <CalendarDays className="w-3 h-3 text-gray-400" />
             {safeFormat(booking.booking_date)}
          </div>
          <span className="text-xs text-gray-500 font-medium pl-4">{booking.time_slot}</span>
        </div>
      );
    },
  },

  // 5. Location
  {
    accessorKey: "location_details",
    header: "Location",
    cell: ({ row }) => (
      <div className="flex items-start gap-1 max-w-[150px]">
        <MapPin className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
        <span className="text-xs text-gray-600 truncate" title={row.original.location_details}>
            {row.original.location_details}
        </span>
      </div>
    ),
  },

  // 6. Cost
  {
    accessorKey: "estimated_cost",
    header: "Cost",
    cell: ({ row }) => (
      <span className="text-sm font-bold text-gray-800">
        ৳{row.getValue("estimated_cost")}
      </span>
    ),
  },

  // 7. Status
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
          statusColor[status] || "bg-gray-100 text-gray-600"
        )}>
          {status}
        </span>
      );
    },
  },

  // 8. Actions
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const booking = row.original;
      const isProcessing = processingId === booking._id;

      return (
        <div className="flex justify-start items-center gap-1">
          {/* View Details */}
          <Button
            variant="ghost" size="sm"
            onClick={() => onViewDetails(booking)}
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>

          {/* Confirm */}
          {booking.status === 'Pending Confirmation' && (
            <Button
              variant="ghost" size="sm"
              onClick={() => onConfirm(booking._id)}
              disabled={isProcessing}
              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
              title="Confirm Booking"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}

          {/* Complete */}
          {booking.status === 'Confirmed' && (
            <Button
              variant="ghost" size="sm"
              onClick={() => onComplete(booking._id)}
              disabled={isProcessing}
              className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              title="Mark Complete"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}

          {/* Cancel */}
          {['Pending Confirmation', 'Confirmed'].includes(booking.status) && (
            <Button
              variant="ghost" size="sm"
              onClick={() => onCancel(booking._id)}
              disabled={isProcessing}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Cancel Booking"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];