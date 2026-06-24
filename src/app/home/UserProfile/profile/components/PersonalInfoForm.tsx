"use client"

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface PersonalInfoFormProps {
  initialName: string
  initialPhone: string
  initialAddress?: string
  onSave?: (data: { name: string; phoneNumber: string; address?: string }) => Promise<void> | void
  isLoading?: boolean
}

// ✅ HELPER: JSON স্ট্রিং হলে সেটাকে সুন্দরভাবে কমা দিয়ে সাজিয়ে দেওয়ার ফাংশন
const formatAddress = (rawAddress: string | undefined): string => {
  if (!rawAddress) return '';
  
  try {
    // চেক করা হচ্ছে এটি JSON কিনা
    if (rawAddress.trim().startsWith('{') && rawAddress.trim().endsWith('}')) {
      const parsed = JSON.parse(rawAddress);
      
      // JSON এর পার্টগুলোকে একসাথে করা হচ্ছে
      const parts = [
        parsed.street?.replace(/\n/g, ' '), // লাইন ব্রেক থাকলে স্পেস করে দিবে
        parsed.upazila,
        parsed.district,
        parsed.postalCode ? `PO: ${parsed.postalCode}` : '',
        parsed.country
      ].filter(Boolean); // যেগুলো null/undefined বা খালি সেগুলো বাদ দিবে

      return parts.join(', ');
    }
  } catch (error) {
    // যদি JSON Parse করতে এরর হয়, তারমানে এটি সাধারণ স্ট্রিং, যেমন আছে তেমনই রিটার্ন করবে
    console.warn("Address formatting error, falling back to original:", error);
  }
  
  // JSON না হলে বা এরর হলে অরিজিনাল ভ্যালুটাই রিটার্ন করবে
  return rawAddress;
}

export default function PersonalInfoForm({ 
  initialName, 
  initialPhone,
  initialAddress = '',
  onSave,
  isLoading = false
}: PersonalInfoFormProps) {
  const [name, setName] = useState(initialName)
  const [phone, setPhone] = useState(initialPhone)
  const [address, setAddress] = useState('')

  useEffect(() => {
    setName(initialName)
    setPhone(initialPhone)
    // ✅ ইনিশিয়াল অ্যাড্রেস সেট করার আগে ফরম্যাট করে নেওয়া হচ্ছে
    setAddress(formatAddress(initialAddress))
  }, [initialName, initialPhone, initialAddress])

  const handleSave = async () => {
    if (!onSave) return
    try {
      await onSave({ name, phoneNumber: phone, address })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)

      if (
        message.includes('E11000') ||
        message.includes('duplicate key') ||
        message.includes('phoneNumber')
      ) {
        toast.error('Phone number already in use', {
          description: 'Please try a different phone number.',
          duration: 4000,
        })
      } else {
        toast.error('Something went wrong', {
          description: 'Please try again.',
          duration: 4000,
        })
      }
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-[#00005E]">Personal Information</h3>
      <div className="mt-4 grid gap-5 max-w-xl">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input 
            placeholder="e.g. Yeamin Hossain" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="focus-visible:ring-[#0097E9]"
          />
        </div>
        
        <div className="grid gap-2">
          <label className="text-sm font-medium text-gray-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <Input 
            placeholder="e.g. 017XXXXXXXX" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="focus-visible:ring-[#0097E9]"
          />
        </div>
        
        <div className="grid gap-2">
          <label className="text-sm font-medium text-gray-700">Address</label>
          <Input 
            placeholder="House, Street, Area, City" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="focus-visible:ring-[#0097E9]"
          />
          {/* ✅ ইউজারের সুবিধার্থে একটি ছোট নোট */}
          <p className="text-[11px] text-gray-400 mt-1">
            You can update your detailed shipping address from the checkout page.
          </p>
        </div>
        
        <div className="pt-2">
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="w-full sm:w-48 bg-[#EF4A23] text-white px-4 py-2.5 rounded-md hover:bg-[#d43d1a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}