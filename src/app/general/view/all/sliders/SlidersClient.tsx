"use client"

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/TableHelper/data-table'
import { slider_columns } from '@/components/TableHelper/slider_columns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import RearrangeButton from '@/components/ReusableComponents/RearrangeButton'

export default function SlidersClient({ initialRows }: { initialRows: any[] }) {
  
  const [rows, setRows] = useState<any[]>(initialRows || [])
  const [statusFilter, setStatusFilter] = useState('all')

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

  useEffect(() => {
    const handler = (e: any) => {
      const id = e?.detail?._id
      const update = e?.detail?.update || {}
      if (!id) return
      setRows((prev) => prev.map((r) => String(r._id) === String(id) ? { ...r, ...normalizeRow(update) } : r))
    }
    window.addEventListener('slider-updated', handler as EventListener)
    return () => window.removeEventListener('slider-updated', handler as EventListener)
  }, [])

  const normalizeRow = (u: any) => {
    return {
      slider: u.image ?? undefined,
      sub_title: u.subTitleWithColor ?? undefined,
      title: u.bannerTitleWithColor ?? undefined,
      slider_link: u.sliderLink ?? undefined,
      button_text: u.buttonWithColor ?? undefined,
      button_link: u.buttonLink ?? undefined,
      status: u.status ? (u.status === 'active' ? 'Active' : 'Inactive') : undefined,
      
      // 🔥 NEW: লাইভ আপডেটের জন্য অ্যাপ ডাটা হ্যান্ডলিং
      app_type: u.appRedirectType ?? undefined,
      app_target: u.appRedirectId ?? undefined,
    }
  }

  const filteredRows = rows.filter((r) => {
    if (statusFilter === 'all') return true
    if (statusFilter === 'active') return r.status === 'Active'
    if (statusFilter === 'inactive') return r.status === 'Inactive'
    return true
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="mb-2">
          <h2 className="text-lg font-semibold border-l-2 border-blue-500"><span className="pl-5">Sliders List</span></h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-40">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Link href="/general/add/new/slider">
            <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 h-9">
              <Plus className="w-4 h-4" />
              Add New Slider
            </Button>
          </Link>
          <RearrangeButton href="/general/rearrange/sliders" label="Rearrange Slider" />
        </div>
      </div>
      <DataTable columns={slider_columns} data={filteredRows} />
    </div>
  )
}