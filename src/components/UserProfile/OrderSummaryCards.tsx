import React from 'react'

interface OrderSummaryCardsProps {
  pending?: number
  processing?: number
  delivered?: number
  cancelled?: number
}

export default function OrderSummaryCards({ 
  pending = 0, 
  processing = 0, 
  delivered = 0, 
  cancelled = 0 
}: OrderSummaryCardsProps) {
  const cards = [
    { label: 'Pending order', value: pending },
    { label: 'Processing order', value: processing },
    { label: 'Delivered order', value: delivered },
    { label: 'Cancelled order', value: cancelled },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-md border p-4">
          <div className="text-sm text-gray-600">{card.label}</div>
          <div className="mt-2 text-2xl font-semibold">{card.value}</div>
        </div>
      ))}
    </div>
  )
}
