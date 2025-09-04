"use client"

import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Column } from "@tanstack/react-table"
import type { ReactNode } from "react"

interface SortableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  children: ReactNode
}

export function SortableColumnHeader<TData, TValue>({
  column,
  children,
}: SortableColumnHeaderProps<TData, TValue>) {
  return (
    <Button
      variant="ghost"
      className="-ml-3 h-8 px-2"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )
}


