"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ExternalLink, Package, Truck } from 'lucide-react'

interface TrackingInfo {
  orderId: string
  trackingId: string
  trackingUrl: string
}

export default function OrderTracking() {
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null)

  useEffect(() => {
    // Load tracking info from localStorage
    const savedTracking = localStorage.getItem('lastOrderTracking')
    if (savedTracking) {
      setTrackingInfo(JSON.parse(savedTracking))
    }
  }, [])

  if (!trackingInfo) {
    return (
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Tracking</h2>
        <p className="text-gray-600">No recent orders found.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6">
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
            <p className="font-medium text-gray-900">Track on Steadfast</p>
            <p className="text-sm text-gray-600">Click below to track your parcel on Steadfast website</p>
          </div>
          <Button
            asChild
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <a
              href={trackingInfo.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Track Order
            </a>
          </Button>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <p className="font-medium mb-1">Tracking Information:</p>
          <ul className="space-y-1">
            <li>• Your order is being processed by Steadfast</li>
            <li>• You can track the delivery status on Steadfast website</li>
            <li>• COD amount will be collected upon delivery</li>
            <li>• Expected delivery: 48 hours</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
