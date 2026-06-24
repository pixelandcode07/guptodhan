"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, XCircle, MapPin, Tag, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import axios from "axios";
import { ServiceData } from "@/types/ServiceDataType";
import React from "react";

// ✅ Wrap columns in a function to receive setData for instant UI updates
export const getServiceColumns = (
    setData: React.Dispatch<React.SetStateAction<ServiceData[]>>
): ColumnDef<ServiceData>[] => [
    
    // ✅ 1. Checkbox Column for Bulk Actions
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

    {
        accessorKey: "serial",
        header: "Serial",
        cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
    },
    {
        accessorKey: "service_images",
        header: "Image",
        cell: ({ row }) => {
            const images = row.getValue("service_images") as string[];
            return (
                <div className="relative w-16 h-12 rounded-md overflow-hidden border bg-gray-50">
                    {images?.[0] ? (
                        <Image src={images[0]} alt="Service" fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Img</div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "service_title",
        header: "Service Info",
        cell: ({ row }) => {
            const service = row.original;
            return (
                <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-gray-900 line-clamp-1">{service.service_title}</span>
                    <div className="flex items-center text-[10px] text-gray-500 gap-1">
                        <Tag className="h-3 w-3" /> {service.service_category || "Service"}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "service_area",
        header: "Location",
        cell: ({ row }) => {
            const area = row.original.service_area || {};
            return (
                <div className="flex flex-col text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-red-400" />
                        <span>{area.thana || "-"}</span>
                    </div>
                    <span className="pl-4 text-[10px] text-gray-400">{area.city || "-"}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "base_price",
        header: "Pricing",
        cell: ({ row }) => {
            const service = row.original;
            return (
                <div className="flex flex-col">
                    <span className="font-bold text-primary">৳{service.base_price}</span>
                    <span className="text-[10px] capitalize text-gray-400">{service.pricing_type}</span>
                </div>
            );
        },
    },

    // ✅ 2. Created At Column
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            const dateStr = (row.original as any).createdAt;
            const date = dateStr ? new Date(dateStr).toLocaleDateString() : "-";
            return (
                <div className="flex items-center gap-1 text-xs text-gray-600">
                    <CalendarDays className="h-3 w-3 text-gray-400" />
                    {date}
                </div>
            );
        },
    },

    {
        accessorKey: "service_status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("service_status") as string;
            return (
                <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    status === "Active"
                        ? "bg-green-100 text-green-700"
                        : status === "Under Review" || status === "Draft"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                )}>
                    {status}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const service = row.original;

            // ✅ 3. Corrected Status Logic + Instant UI Update
            const handleStatusUpdate = async (action: "approve" | "reject") => {
                const loadingToast = toast.loading(`${action === "approve" ? "Approving" : "Rejecting"} service...`);
                try {
                    // API Call correctly formats payload: { action: "approve" }
                    const res = await axios.patch(
                        `/api/v1/service-section/provide-service/status/${service._id}`,
                        { action } 
                    );

                    if (res.data.success) {
                        toast.success(`Service ${action === "approve" ? "approved" : "rejected"} successfully`, { id: loadingToast });
                        
                        // Instant State Update (No Page Reload)
                        setData((prev: ServiceData[]) =>
                            prev.map(item =>
                                item._id === service._id
                                    ? {
                                        ...item,
                                        service_status: action === "approve" ? "Active" : "Disabled",
                                        is_visible_to_customers: action === "approve",
                                    }
                                    : item
                            )
                        );
                    }
                } catch (error: any) {
                    console.error(error);
                    toast.error(error.response?.data?.message || "Operation failed", { id: loadingToast });
                }
            };

            return (
                <div className="flex items-center gap-1.5">
                    <Button
                        variant="ghost" size="sm"
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleStatusUpdate("approve")}
                        title="Approve Service"
                    >
                        <CheckCircle className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="ghost" size="sm"
                        className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        onClick={() => handleStatusUpdate("reject")}
                        title="Reject Service"
                    >
                        <XCircle className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];