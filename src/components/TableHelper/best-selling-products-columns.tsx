"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const bestSellingProductsColumns: ColumnDef<any>[] = [
    {
        accessorKey: "thumbnailImage",
        header: "Image",
        cell: ({ row }) => (
            <Image
                src={row.original.thumbnailImage}
                alt={row.original.productTitle}
                width={50}
                height={50}
                className="rounded-md object-cover"
            />
        ),
    },
    { accessorKey: "productTitle", header: "Product" },
    { accessorKey: "sellCount", header: "Sold", cell: ({ row }) => row.original.sellCount || 0 },
    { accessorKey: "discountPrice", header: "Price", cell: ({ row }) => `৳${row.original.discountPrice || row.original.productPrice}` },
];