"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";
import { IServiceBanner } from "@/types/ServiceBannerType";
import { confirmDelete } from "@/components/ReusableComponents/ConfirmToast"; // adjust path if needed

export const service_banner_columns: ColumnDef<IServiceBanner>[] = [
    {
        accessorKey: "serial",
        header: "Serial",
        cell: ({ row }) => {
            const index = row.index + 1;
            return <span className="font-medium">{index}</span>;
        },
    },
    {
        accessorKey: "bannerImage",
        header: "Banner Image",
        cell: ({ row }) => {
            const imageUrl = row.getValue("bannerImage") as string;

            return imageUrl ? (
                <div className="relative w-32 h-20 rounded-lg overflow-hidden border">
                    <Image
                        src={imageUrl}
                        alt="Banner Preview"
                        fill
                        className="object-cover"
                    />
                </div>
            ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-lg w-32 h-20 flex items-center justify-center">
                    <span className="text-xs text-gray-500">No Image</span>
                </div>
            );
        },
    },
    {
        accessorKey: "bannerTitle",
        header: "Title",
        cell: ({ row }) => {
            return <span className="font-medium">{row.getValue("bannerTitle")}</span>;
        },
    },
    {
        accessorKey: "subTitle",
        header: "Sub Title",
        cell: ({ row }) => {
            const subTitle = row.getValue("subTitle") as string | undefined;
            return subTitle ? (
                <span className="text-sm text-gray-600">{subTitle}</span>
            ) : (
                <span className="text-xs text-gray-400 italic">—</span>
            );
        },
    },
    {
        accessorKey: "bannerDescription",
        header: "Description",
        cell: ({ row }) => {
            const desc = row.getValue("bannerDescription") as string | undefined;

            if (!desc) {
                return <span className="text-xs text-gray-400 italic">No description</span>;
            }

            const words = desc.trim().split(/\s+/);
            const truncated = words.slice(0, 15).join(" ");
            const hasMore = words.length > 15;

            return (
                <div className="max-w-xs">
                    <p
                        className="text-sm text-gray-600 line-clamp-3"
                        title={desc}
                    >
                        {truncated}
                        {hasMore && <span className="text-gray-500">...</span>}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as "active" | "inactive";
            return (
                <span
                    className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    )}
                >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt") as string);
            return (
                <span className="text-sm text-gray-600">
                    {date.toLocaleDateString("en-GB")}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row, table }) => {
            const banner = row.original;

            const handleDelete = async (banner: IServiceBanner) => {
                const confirmed = await confirmDelete(
                    `Delete banner "${banner.bannerTitle}"? This action cannot be undone.`
                );
                if (!confirmed) return;

                try {
                    await toast.promise(
                        axios.delete(`/api/v1/service-section/service-banner/${banner._id}`),
                        {
                            loading: "Deleting banner...",
                            success: "Banner deleted successfully!",
                            error: (err) =>
                                err.response?.data?.message || "Failed to delete banner",
                        }
                    );

                    // Optimistic update
                    const setData = table.options.meta?.setData as
                        | React.Dispatch<React.SetStateAction<IServiceBanner[]>>
                        | undefined;

                    if (setData) {
                        setData((prev) => prev.filter((item) => item._id !== banner._id));
                    }
                } catch (error) {
                    console.error("Delete error:", error);
                }
            };

            return (
                <div className="flex items-center gap-2">
                    <Link href={`/general/edit/service-banner/${banner._id}`}>
                        <Button size="sm" variant="EditBtn" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button
                        onClick={() => handleDelete(banner)}
                        size="sm"
                        variant="DeleteBtn"
                        className="h-8 w-8 p-0"
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];