"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' // useRouter ইম্পোর্ট করুন
import { Button } from '@/components/ui/button'
import { Search, Package, Truck } from 'lucide-react'

interface TrackingInfo {
  orderId: string
  trackingId: string
  trackingUrl: string
}

export default function OrderTracking() {
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null)
  const router = useRouter() // Router ইনিশিয়ালাইজ করুন

  useEffect(() => {
    const savedTracking = localStorage.getItem('lastOrderTracking')
    if (savedTracking) {
      setTrackingInfo(JSON.parse(savedTracking))
    }
  }, [])

  const handleInternalTrack = () => {
    if (trackingInfo?.trackingId) {
      // এটি ইউজারকে আপনার SteadfastTracking কম্পোনেন্ট যেখানে আছে সেখানে নিয়ে যাবে
      // পাথটি আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী চেক করে নিবেন (আমি /home/product/shoppinginfo ধরে নিচ্ছি)
      router.push(`/home/product/shoppinginfo?trackingId=${trackingInfo.trackingId}`)
    }
  }

  if (!trackingInfo) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Tracking</h2>
        <p className="text-gray-600">No recent orders found.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Tracking</h2>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
          <Package className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-medium text-gray-900">Order ID: {trackingInfo.orderId}</p>
            <p className="text-sm text-gray-600">Tracking ID: {trackingInfo.trackingId}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
          <Truck className="w-5 h-5 text-green-600" />
          <div className="flex-1">
            <p className="font-medium text-gray-900">Track Inside Guptodhan</p>
            <p className="text-sm text-gray-600">See real-time updates without leaving our site</p>
          </div>
          <Button
            onClick={handleInternalTrack}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Track Now
          </Button>
        </div>

        {/* অপশনাল: যদি ইউজার Steadfast এর মেইন সাইটে যেতে চায় */}
        <div className="text-center">
            <a 
                href={trackingInfo.trackingUrl} 
                target="_blank" 
                className="text-xs text-blue-500 hover:underline"
            >
                View on Steadfast Official Website
            </a>
        </div>
      </div>
    </div>
  )
}