"use client"

import React from 'react'
import type { OrderStatus } from './types'

const FILTERS: { key: Exclude<OrderStatus, 'delivered'>, label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'to_pay', label: 'To Pay' },
  { key: 'to_ship', label: 'To Ship' },
  { key: 'to_receive', label: 'To Receive' },
  { key: 'to_review', label: 'To Review' },
  { key: 'cancelled', label: 'Cancelled' },
]

export default function OrderFilters({
  value,
  onChange,
  counts = {},
}: {
  value: OrderStatus
  onChange: (v: OrderStatus) => void
  counts?: Partial<Record<OrderStatus, number>>
}) {
  return (
    <div className="flex flex-wrap gap-2 pb-4 border-b mb-4">
      {FILTERS.map(f => {
        const active = value === f.key
        const count = counts[f.key] ?? 0
        return (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            className={`h-8 px-3 rounded-full text-sm border flex items-center gap-2 ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-200'}`}
          >
            <span>{f.label}</span>
            {count > 0 && (
              <span className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-semibold ${active ? 'bg-white text-blue-600' : 'bg-red-500 text-white'}`}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}


