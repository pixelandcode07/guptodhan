"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { Table as ReactTable } from "@tanstack/react-table"

interface PaginationControlsProps<TData> {
  table: ReactTable<TData>
  showPageNumbers?: boolean
  className?: string
}

export function PaginationControls<TData>({
  table,
  showPageNumbers = true,
  className,
}: PaginationControlsProps<TData>) {
  const pageCount = table.getPageCount()
  const currentPageIndex = table.getState().pagination.pageIndex ?? 0

  return (
    <Pagination className={`justify-end ${className ?? ""}`}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              table.previousPage()
            }}
            aria-disabled={!table.getCanPreviousPage()}
          />
        </PaginationItem>

        {showPageNumbers && pageCount > 0 && (
          <>
            {Array.from({ length: pageCount }).map((_, i) => {
              const isActive = i === currentPageIndex
              // Render first 3, last 1, current, and neighbors; else ellipsis
              const shouldShowNumber =
                i <= 2 || i === pageCount - 1 || Math.abs(i - currentPageIndex) <= 1

              const shouldShowLeadingEllipsis =
                i === 3 && currentPageIndex > 4
              const shouldShowTrailingEllipsis =
                i === pageCount - 2 && currentPageIndex < pageCount - 5

              if (shouldShowLeadingEllipsis || shouldShowTrailingEllipsis) {
                return (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }

              if (!shouldShowNumber) return null

              return (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={isActive}
                    onClick={(e) => {
                      e.preventDefault()
                      table.setPageIndex(i)
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
          </>
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              table.nextPage()
            }}
            aria-disabled={!table.getCanNextPage()}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}


