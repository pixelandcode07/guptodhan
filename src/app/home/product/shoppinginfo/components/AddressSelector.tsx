"use client"

import React from 'react'

export default function AddressSelector() {
  const [selected, setSelected] = React.useState<'home' | 'office'>('home')

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Saved Addresses</h2>
        <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
          <span>+ Add New</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className={`border rounded-md p-4 cursor-pointer flex gap-3 ${selected==='home' ? 'ring-2 ring-blue-600 border-blue-200' : ''}`}>
          <input type="radio" name="address" className="mt-1" checked={selected==='home'} onChange={() => setSelected('home')} />
          <div>
            <div className="font-medium text-gray-900">Home</div>
            <div className="text-xs text-gray-600">123 Main Street</div>
            <div className="text-xs text-gray-600">New York, NY 10001</div>
          </div>
        </label>

        <label className={`border rounded-md p-4 cursor-pointer flex gap-3 ${selected==='office' ? 'ring-2 ring-blue-600 border-blue-200' : ''}`}>
          <input type="radio" name="address" className="mt-1" checked={selected==='office'} onChange={() => setSelected('office')} />
          <div>
            <div className="font-medium text-gray-900">Office</div>
            <div className="text-xs text-gray-600">123 Main Street</div>
            <div className="text-xs text-gray-600">New York, NY 10001</div>
          </div>
        </label>
      </div>
    </div>
  )
}
