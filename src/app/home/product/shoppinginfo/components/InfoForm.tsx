"use client"

import React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

export default function InfoForm() {
  const [sameAsBilling, setSameAsBilling] = React.useState(true)

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Shopping Information</h1>

      {/* Contact Information */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium text-gray-900">Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Full name" />
          <Input placeholder="Phone number" />
          <Input placeholder="Email address" className="md:col-span-2" />
        </div>
      </section>

      {/* Shipping Address */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Shipping address</h2>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Same as billing</span>
            <Switch checked={sameAsBilling} onCheckedChange={setSameAsBilling} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Country" />
          <Input placeholder="City" />
          <Input placeholder="Area" />
          <Input placeholder="Post code" />
          <Textarea placeholder="Street address" className="md:col-span-2 min-h-24" />
        </div>
      </section>

      {/* Delivery Method */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium text-gray-900">Delivery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <label className="flex items-center gap-2 p-3 border rounded-md cursor-pointer">
            <input type="radio" name="delivery" defaultChecked />
            <span>Standard delivery (3-5 days)</span>
          </label>
          <label className="flex items-center gap-2 p-3 border rounded-md cursor-pointer">
            <input type="radio" name="delivery" />
            <span>Express delivery (1-2 days)</span>
          </label>
        </div>
      </section>

      {/* Payment Method */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium text-gray-900">Payment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <label className="flex items-center gap-2 p-3 border rounded-md cursor-pointer">
            <input type="radio" name="payment" defaultChecked />
            <span>Cash on Delivery</span>
          </label>
          <label className="flex items-center gap-2 p-3 border rounded-md cursor-pointer">
            <input type="radio" name="payment" />
            <span>Credit/Debit Card</span>
          </label>
        </div>
      </section>

      <Button className="bg-blue-600 hover:bg-blue-700 text-white">Continue</Button>
    </div>
  )
}
