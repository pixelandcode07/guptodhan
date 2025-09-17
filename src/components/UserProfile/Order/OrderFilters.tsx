"use client"

import React from 'react'
import type { OrderStatus } from './types'

const filters: { key: Exclude<OrderStatus, 'delivered'>, label: string, count?: number }[] = [
  { key: 'all', label: 'All' },
  { key: 'to_pay', label: 'To Pay', count: 2 },
  { key: 'to_ship', label: 'To Ship', count: 3 },
  { key: 'to_receive', label: 'To Receive' },
  { key: 'to_review', label: 'To Review' },
  { key: 'cancelled', label: 'Cancelled' },
]

export default function OrderFilters({ value, onChange }: { value: OrderStatus, onChange: (v: OrderStatus) => void }) {
  return (
    <div className="flex flex-wrap gap-2 pb-4 border-b mb-4">
      {filters.map(f => {
        const active = value === f.key
        return (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            className={`h-8 px-3 rounded-full text-sm border ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}
          >
            {f.label}{typeof f.count === 'number' && f.count > 0 ? ` ${f.count}` : ''}
          </button>
        )
      })}
    </div>
  )
}


