"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationControls } from "./PaginationControls";
import { SortableColumnHeader } from "./SortHeader";
import { Input } from "../ui/input";
import Link from "next/link";
import { ArrowUpNarrowWide } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** NEW – setter for optimistic updates */
  setData?: React.Dispatch<React.SetStateAction<TData[]>>;
  rearrangePath?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  setData,
  rearrangePath,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pageSize, setPageSize] = React.useState(10);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, globalFilter },
    initialState: { pagination: { pageSize } },
    meta: { setData },
  });

  // sync pageSize changes
  React.useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  return (
    <div className="overflow-hidden rounded-md border">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-2 gap-3">
        {/* Show entries */}
        <div className="flex items-center gap-2">
          Show
          <Input
            type="number"
            min={1}
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="w-20 border border-gray-500"
          />
          entries
        </div>

        {/* Search + Rearrange */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            Search:
            <Input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              className="border border-gray-500"
            />
          </div>

          {rearrangePath && (
            <Link
              href={rearrangePath}
              className="px-3 py-1 border rounded bg-[#00c2b2] text-white flex items-center gap-1 text-base"
            >
              <ArrowUpNarrowWide className="h-4 w-4" />
              Rearrange Categories
            </Link>
          )}
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort =
                  header.column.getCanSort?.() && header.column.id !== "action";
                const renderedHeader = header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    );
                return (
                  <TableHead key={header.id}>
                    {canSort && renderedHeader ? (
                      <SortableColumnHeader column={header.column}>
                        {renderedHeader}
                      </SortableColumnHeader>
                    ) : (
                      renderedHeader
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="py-4">
        <PaginationControls table={table} />
      </div>
    </div>
  );
}