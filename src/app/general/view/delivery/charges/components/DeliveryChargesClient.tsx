"use client"

import React from "react"
import api from "@/lib/axios"
import { DataTable } from "@/components/TableHelper/data-table"
import { getDeliveryChargesColumns, DeliveryCharge } from "@/components/TableHelper/delivery_charges_columns"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type ApiDeliveryCharge = {
  _id: string
  divisionName: string
  districtName: string
  districtNameBangla: string
  deliveryCharge: number
}

function mapToRow(item: ApiDeliveryCharge, idx: number): DeliveryCharge {
  return {
    _id: item._id,
    id: idx + 1,
    division: item.divisionName,
    district: item.districtName,
    district_bangla: item.districtNameBangla,
    delivery_charge: item.deliveryCharge,
  }
}

export default function DeliveryChargesClient() {
  const [rows, setRows] = React.useState<DeliveryCharge[]>([])
  const [loading, setLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<DeliveryCharge | null>(null)
  const [charge, setCharge] = React.useState<string>("")

  React.useEffect(() => {
    setLoading(true)
    api.get('/delivery-charge')
      .then(res => {
        const list = (res.data?.data ?? []) as ApiDeliveryCharge[]
        setRows(list.map(mapToRow))
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false))
  }, [])

  const onEdit = (row: DeliveryCharge) => {
    setEditing(row)
    setCharge(String(row.delivery_charge ?? ''))
    setOpen(true)
  }

  const onSave = async () => {
    if (!editing?._id) { setOpen(false); return }
    const value = Number(charge)
    if (Number.isNaN(value)) {
      toast.error('Please enter a valid number')
      return
    }
    try {
      setLoading(true)
      await api.patch(`/delivery-charge/${editing._id}`, { deliveryCharge: value })
      toast.success('Delivery charge updated')
      // refresh list
      const res = await api.get('/delivery-charge')
      const list = (res.data?.data ?? []) as ApiDeliveryCharge[]
      setRows(list.map(mapToRow))
      setOpen(false)
      setEditing(null)
    } catch {
      toast.error('Failed to update')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        <DataTable columns={getDeliveryChargesColumns({ onEdit })} data={rows} />
        {loading && <div className="px-3 py-2 text-sm text-gray-500">Loading…</div>}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[92%] max-w-md rounded-md bg-white shadow-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-sm font-semibold">Edit Delivery Charge</h3>
              <button onClick={()=>setOpen(false)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div className="text-gray-700">
                {editing?.division} • {editing?.district} ({editing?.district_bangla})
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Delivery Charge (BDT)</label>
                <input value={charge} onChange={e=>setCharge(e.target.value)} className="h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="e.g. 150" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t">
              <Button variant="secondary" className="h-9" onClick={()=>setOpen(false)} disabled={loading}>Close</Button>
              <Button className="h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-60" onClick={onSave} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


