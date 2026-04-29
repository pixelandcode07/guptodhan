"use client"

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Clock } from 'lucide-react'

export default function OrderSuccessModal({ open, onOpenChange, orderId }: {
  open: boolean
  onOpenChange: (v: boolean) => void
  orderId?: string
}) {
  const [countdown, setCountdown] = useState(3)
  const isOpenRef = useRef(open)

  useEffect(() => {
    isOpenRef.current = open
  }, [open])

  useEffect(() => {
    if (open) {
      setCountdown(3)
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            if (isOpenRef.current) {
              window.location.href = '/home/UserProfile/orders'
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    } else {
      setCountdown(3)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-sm mx-auto p-0 overflow-hidden rounded-2xl border-0 shadow-xl">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Order Placed Successfully</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>

        {/* Blue header banner */}
        <div className="bg-blue-600 px-6 pt-6 pb-10 text-center">
          <p className="text-blue-100 text-xs font-medium tracking-wide uppercase">
            Order Confirmation
          </p>
        </div>

        {/* Floating checkmark icon */}
        <div className="flex justify-center -mt-9 relative z-10">
          <div
            className="w-[72px] h-[72px] rounded-full bg-white flex items-center justify-center"
            style={{
              border: '3px solid #22c55e',
              boxShadow: '0 0 0 6px #dcfce7',
            }}
          >
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pb-6 pt-3 text-center bg-white">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Order Placed Successfully!
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            Your order has been confirmed. Redirecting to your orders in{' '}
            <span className="font-semibold text-blue-600">{countdown}</span> seconds.
          </p>

          {/* Info pill */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 mb-5 text-left border border-gray-100">
            <Clock size={15} className="text-blue-500 flex-shrink-0" />
            <p className="text-xs text-gray-500">
              Estimated delivery:{' '}
              <span className="font-medium text-gray-700">3–5 business days</span>
            </p>
          </div>

          {/* Primary button */}
          <Link
            href={orderId ? `/home/UserProfile/orders/${orderId}` : '/home/UserProfile/orders'}
            className="block w-full mb-2.5"
          >
            <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold transition-colors">
              View Order Details
            </button>
          </Link>

          {/* Secondary button */}
          <Link href="/products" className="block w-full">
            <button className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 text-sm font-semibold transition-colors border border-gray-200">
              Continue Shopping
            </button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}