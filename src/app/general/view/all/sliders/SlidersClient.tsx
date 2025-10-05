'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/TableHelper/data-table'
import { slider_columns } from '@/components/TableHelper/slider_columns'

export default function SlidersClient({ initialRows }: { initialRows: any[] }) {
  const [rows, setRows] = useState<any[]>(initialRows || [])

  useEffect(() => {
    setRows(initialRows || [])
  }, [initialRows])

  useEffect(() => {
    const handler = (e: any) => {
      const id = e?.detail?._id
      if (!id) return
      setRows((prev) => prev.filter((r) => String(r._id) !== String(id)))
    }
    window.addEventListener('slider-deleted', handler as EventListener)
    return () => window.removeEventListener('slider-deleted', handler as EventListener)
  }, [])

  return <DataTable columns={slider_columns} data={rows} />
}


