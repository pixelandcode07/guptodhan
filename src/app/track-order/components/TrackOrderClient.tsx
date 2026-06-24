"use client"

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Package, Clock, CheckCircle, Truck, AlertCircle, Copy, CheckCircle2, ClipboardList, Box } from 'lucide-react'
import axios from 'axios'
import TrackingSkeleton from '@/app/products/tracking/components/TrackingSkeleton'
import { format, isValid } from 'date-fns'
import { toast } from 'sonner'
import Image from 'next/image'

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

export default function TrackOrderClient() {
  const searchParams = useSearchParams()
  const initialTrackingId = searchParams?.get('trackingId') || ''
  const initialParcelId = searchParams?.get('parcelId') || ''
  
  const [trackingId, setTrackingId] = useState(initialTrackingId)
  const [parcelId, setParcelId] = useState(initialParcelId)
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

  useEffect(() => {
    if (initialTrackingId) {
      setTimeout(() => {
        handleTrack()
      }, 0)
    }
  }, [initialTrackingId])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Tracking ID copied to clipboard!");
  }

  // ==========================================
  // Daraz Style Timeline Logic
  // ==========================================
  const getStepIndex = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'pending') return 0;
    if (s === 'processing') return 1;
    if (s === 'shipped') return 2;
    if (s === 'delivered') return 3;
    if (s === 'cancelled' || s === 'returned') return -1;
    return 0;
  };

  const activeStep = trackingData ? getStepIndex(trackingData.orderStatus) : 0;
  const isCancelled = activeStep === -1;

  // Generate realistic timeline based on available dates
  const generateTimeline = () => {
    if (!trackingData) return [];
    
    const timeline = [];
    const orderDate = new Date(trackingData.orderDetails.orderDate);
    const isValidDate = isValid(orderDate);

    // 1. Order Placed
    timeline.push({
      title: 'Order Processing',
      description: 'Order received and is being processed.',
      date: isValidDate ? format(orderDate, 'dd MMM') : 'N/A',
      time: isValidDate ? format(orderDate, 'HH:mm') : '',
      completed: true,
      isCurrent: activeStep === 0
    });

    // 2. Packed / Processing
    if (activeStep >= 1) {
      // Mocking packed date + 2 hours
      const packedDate = isValidDate ? new Date(orderDate.getTime() + 2 * 60 * 60 * 1000) : new Date();
      timeline.unshift({
        title: 'Processed and Ready to Ship',
        description: 'Order packed and ready to be handed over to logistics partner.',
        date: isValid(packedDate) ? format(packedDate, 'dd MMM') : 'N/A',
        time: isValid(packedDate) ? format(packedDate, 'HH:mm') : '',
        completed: true,
        isCurrent: activeStep === 1
      });
    }

    // 3. Shipped
    if (activeStep >= 2) {
      timeline.unshift({
        title: 'Shipped',
        description: `Package handed over to Logistics Partner [Steadfast Courier]. Status: ${trackingData.trackingInfo.deliveryStatus}`,
        date: 'Recent',
        time: '',
        completed: true,
        isCurrent: activeStep === 2
      });
    }

    // 4. Delivered
    if (activeStep === 3) {
      const delDate = trackingData.orderDetails.deliveryDate ? new Date(trackingData.orderDetails.deliveryDate) : new Date();
      timeline.unshift({
        title: 'Delivered',
        description: 'Package delivered! Thank you for shopping with us.',
        date: isValid(delDate) ? format(delDate, 'dd MMM') : 'Today',
        time: isValid(delDate) ? format(delDate, 'HH:mm') : '',
        completed: true,
        isCurrent: true,
        isSuccess: true
      });
    }

    // Cancelled State
    if (isCancelled) {
      timeline.unshift({
        title: 'Cancelled',
        description: `This order has been ${trackingData.orderStatus.toLowerCase()}.`,
        date: 'Updated',
        time: '',
        completed: true,
        isCurrent: true,
        isError: true
      });
    }

    return timeline;
  };

  const timelineData = generateTimeline();

  return (
    <div className="max-w-[1000px] mx-auto p-4 sm:p-6 space-y-6 min-h-screen">
      
      {/* Search Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Package</h1>
        <p className="text-gray-500 mb-6 text-sm">Enter your Tracking ID below to get real-time delivery updates.</p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
             <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
             <Input
                placeholder="Tracking ID (e.g. SFR260...)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                className="pl-10 h-12 text-base"
              />
          </div>
          <Button onClick={handleTrack} disabled={loading} className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold">
            {loading ? 'Tracking...' : 'Track'}
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm mt-3 flex items-center gap-1"><AlertCircle className="w-4 h-4"/> {error}</p>}
      </div>

      {loading && <TrackingSkeleton />}

      {trackingData && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Header Title */}
          <div className="bg-slate-50 px-6 py-4 border-b border-gray-200">
             <h2 className="text-xl font-bold text-gray-800">
               {trackingData.orderStatus === 'Pending' ? 'Order Placed' : trackingData.orderStatus}
             </h2>
          </div>

          {/* Courier & Tracking Info */}
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0 border border-blue-100">
                   <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                   <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Courier Info</p>
                   <p className="text-sm font-medium text-gray-900">Delivery Partner: Steadfast Courier</p>
                   <p className="text-xs text-gray-500">Order ID: {trackingData.orderId}</p>
                </div>
             </div>
             
             <div className="sm:text-right">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Tracking Number</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-teal-600 font-mono">{trackingData.trackingId}</span>
                  <button onClick={() => copyToClipboard(trackingData.trackingId)} className="text-gray-400 hover:text-gray-700 transition-colors" title="Copy Tracking ID">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
             </div>
          </div>

          {/* ── Horizontal Stepper (Daraz Style) ── */}
          {!isCancelled && (
            <div className="p-8 border-b border-gray-100 hidden sm:block">
              <div className="flex items-center justify-between relative max-w-3xl mx-auto">
                {/* Background Line */}
                <div className="absolute left-[10%] right-[10%] top-6 h-1 bg-gray-200 -z-10" />
                {/* Active Line */}
                <div 
                  className="absolute left-[10%] top-6 h-1 bg-slate-800 transition-all duration-500 -z-10" 
                  style={{ width: `${(activeStep / 3) * 80}%` }} 
                />

                {/* Steps */}
                {[
                  { icon: ClipboardList, label: 'Processing', step: 0 },
                  { icon: Box, label: 'Packed', step: 1 },
                  { icon: Truck, label: 'Shipped', step: 2 },
                  { icon: CheckCircle2, label: 'Delivered', step: 3 },
                ].map((item, index) => {
                  const isCompleted = activeStep >= item.step;
                  const isCurrent = activeStep === item.step;

                  return (
                    <div key={index} className="flex flex-col items-center gap-3 bg-white px-2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-300
                        ${isCompleted ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-gray-200 text-gray-400'}
                        ${isCurrent && item.step !== 3 ? 'ring-4 ring-blue-100 border-blue-600 bg-blue-600 text-white' : ''}
                      `}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Vertical Timeline Details ── */}
          <div className="p-6 sm:p-8 bg-gray-50/50">
            <div className="max-w-3xl mx-auto">
              {timelineData.map((item, index) => (
                <div key={index} className="flex gap-4 sm:gap-6">
                  
                  {/* Left: Date & Time */}
                  <div className="w-16 sm:w-24 shrink-0 text-right pt-1">
                    <p className={`text-sm font-semibold ${item.isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>{item.date}</p>
                    <p className="text-xs text-gray-400">{item.time}</p>
                  </div>

                  {/* Middle: Line & Dot */}
                  <div className="relative flex flex-col items-center">
                    {/* Line (hide for last item) */}
                    {index !== timelineData.length - 1 && (
                      <div className="absolute top-6 bottom-[-24px] w-[2px] bg-gray-200" />
                    )}
                    
                    {/* Dot / Icon */}
                    <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5
                      ${item.isSuccess ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 
                        item.isError ? 'bg-red-500 text-white ring-4 ring-red-100' :
                        item.isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 
                        'bg-gray-300'}
                    `}>
                      {item.isSuccess ? <CheckCircle className="w-4 h-4" /> : 
                       item.isError ? <XCircle className="w-4 h-4" /> : 
                       <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="pb-8 pt-0.5">
                    <h4 className={`text-sm sm:text-base font-bold ${item.isCurrent ? (item.isSuccess ? 'text-blue-600' : item.isError ? 'text-red-600' : 'text-gray-900') : 'text-gray-600'}`}>
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-lg leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address Summary */}
          <div className="bg-white p-6 border-t border-gray-200 flex items-start gap-3">
             <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
             <div>
               <p className="text-sm font-medium text-gray-900">Delivery Address</p>
               <p className="text-sm text-gray-600 mt-1">
                 {trackingData.orderDetails.customerName} - {trackingData.orderDetails.customerPhone} <br/>
                 {trackingData.orderDetails.deliveryAddress}, {trackingData.orderDetails.district}
               </p>
             </div>
          </div>

        </div>
      )}
    </div>
  )
}