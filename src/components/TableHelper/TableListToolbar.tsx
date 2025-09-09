"use client"

import { Button } from "@/components/ui/button"

type TableListToolbarProps = {
  title: string
  statusOptions?: string[]
  selectedStatus?: string
  onStatusChange?: (value: string) => void
  onBulkChangeClick?: () => void
  onPrintClick?: () => void
  onCourierClick?: () => void
  onBulkCourierEntryClick?: () => void
  pageSizeOptions?: number[]
  pageSize?: number
  onPageSizeChange?: (n: number) => void
  search?: string
  onSearchChange?: (s: string) => void
}

export default function TableListToolbar({
  title,
  statusOptions = ["Select Status"],
  selectedStatus,
  onStatusChange,
  onBulkChangeClick,
  onPrintClick,
  onCourierClick,
  onBulkCourierEntryClick,
  pageSizeOptions = [20],
  pageSize = pageSizeOptions?.[0] ?? 20,
  onPageSizeChange,
  search = "",
  onSearchChange,
}: TableListToolbarProps) {
  return (
    <div className='flex flex-wrap items-center gap-2 justify-between border border-[#e4e7eb] rounded-xs p-3'>
      <div className='flex items-center gap-2'>
        <span className='text-sm'>{title}{selectedStatus ? ` • ${selectedStatus}` : ''}</span>
        <select
          className='h-9 border border-gray-300 rounded px-2 text-sm'
          value={selectedStatus ?? "Select Status"}
          onChange={(e) => onStatusChange?.(e.target.value)}
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <Button variant={'default'} className='h-9' onClick={onBulkChangeClick}>Change Selected Orders</Button>
        <Button variant={'default'} className='h-9' onClick={onPrintClick}>Print Selected Orders</Button>
        <Button variant={'default'} className='h-9' onClick={onCourierClick}>Courier Status</Button>
        {onBulkCourierEntryClick && (
          <Button variant={'default'} className='h-9' onClick={onBulkCourierEntryClick}>Bulk Courier Entry</Button>
        )}
      </div>
      <div className='flex items-center gap-2'>
        <span className='text-sm'>Show</span>
        <select
          className='h-9 border border-gray-300 rounded px-2 text-sm'
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
        >
          {pageSizeOptions.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span className='text-sm'>entries</span>
        <input
          className='h-9 border border-gray-300 rounded px-3 text-sm'
          placeholder='Search:'
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
    </div>
  )
}


