"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";
import { confirmDelete } from "@/components/ReusableComponents/ConfirmToast"; // Adjust path if needed

// Updated type to include vendorName (store name)
export type VendorProduct = {
    _id: string;
    productId: string;
    productTitle: string;
    thumbnailImage: string;
    productPrice: number;
    discountPrice: number;
    stock: number;
    sku: string;
    status: string;
    sellCount: number;
    createdAt: string;
    updatedAt: string;
    productTag: string[];
    rewardPoints: number;
    vendorName: string; // This comes from the API as "A2B Store"
};

export const vendor_product_columns: ColumnDef<VendorProduct>[] = [
    {
        accessorKey: "serial",
        header: "Serial",
        cell: ({ row }) => {
            return <span className="font-medium">{row.index + 1}</span>;
        },
    },
    {
        accessorKey: "vendorName",
        header: "Store Name",
        cell: ({ row }) => {
            const storeName = row.getValue("vendorName") as string;
            return <span className="font-semibold text-gray-800">{storeName}</span>;
        },
    },
    {
        accessorKey: "thumbnailImage",
        header: "Image",
        cell: ({ row }) => {
            const imageUrl = row.getValue("thumbnailImage") as string;
            return imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={row.original.productTitle}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover border shadow-sm"
                />
            ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-lg w-20 h-20 flex items-center justify-center">
                    <span className="text-xs text-gray-500">No Image</span>
                </div>
            );
        },
    },
    {
        accessorKey: "productTitle",
        header: "Product Name",
        cell: ({ row }) => {
            const title = row.getValue("productTitle") as string;
            const id = row.original._id;
            return (
                <Link
                    href={`/products/${id}`}
                    className="font-semibold text-blue-600 hover:underline"
                >
                    {title}
                </Link>
            );
        },
    },
    {
        accessorKey: "sku",
        header: "SKU",
        cell: ({ row }) => (
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {row.getValue("sku")}
            </span>
        ),
    },
    {
        accessorKey: "productPrice",
        header: "Price",
        cell: ({ row }) => {
            const price = row.getValue("productPrice") as number;
            const discount = row.original.discountPrice as number;
            return (
                <div className="text-right">
                    {discount > 0 && discount < price ? (
                        <>
                            <p className="line-through text-gray-500">৳{price.toLocaleString()}</p>
                            <p className="font-bold text-green-600">৳{discount.toLocaleString()}</p>
                        </>
                    ) : (
                        <p className="font-bold">৳{price.toLocaleString()}</p>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }) => {
            const stock = row.getValue("stock") as number;
            return (
                <span
                    className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        stock === 0 && "bg-red-100 text-red-700",
                        stock > 0 && stock <= 10 && "bg-yellow-100 text-yellow-700",
                        stock > 10 && "bg-green-100 text-green-700"
                    )}
                >
                    {stock} in stock
                </span>
            );
        },
    },
    {
        accessorKey: "sellCount",
        header: "Sold",
        cell: ({ row }) => (
            <span className="font-medium">{row.getValue("sellCount")}</span>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <span
                    className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium capitalize",
                        status === "active" && "bg-green-100 text-green-800",
                        status === "inactive" && "bg-red-100 text-red-800",
                        status === "pending" && "bg-yellow-100 text-yellow-800"
                    )}
                >
                    {status}
                </span>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Added On",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt") as string);
            return <span className="text-sm text-gray-600">{date.toLocaleDateString("en-GB")}</span>;
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row, table }) => {
            const product = row.original;

            const handleDelete = async () => {
                const confirmed = await confirmDelete(
                    `Are you sure you want to delete "${product.productTitle}" from ${product.vendorName}?`
                );
                if (!confirmed) return;

                try {
                    await toast.promise(
                        axios.delete(`/api/v1/product/${product._id}`),
                        {
                            loading: "Deleting product...",
                            success: "Product deleted successfully!",
                            error: (err) =>
                                err.response?.data?.message || "Failed to delete product",
                        }
                    );

                    const setData = table.options.meta?.setData as
                        | React.Dispatch<React.SetStateAction<VendorProduct[]>>
                        | undefined;

                    if (setData) {
                        setData((prev) => prev.filter((item) => item._id !== product._id));
                    }
                } catch (error) {
                    console.error("Delete error:", error);
                }
            };

            return (
                <div className="flex items-center gap-2">
                    <Link href={`/edit/product/${product._id}`}>
                        <Button size="sm" variant="EditBtn" className="h-9 w-9 p-0">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </Link>

                    <Button
                        onClick={handleDelete}
                        size="sm"
                        variant="DeleteBtn"
                        className="h-9 w-9 p-0"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];