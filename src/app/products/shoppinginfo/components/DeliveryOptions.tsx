"use client"

import React from 'react'

export type DeliveryOption = 'standard' | 'steadfast' | 'office'

interface DeliveryOptionsProps {
  selectedDelivery: DeliveryOption
  onDeliveryChange: (option: DeliveryOption) => void
}

export default function DeliveryOptions({ 
  selectedDelivery, 
  onDeliveryChange
}: DeliveryOptionsProps) {
  const deliveryOptions = [
    {
      id: 'standard' as DeliveryOption,
      name: 'Standard Delivery',
      description: '3-5 business days',
      icon: '🚚'
    },
    {
      id: 'steadfast' as DeliveryOption,
      name: 'Steadfast COD',
      description: '48 hours delivery',
      icon: '⚡',
      badge: 'COD AVAILABLE'
    },
    {
      id: 'office' as DeliveryOption,
      name: 'Office Delivery',
      description: '1-2 business days',
      icon: '🏢'
    }
  ]

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Delivery Option</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {deliveryOptions.map((option) => (
          <label 
            key={option.id}
            className={`border rounded-md p-4 cursor-pointer flex gap-3 transition-all ${
              selectedDelivery === option.id 
                ? 'ring-2 ring-blue-600 border-blue-200 bg-blue-50' 
                : 'hover:border-gray-300'
            }`}
          >
            <input 
              type="radio" 
              name="delivery" 
              className="mt-1" 
              checked={selectedDelivery === option.id} 
              onChange={() => onDeliveryChange(option.id)} 
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{option.icon}</span>
                <div className="font-medium text-gray-900">{option.name}</div>
                {option.badge && (
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">
                    {option.badge}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-600 mb-2">{option.description}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}