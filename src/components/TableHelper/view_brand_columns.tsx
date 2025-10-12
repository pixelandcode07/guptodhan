import { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export interface FlattenedBrand {
    brandId: string;
    brandName: string;
    modelName: string;
    editionName: string;
    logo?: string;
}

export const view_brand_columns = (
    handleDelete: (_id: string) => void
): ColumnDef<FlattenedBrand>[] => [
        {
            id: "serial",
            header: "Serial",
            cell: ({ row }) => <span>{row.index + 1}</span>,
        },
        {
            accessorKey: "brandName",
            header: "Brand Name",
        },
        {
            accessorKey: "modelName",
            header: "Model Name",
        },
        {
            accessorKey: "editionName",
            header: "Edition Name",
        },
        {
            id: "col_action",
            header: "Actions",
            cell: ({ row }) => {
                const brandId = row.original.brandId;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1 h-8"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/general/edit/brand/${brandId}`}
                                    className="flex items-center gap-2 w-full"
                                >
                                    <Edit className="h-4 w-4 text-yellow-500" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="flex items-center gap-2 text-red-600 cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(brandId);
                                }}
                            >
                                <Trash className="h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
