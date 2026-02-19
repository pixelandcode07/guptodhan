"use client"

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export default function OrderSuccessModal({ open, onOpenChange, orderId }: { open: boolean, onOpenChange: (v: boolean) => void, orderId?: string }) {
  const [countdown, setCountdown] = useState(3)
  const isOpenRef = useRef(open)

  // Update ref when open state changes
  useEffect(() => {
    isOpenRef.current = open
  }, [open])

  // Auto-redirect to user orders page after 3 seconds
  useEffect(() => {
    if (open) {
      setCountdown(3)
      
      const countdownTimer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer)
            // Only redirect if modal is still open
            if (isOpenRef.current) {
              window.location.href = '/home/UserProfile/orders'
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(countdownTimer)
    } else {
      // Reset countdown when modal is closed
      setCountdown(3)
    }
  }, [open])
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Order Placed Successfully</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <div className="p-8 text-center">
          <div className="mx-auto mb-6 w-24 h-24">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">Order Placed Successfully</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-4">
            Your order has been placed successfully. You will be redirected to your orders page in <span className="font-semibold text-blue-600">{countdown}</span> seconds to track your order status.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Or click the buttons below to navigate manually.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href={orderId ? `/home/UserProfile/orders/${orderId}` : '/home/UserProfile/orders'}>
              <Button variant="outline" className="min-w-[180px] h-11">View Details</Button>
            </Link>
            <Link href="/products">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white min-w-[220px] h-11">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
