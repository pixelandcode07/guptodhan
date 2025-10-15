"use client"

import React from "react"
import api from "@/lib/axios"
import { DataTable } from "@/components/TableHelper/data-table"
import { delivery_charges_columns, DeliveryCharge } from "@/components/TableHelper/delivery_charges_columns"

type ApiDeliveryCharge = {
  _id: string
  division: string
  district: string
  districtBangla: string
  charge: number
}

function mapToRow(item: ApiDeliveryCharge, idx: number): DeliveryCharge {
  return {
    id: idx + 1,
    division: item.division,
    district: item.district,
    district_bangla: item.districtBangla,
    delivery_charge: item.charge,
  }
}

export default function DeliveryChargesClient() {
  const [rows, setRows] = React.useState<DeliveryCharge[]>([])
  const [loading, setLoading] = React.useState(false)

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

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        <DataTable columns={delivery_charges_columns} data={rows} />
        {loading && <div className="px-3 py-2 text-sm text-gray-500">Loading…</div>}
      </div>
    </div>
  )
}


