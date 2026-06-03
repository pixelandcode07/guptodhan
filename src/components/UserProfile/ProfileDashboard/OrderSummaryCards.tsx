import React from 'react'
import { Clock, RotateCcw, CheckCircle, XCircle, PackageMinus } from 'lucide-react'

interface OrderSummaryCardsProps {
  pending?: number
  processing?: number
  delivered?: number
  cancelled?: number
  returns?: number // ✅ New Prop
}

export default function OrderSummaryCards({ 
  pending = 0, 
  processing = 0, 
  delivered = 0, 
  cancelled = 0,
  returns = 0 // ✅ New prop destructured
}: OrderSummaryCardsProps) {
  
  const cards = [
    { 
      label: 'Pending order', 
      value: pending, 
      icon: Clock, 
      iconColor: 'text-amber-500' 
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
      label: 'Return Request', // ✅ New Card Added
      value: returns, 
      icon: PackageMinus, 
      iconColor: 'text-orange-500' 
    },
    { 
      label: 'Cancelled order', 
      value: cancelled, 
      icon: XCircle, 
      iconColor: 'text-red-500' 
    },
  ]

  return (
    // ✅ Grid updated to fit 5 cards (grid-cols-5 on large screens)
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-md border p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <card.icon className={`h-5 w-5 ${card.iconColor}`} />
            <div className="text-sm font-medium text-gray-600">{card.label}</div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{card.value}</div>
        </div>
      ))}
    </div>
  )
}