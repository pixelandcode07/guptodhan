import React from 'react'
import { Clock, RotateCcw, CheckCircle, XCircle } from 'lucide-react'

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
    { 
      label: 'Pending order', 
      value: pending, 
      icon: Clock, 
      iconColor: 'text-yellow-500' 
    },
    { 
      label: 'Processing order', 
      value: processing, 
      icon: RotateCcw, 
      iconColor: 'text-blue-500' 
    },
    { 
      label: 'Delivered order', 
      value: delivered, 
      icon: CheckCircle, 
      iconColor: 'text-green-500' 
    },
    { 
      label: 'Cancelled order', 
      value: cancelled, 
      icon: XCircle, 
      iconColor: 'text-red-500' 
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-md border p-4">
          <div className="flex items-center gap-2 mb-2">
            <card.icon className={`h-5 w-5 ${card.iconColor}`} />
            <div className="text-sm text-gray-600">{card.label}</div>
          </div>
          <div className="text-2xl font-semibold">{card.value}</div>
        </div>
      ))}
    </div>
  )
}


