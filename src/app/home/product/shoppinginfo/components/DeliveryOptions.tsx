"use client"

import React from 'react'

export default function DeliveryOptions() {
  const [selected, setSelected] = React.useState<'standard' | 'office'>('standard')

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Delivery Option</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className={`border rounded-md p-4 cursor-pointer flex gap-3 ${selected==='standard' ? 'ring-2 ring-blue-600 border-blue-200' : ''}`}>
          <input type="radio" name="delivery" className="mt-1" checked={selected==='standard'} onChange={() => setSelected('standard')} />
          <div>
            <div className="font-medium text-gray-900">Standard Delivery</div>
            <div className="text-xs text-gray-600">3-5 business days</div>
          </div>
        </label>
        <label className={`border rounded-md p-4 cursor-pointer flex gap-3 ${selected==='office' ? 'ring-2 ring-blue-600 border-blue-200' : ''}`}>
          <input type="radio" name="delivery" className="mt-1" checked={selected==='office'} onChange={() => setSelected('office')} />
          <div>
            <div className="font-medium text-gray-900">Office</div>
            <div className="text-xs text-gray-600">1-2 business days</div>
          </div>
        </label>
      </div>
    </div>
  )
}
