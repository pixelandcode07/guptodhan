"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import axios from "axios";
import { ServiceData } from "@/types/ServiceDataType";
import React from "react";

// ✅ We wrap the columns in a function so we can pass `setData` from the Client component
export const service_data_columns = (
  setData: React.Dispatch<React.SetStateAction<ServiceData[]>>
): ColumnDef<ServiceData>[] => [
  
  // ✅ NEW: Checkbox Column Added Here
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
  
  // Serial
  {
    id: "serial",
    header: "Serial",
    cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
  },
  
  // Image
  {
    accessorKey: "thumbnailImage",
    header: "Image",
    cell: ({ row }) => {
      const img = row.original.thumbnailImage;
      return (
        <div className="relative w-12 h-12 rounded overflow-hidden border">
          {img ? (
            <Image src={img} alt="Service" fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[10px]">No Img</div>
          )}
        </div>
      );
    }
  },

  // Service Info
  {
    accessorKey: "serviceName",
    header: "Service Info",
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-gray-800">{row.original.serviceName}</div>
        <div className="text-xs text-gray-500 flex items-center gap-1">
           {/* Add your icon here if needed */}
           {row.original.serviceCategory?.name || "Service"}
        </div>
      </div>
    )
  },

  // Location
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="text-sm">
        <div className="text-gray-700">{row.original.district}</div>
        <div className="text-xs text-gray-500">{row.original.upazila}</div>
      </div>
    )
  },

  // Pricing
  {
    accessorKey: "servicePrice",
    header: "Pricing",
    cell: ({ row }) => (
      <div className="font-medium text-gray-800">
        ৳{row.original.servicePrice}
      </div>
    )
  },

  // Status
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "pending";
      let colorClass = "bg-yellow-100 text-yellow-700";
      
      if (status === "approved") colorClass = "bg-green-100 text-green-700";
      if (status === "rejected" || status === "disabled") colorClass = "bg-red-100 text-red-700";

      return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colorClass}`}>
          {status === 'approved' ? 'Active' : status === 'rejected' ? 'Disabled' : status}
        </span>
      );
    }
  },

  // Actions (Approve / Reject)
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const id = row.original._id;

      const handleStatusChange = async (newStatus: "approved" | "rejected") => {
        const loadingToast = toast.loading("Updating status...");
        try {
          const res = await axios.patch(`/api/v1/service-section/provide-service/status/${id}`, {
            status: newStatus
          });

          if (res.data.success) {
            toast.success("Service updated successfully", { id: loadingToast });
            
            // ✅ INSTANT UI UPDATE (No Reload Needed)
            setData((prevData) => 
                prevData.map((item) => 
                    item._id === id ? { ...item, status: newStatus } : item
                )
            );
          }
        } catch (error) {
          toast.error("Failed to update status", { id: loadingToast });
        }
      };

      return (
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleStatusChange("approved")}
            className="text-green-500 hover:text-green-600 transition-colors"
            title="Approve"
          >
            <CheckCircle2 size={20} />
          </button>
          
          <button 
            onClick={() => handleStatusChange("rejected")}
            className="text-red-500 hover:text-red-600 transition-colors"
            title="Reject/Disable"
          >
            <XCircle size={20} />
          </button>
        </div>
      );
    }
  }
];