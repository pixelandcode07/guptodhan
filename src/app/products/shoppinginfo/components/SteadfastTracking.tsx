"use client"

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Package, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react'
import axios from 'axios'
import TrackingSkeleton from '../../tracking/components/TrackingSkeleton'

interface TrackingData {
  orderId: string
  parcelId: string
  trackingId: string
  orderStatus: string
  trackingInfo: {
    status: number
    deliveryStatus: string
    trackingCode: string
  }
  orderDetails: {
    customerName: string
    customerPhone: string
    deliveryAddress: string
    city: string
    district: string
    totalAmount: number
    orderDate: string
    deliveryDate: string
  }
}

export default function SteadfastTracking() {
  const searchParams = useSearchParams()
  const initialId = searchParams?.get('trackingId') || ''
  const [trackingId, setTrackingId] = useState(initialId)
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async () => {
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID')
      return
    }

    setLoading(true)
    setError('')
    setTrackingData(null)

    try {
      const response = await axios.get(`/api/v1/product-order/steadfast/tracking?trackingId=${trackingId}`)
      
      if (response.data.success) {
        setTrackingData(response.data.data)
      } else {
        setError(response.data.message || 'Failed to retrieve tracking information')
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to track order')
    } finally {
      setLoading(false)
    }
  }

  // Auto-track when trackingId is present in the URL
  useEffect(() => {
    if (initialId) {
      // defer to allow component mount
      setTimeout(() => {
        handleTrack()
      }, 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId])

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />
      case 'processing':
        return <Package className="w-5 h-5 text-yellow-500" />
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <TrackingSkeleton />
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Steadfast Order</h1>
        <p className="text-gray-600">Enter your tracking ID to get real-time updates</p>
      </div>

      {/* Tracking Input */}
      <Card>
        <CardHeader>
          <CardTitle>Enter Tracking Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter tracking ID (e.g., TRACK12345)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleTrack} disabled={loading}>
              Track Order
            </Button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tracking Results */}
      {trackingData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(trackingData.orderStatus)}
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <Badge className={getStatusColor(trackingData.orderStatus)}>
                  {trackingData.orderStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Order ID:</span>
                <span className="text-sm text-gray-600">{trackingData.orderId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Parcel ID:</span>
                <span className="text-sm text-gray-600">{trackingData.parcelId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Tracking ID:</span>
                <span className="text-sm text-gray-600">{trackingData.trackingId}</span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-medium">Customer:</span>
                <p className="text-sm text-gray-600">{trackingData.orderDetails.customerName}</p>
              </div>
              <div>
                <span className="font-medium">Phone:</span>
                <p className="text-sm text-gray-600">{trackingData.orderDetails.customerPhone}</p>
              </div>
              <div>
                <span className="font-medium">Address:</span>
                <p className="text-sm text-gray-600">
                  {trackingData.orderDetails.deliveryAddress}, {trackingData.orderDetails.city}, {trackingData.orderDetails.district}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Amount:</span>
                <span className="font-semibold">৳{trackingData.orderDetails.totalAmount.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-500" />
                Tracking Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    {getStatusIcon(trackingData.trackingInfo.deliveryStatus)}
                  </div>
                  <h3 className="font-medium text-gray-900">Delivery Status</h3>
                  <p className="text-sm text-gray-600">{trackingData.trackingInfo.deliveryStatus}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Package className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="font-medium text-gray-900">Tracking Code</h3>
                  <p className="text-sm text-gray-600 font-mono">{trackingData.trackingInfo.trackingCode}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="font-medium text-gray-900">Order Status</h3>
                  <p className="text-sm text-gray-600">{trackingData.orderStatus}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
