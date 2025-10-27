"use client"

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'

interface PersonalInfoFormProps {
  initialName: string
  initialPhone: string
  onSave?: (data: { name: string; phone: string }) => void
}

export default function PersonalInfoForm({ 
  initialName, 
  initialPhone,
  onSave 
}: PersonalInfoFormProps) {
  const [name, setName] = useState(initialName)
  const [phone, setPhone] = useState(initialPhone)

  const handleSave = () => {
    if (onSave) {
      onSave({ name, phone })
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold">Personal information</h3>
      <div className="mt-4 grid gap-4 max-w-xl">
        <div className="grid gap-2">
          <label className="text-sm font-medium">
            Full name<span className="text-red-500">*</span>
          </label>
          <Input 
            placeholder="Full name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">
            Phone number<span className="text-red-500">*</span>
          </label>
          <Input 
            placeholder="+880 1XXXXXXXXX" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="pt-2">
          <button 
            onClick={handleSave}
            className="w-48 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}

