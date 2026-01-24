"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash, CheckCircle, XCircle, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";
import { confirmDelete } from "@/components/ReusableComponents/ConfirmToast";
import { ServiceData } from "@/types/ServiceDataType";

export const service_data_columns: ColumnDef<ServiceData>[] = [
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
                    <Image
                        src={images?.[0] || "/placeholder-service.png"}
                        alt="Service"
                        fill
                        className="object-cover"
                    />
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
                        <Tag className="h-3 w-3" /> {service.service_category}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "service_area",
        header: "Location",
        cell: ({ row }) => {
            const area = row.original.service_area;
            return (
                <div className="flex flex-col text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-red-400" />
                        <span>{area.thana}</span>
                    </div>
                    <span className="pl-4 text-[10px] text-gray-400">{area.city}</span>
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
                        : status === "Under Review"
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
        cell: ({ row, table }) => {
            const service = row.original;
            const setData = (table.options.meta as any)?.setData;

            // Updated Status Logic
            const handleStatusUpdate = async (action: "approve" | "reject") => {
                try {
                    await toast.promise(
                        axios.patch(
                            `/api/v1/service-section/provide-service/status/${service.service_id}`,
                            { action }
                        ),
                        {
                            loading: `${action === "approve" ? "Approving" : "Rejecting"} service...`,
                            success: `Service ${action === "approve" ? "approved" : "rejected"} successfully`,
                            error: (err) => err.response?.data?.message || "Operation failed",
                        }
                    );

                    if (setData) {
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
                } catch (error) {
                    console.error(error);
                }
            };


            // const handleDelete = async () => {
            //     const confirmed = await confirmDelete(`Delete "${service.service_title}"?`);
            //     if (!confirmed) return;
            //     try {
            //         await toast.promise(
            //             axios.delete(`/api/v1/service-section/provide-service/${service._id}`),
            //             {
            //                 loading: "Deleting...",
            //                 success: "Deleted!",
            //                 error: "Failed to delete",
            //             }
            //         );
            //         if (setData) setData((prev: ServiceData[]) => prev.filter(item => item._id !== service._id));
            //     } catch (error) { console.error(error); }
            // };

            return (
                <div className="flex items-center gap-1.5">
                    {/* Approve Button */}
                    <Button
                        variant="ghost" size="sm"
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleStatusUpdate("approve")}
                        title="Approve Service"
                    >
                        <CheckCircle className="h-4 w-4" />
                    </Button>

                    {/* Reject Button */}
                    <Button
                        variant="ghost" size="sm"
                        className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        onClick={() => handleStatusUpdate("reject")}
                        title="Reject Service"
                    >
                        <XCircle className="h-4 w-4" />
                    </Button>

                    {/* Edit Link */}
                    {/* <Link href={`/dashboard/services/edit/${service._id}`}>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-blue-100 text-blue-600 hover:bg-blue-50">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </Link> */}

                    {/* Delete Button */}
                    {/* <Button
                        variant="outline" size="sm"
                        className="h-8 w-8 p-0 border-red-100 text-red-600 hover:bg-red-50"
                        onClick={handleDelete}
                    >
                        <Trash className="h-4 w-4" />
                    </Button> */}
                </div>
            );
        },
    },
];