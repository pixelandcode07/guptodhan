'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  RowSelectionState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setData?: React.Dispatch<React.SetStateAction<any>>; // ✅ TS Error Fixed
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [pageSize, setPageSize] = React.useState(10);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    state: { sorting, globalFilter, rowSelection },
    initialState: { pagination: { pageSize } },
    enableRowSelection: true,
  });

  const { pageIndex } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="w-full space-y-3">
      {/* ===== Top Controls ===== */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => {
              const val = Number(e.target.value);
              setPageSize(val);
              table.setPageSize(val);
            }}
            className="h-8 w-16 rounded-md border border-gray-300 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {[10, 25, 50, 100].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <span>entries</span>
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Search products..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-9 pl-8 border-gray-300 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* ===== Table ===== */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
          <Table className="min-w-[1400px] w-full border-collapse">
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow
                  key={hg.id}
                  className="bg-gray-50 border-b border-gray-200 hover:bg-gray-50"
                >
                  {hg.headers.map((h) => (
                    <TableHead
                      key={h.id}
                      onClick={h.column.getToggleSortingHandler()}
                      className="h-11 px-3 text-[11px] font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-1">
                        {h.isPlaceholder
                          ? null
                          : flexRender(
                              h.column.columnDef.header,
                              h.getContext()
                            )}
                        {h.column.getCanSort() && (
                          <span className="text-gray-400 text-[10px]">
                            {h.column.getIsSorted() === 'asc'
                              ? ' ↑'
                              : h.column.getIsSorted() === 'desc'
                                ? ' ↓'
                                : ' ↕'}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, i) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? 'selected' : undefined}
                    className={`
                      border-b border-gray-100 last:border-0
                      transition-colors hover:bg-blue-50/30
                      ${row.getIsSelected() ? 'bg-blue-50' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                    `}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-3 py-2.5 text-sm text-gray-700 whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-gray-400 italic text-sm"
                  >
                    No entries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ===== Bottom Controls ===== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
        <div className="text-sm text-gray-500">
          {totalRows > 0 ? (
            <>
              Showing <span className="font-medium text-gray-700">{startRow}</span>
              {' '}to{' '}
              <span className="font-medium text-gray-700">{endRow}</span>
              {' '}of{' '}
              <span className="font-medium text-gray-700">{totalRows}</span>
              {' '}entries
              {Object.keys(rowSelection).length > 0 && (
                <span className="ml-2 text-blue-600">
                  ({Object.keys(rowSelection).length} selected)
                </span>
              )}
            </>
          ) : (
            'No entries'
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8 p-0 border-gray-300"
          >
            <ChevronsLeft size={14} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 px-3 border-gray-300 text-xs"
          >
            <ChevronLeft size={14} className="mr-1" />
            Previous
          </Button>

          {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
            let pageNum: number;
            if (pageCount <= 5) {
              pageNum = i;
            } else if (pageIndex < 3) {
              pageNum = i;
            } else if (pageIndex > pageCount - 4) {
              pageNum = pageCount - 5 + i;
            } else {
              pageNum = pageIndex - 2 + i;
            }
            return (
              <Button
                key={pageNum}
                variant={pageIndex === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => table.setPageIndex(pageNum)}
                className={`h-8 w-8 p-0 text-xs border-gray-300 ${
                  pageIndex === pageNum
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                    : ''
                }`}
              >
                {pageNum + 1}
              </Button>
            );
          })}

          {pageCount > 5 && pageIndex < pageCount - 3 && (
            <span className="text-gray-400 text-xs px-1">...</span>
          )}

          {pageCount > 5 && pageIndex < pageCount - 3 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(pageCount - 1)}
              className="h-8 w-8 p-0 text-xs border-gray-300"
            >
              {pageCount}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 px-3 border-gray-300 text-xs"
          >
            Next
            <ChevronRight size={14} className="ml-1" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8 p-0 border-gray-300"
          >
            <ChevronsRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}