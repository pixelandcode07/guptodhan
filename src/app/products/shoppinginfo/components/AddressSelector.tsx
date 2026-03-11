"use client"

import React from 'react'

interface AddressSelectorProps {
  selectedAddress: 'home' | 'office'
  onAddressChange: (address: 'home' | 'office') => void
}

export default function AddressSelector({ 
  selectedAddress, 
  onAddressChange 
}: AddressSelectorProps) {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Saved Addresses</h2>
        <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
          <span>+ Add New</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className={`border rounded-md p-4 cursor-pointer flex gap-3 transition-all ${
          selectedAddress === 'home' 
            ? 'ring-2 ring-blue-600 border-blue-200 bg-blue-50' 
            : 'hover:border-gray-300'
        }`}>
          <input 
            type="radio" 
            name="address" 
            className="mt-1" 
            checked={selectedAddress === 'home'} 
            onChange={() => onAddressChange('home')} 
          />
          <div>
            <div className="font-medium text-gray-900">Home</div>
            <div className="text-xs text-gray-600">123 Main Street</div>
            <div className="text-xs text-gray-600">Dhaka, Bangladesh</div>
          </div>
        </label>

        <label className={`border rounded-md p-4 cursor-pointer flex gap-3 transition-all ${
          selectedAddress === 'office' 
            ? 'ring-2 ring-blue-600 border-blue-200 bg-blue-50' 
            : 'hover:border-gray-300'
        }`}>
          <input 
            type="radio" 
            name="address" 
            className="mt-1" 
            checked={selectedAddress === 'office'} 
            onChange={() => onAddressChange('office')} 
          />
          <div>
            <div className="font-medium text-gray-900">Office</div>
            <div className="text-xs text-gray-600">456 Business Avenue</div>
            <div className="text-xs text-gray-600">Dhaka, Bangladesh</div>
          </div>
        </label>
      </div>
    </div>
  )
}
