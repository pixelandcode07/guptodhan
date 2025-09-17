"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function OrderSuccessModal({ open, onOpenChange, orderId }: { open: boolean, onOpenChange: (v: boolean) => void, orderId?: string }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden">
        <div className="p-8 text-center">
          <div className="mx-auto mb-6 w-24 h-24">
            <Image src="/img/Group.png" alt="success" width={96} height={96} className="mx-auto" />
          </div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">Order Placed Successfully</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Your order has been placed successfully. Go to My Order to track your order
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href={orderId ? `/home/UserProfile/orders/${orderId}` : '/home/UserProfile/orders'}>
              <Button variant="outline" className="min-w-[180px] h-11">View Details</Button>
            </Link>
            <Link href="/home/product/filter">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white min-w-[220px] h-11">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
