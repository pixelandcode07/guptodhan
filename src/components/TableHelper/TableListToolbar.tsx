"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

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
  onDownloadClick?: () => void
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
  onDownloadClick,
}: TableListToolbarProps) {
  return (
    <div className='flex flex-col gap-3 md:gap-3 md:flex-row md:items-center md:justify-between'>
      {/* Left cluster: Title + Status + Actions */}
      <div className='flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3'>
        <div className='flex items-center gap-2'>
          <h2 className='text-sm md:text-base font-semibold text-gray-900'>{title}</h2>
          {selectedStatus && (
            <span className='inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-2.5 py-1 text-xs md:text-[13px]'>
              {selectedStatus}
            </span>
          )}
        </div>

        <div className='flex items-center gap-2'>
          <span className='text-xs text-gray-500 hidden sm:inline'>Status</span>
          <select
            className='h-9 border border-gray-300 rounded-md px-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200'
            value={selectedStatus ?? "Select Status"}
            onChange={(e) => onStatusChange?.(e.target.value)}
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <Button variant={'default'} className='h-9 rounded-md px-4 bg-gray-900 text-white hover:bg-gray-800' onClick={onBulkChangeClick}>Change Selected Orders</Button>
          <Button variant={'default'} className='h-9 rounded-md px-4 bg-gray-900 text-white hover:bg-gray-800' onClick={onPrintClick}>Print Selected Orders</Button>
          <Button variant={'default'} className='h-9 rounded-md px-4 bg-gray-900 text-white hover:bg-gray-800' onClick={onCourierClick}>Courier Status</Button>
          {onBulkCourierEntryClick && (
            <Button variant={'default'} className='h-9 rounded-md px-4 bg-gray-900 text-white hover:bg-gray-800' onClick={onBulkCourierEntryClick}>Bulk Courier Entry</Button>
          )}
        </div>
      </div>

      {/* Right cluster: Page size + Download + Search */}
      <div className='flex flex-wrap items-center gap-2'>
        <span className='text-sm text-gray-700'>Show</span>
        <select
          className='h-9 border border-gray-300 rounded-md px-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200'
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
        >
          {pageSizeOptions.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span className='text-sm text-gray-700'>entries</span>
        <Button variant={'ghost'} className='h-9 rounded-md hover:bg-gray-100' onClick={onDownloadClick} title='Download'>
          <Download className='w-4 h-4' />
        </Button>
        <input
          className='h-9 w-full sm:w-56 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200'
          placeholder='Search'
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
    </div>
  )
}


