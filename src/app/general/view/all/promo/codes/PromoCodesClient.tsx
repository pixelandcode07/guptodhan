"use client"

import { useMemo, useState } from 'react'
import { DataTable } from '@/components/TableHelper/data-table'
import { promo_codes_columns } from '@/components/TableHelper/promo_codes_columns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, ArrowUpDown } from 'lucide-react'

export default function PromoCodesClient({ initialRows }: { initialRows: any[] }) {
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = useMemo(() => {
    if (statusFilter === 'all') return initialRows
    if (statusFilter === 'active') return initialRows.filter(r => r.status === 'Active')
    if (statusFilter === 'inactive') return initialRows.filter(r => r.status === 'Inactive')
    return initialRows
  }, [initialRows, statusFilter])

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
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 h-9">
            <ArrowUpDown className="w-4 h-4" />
            Rearrange
          </Button>
        </div>
      </div>
      <DataTable columns={promo_codes_columns} data={rows} />
    </div>
  )
}


