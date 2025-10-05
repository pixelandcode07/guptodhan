"use client"

import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '@/components/TableHelper/data-table'
import { promo_codes_columns } from '@/components/TableHelper/promo_codes_columns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function PromoCodesClient({ initialRows }: { initialRows: any[] }) {
  const [statusFilter, setStatusFilter] = useState('all')
  const [rows, setRows] = useState<any[]>(initialRows || [])

  useEffect(() => {
    setRows(initialRows || [])
  }, [initialRows])

  useEffect(() => {
    const onDel = (e: any) => {
      const id = e?.detail?._id
      if (!id) return
      setRows(prev => prev.filter(r => String(r._id) !== String(id)))
    }
    const onUpd = (e: any) => {
      const id = e?.detail?._id
      const update = e?.detail?.update || {}
      if (!id) return
      setRows(prev => prev.map(r => String(r._id) === String(id) ? { ...r, ...normalize(update) } : r))
    }
    window.addEventListener('promo-deleted', onDel as EventListener)
    window.addEventListener('promo-updated', onUpd as EventListener)
    return () => {
      window.removeEventListener('promo-deleted', onDel as EventListener)
      window.removeEventListener('promo-updated', onUpd as EventListener)
    }
  }, [])

  const normalize = (u: any) => ({
    title: u.title ?? undefined,
    effective_date: u.startDate ? String(u.startDate).slice(0,10) : undefined,
    expiry_date: u.endingDate ? String(u.endingDate).slice(0,10) : undefined,
    type: u.type ?? undefined,
    value: typeof u.value !== 'undefined' ? (u.type === 'Percentage' ? `${u.value}%` : `${u.value}`) : undefined,
    min_spend: typeof u.minimumOrderAmount !== 'undefined' ? String(u.minimumOrderAmount) : undefined,
    code: u.code ?? undefined,
    status: u.status ? (u.status === 'active' ? 'Active' : 'Inactive') : undefined,
    icon: u.icon ?? undefined,
    shortDescription: u.shortDescription ?? undefined,
  })

  const filteredRows = useMemo(() => {
    if (statusFilter === 'all') return rows
    if (statusFilter === 'active') return rows.filter(r => r.status === 'Active')
    if (statusFilter === 'inactive') return rows.filter(r => r.status === 'Inactive')
    return rows
  }, [rows, statusFilter])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="mb-2">
          <h2 className="text-lg font-semibold border-l-2 border-blue-500"><span className="pl-5">Promo Codes</span></h2>
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
          <Link href="/general/add/new/code">
            <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 h-9">
              <Plus className="w-4 h-4" />
              Add New Promo
            </Button>
          </Link>
        </div>
      </div>
      <DataTable columns={promo_codes_columns} data={filteredRows} />
    </div>
  )
}


