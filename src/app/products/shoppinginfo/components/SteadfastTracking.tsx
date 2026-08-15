"use client"

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, FileText, Package, Truck, CheckCircle, Check, AlertCircle, UserCircle2, XCircle, ClipboardList, Box, MapPin } from 'lucide-react'
import axios from 'axios'
import TrackingSkeleton from '../../tracking/components/TrackingSkeleton'
import { format, isValid } from 'date-fns'
import { toast } from 'sonner'

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
    if (s === 'processing') return 0;
    if (s === 'shipped') return 2;
    if (s === 'delivered') return 3;
    if (s === 'cancelled' || s === 'returned') return -1;
    return 0; // Default to processing
  };

  const activeStep = trackingData ? getStepIndex(trackingData.orderStatus) : 0;
  const isCancelled = activeStep === -1;

  // Generate timeline with exact Daraz styling (Newest at the top)
  const generateTimeline = () => {
    if (!trackingData) return [];
    
    const timeline = [];
    const orderDate = new Date(trackingData.orderDetails.orderDate);
    const isValidDate = isValid(orderDate);

    // Timeline goes from bottom (oldest) to top (newest)
    
    // Step 1: Order Processing
    timeline.push({
      title: 'Order Processing',
      description: 'Order received',
      date: isValidDate ? format(orderDate, 'dd MMM HH:mm') : 'N/A',
      isCurrent: activeStep === 0
    });

    // Step 2: Packed
    if (activeStep >= 1) {
      const packedDate = isValidDate ? new Date(orderDate.getTime() + 2 * 60 * 60 * 1000) : new Date();
      timeline.unshift({
        title: 'Processed and Ready to Ship',
        description: `Order will be handed over to logistics partner soon`,
        date: isValid(packedDate) ? format(packedDate, 'dd MMM HH:mm') : 'N/A',
        isCurrent: activeStep === 1
      });
    }

    // Step 3: Shipped
    if (activeStep >= 2) {
      const shippedDate = isValidDate ? new Date(orderDate.getTime() + 24 * 60 * 60 * 1000) : new Date();
      timeline.unshift({
        title: 'Package Handed over to Logistics Partner',
        description: `Package is now picked up and heading to the logistics facility. [${trackingData.trackingInfo.deliveryStatus}]`,
        date: isValid(shippedDate) ? format(shippedDate, 'dd MMM HH:mm') : 'N/A',
        isCurrent: activeStep === 2
      });
    }

    // Step 4: Delivered
    if (activeStep === 3) {
      const delDate = trackingData.orderDetails.deliveryDate ? new Date(trackingData.orderDetails.deliveryDate) : new Date();
      timeline.unshift({
        title: 'Delivered',
        description: 'Package delivered!',
        date: isValid(delDate) ? format(delDate, 'dd MMM HH:mm') : 'Today',
        isCurrent: true
      });
    }

    // Cancelled State
    if (isCancelled) {
      timeline.unshift({
        title: 'Cancelled',
        description: `Your order has been cancelled.`,
        date: 'Updated',
        isCurrent: true
      });
    }

    return timeline;
  };

  const timelineData = generateTimeline();

  // Daraz Horizontal Stepper Items
  const stepperItems = [
    { icon: FileText, label: 'Processing', step: 0 },
    { icon: Package, label: 'Packed', step: 1 },
    { icon: Truck, label: 'Shipped', step: 2 },
    { icon: CheckCircle, label: 'Delivered', step: 3 },
  ];

  return (
    <div className="max-w-[1000px] mx-auto p-4 sm:p-6 space-y-6 min-h-screen">
      
      {/* Search Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Your Steadfast Order</h1>
        <p className="text-gray-500 mb-6 text-sm">Enter your Tracking ID to get real-time updates</p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
             <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
             <Input
                placeholder="Enter Tracking ID (e.g. SFR260...)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                className="pl-10 h-11 text-base"
              />
          </div>
          <Button onClick={handleTrack} disabled={loading} className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            {loading ? 'Tracking...' : 'Track Order'}
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm mt-3 flex items-center gap-1"><AlertCircle className="w-4 h-4"/> {error}</p>}
      </div>

      {loading && <TrackingSkeleton />}

      {trackingData && !loading && (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
          
          {/* 1. Header (Daraz Style) */}
          <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200">
             <h2 className="text-[22px] font-bold text-gray-800 tracking-tight">
               {trackingData.orderStatus === 'Pending' ? 'Processing' : trackingData.orderStatus}
             </h2>
          </div>

          {/* 2. Tracking Details Top Box */}
          <div className="p-6 border-b border-gray-200">
             <h3 className="text-base font-bold text-gray-800 mb-4">Tracking Details</h3>
             
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                {/* Courier Info */}
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                      <UserCircle2 className="w-8 h-8 text-blue-500" />
                   </div>
                   <div className="flex flex-col gap-0.5">
                      <p className="text-[11px] font-bold text-gray-500">Courier Info</p>
                      <p className="text-[13px] text-gray-800">Delivery Partner: Steadfast Courier</p>
                      <p className="text-[13px] text-gray-600">Order ID: {trackingData.orderId}</p>
                   </div>
                </div>
                
                {/* Tracking Number */}
                <div className="sm:text-right flex flex-col gap-0.5">
                   <p className="text-[11px] font-bold text-gray-500">Tracking Number</p>
                   <div className="flex items-center gap-1 text-[13px] text-[#009688]">
                     <span>{trackingData.trackingId}</span>
                     <button onClick={() => copyToClipboard(trackingData.trackingId)} className="text-gray-400 hover:text-gray-700" title="Copy">
                       <Copy className="w-3.5 h-3.5" />
                     </button>
                   </div>
                </div>
             </div>
          </div>

          {/* 3. Horizontal Stepper (Daraz Style) */}
          {!isCancelled && (
            <div className="p-8 border-b border-gray-200 hidden sm:block">
              <div className="relative flex items-center justify-between max-w-2xl mx-auto">
                {/* Dotted Line Background */}
                <div className="absolute left-[12%] right-[12%] top-5 border-t-[2px] border-dotted border-gray-300 -z-10" />

                {stepperItems.map((item, index) => {
                  const isCompleted = activeStep >= item.step;
                  return (
                    <div key={index} className="flex flex-col items-center bg-white px-2 z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors
                        ${isCompleted ? 'bg-black text-white' : 'bg-gray-800/80 text-white'}
                      `}>
                        <item.icon className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <span className={`text-[12px] font-medium ${isCompleted ? 'text-black' : 'text-gray-500'}`}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Vertical Timeline Details (Daraz Style) */}
          <div className="p-6 sm:px-10 sm:py-8">
            <div className="relative">
              {timelineData.map((item, index) => (
                <div key={index} className="flex gap-4 sm:gap-6 mb-6 last:mb-0">
                  
                  {/* Left: Date */}
                  <div className="w-24 shrink-0 text-right pt-0.5">
                    <p className={`text-[13px] ${item.isCurrent ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                      {item.date}
                    </p>
                  </div>

                  {/* Middle: Timeline Dots */}
                  <div className="relative flex flex-col items-center">
                    {/* Vertical Line */}
                    {index !== timelineData.length - 1 && (
                      <div className="absolute top-5 bottom-[-24px] w-[2px] bg-gray-200" />
                    )}
                    
                    {/* Dot Indicator */}
                    <div className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center shrink-0
                      ${item.isCurrent ? 'bg-blue-600 text-white ring-[4px] ring-blue-100' : 'bg-gray-300 text-transparent'}
                    `}>
                      {item.isCurrent && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="pb-2">
                    <h4 className={`text-[14px] font-semibold ${item.isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                      {item.title}
                    </h4>
                    <p className={`text-[13px] mt-0.5 max-w-lg leading-snug ${item.isCurrent ? 'text-gray-600' : 'text-gray-400'}`}>
                      {item.description}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* 5. Delivery Address Summary */}
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