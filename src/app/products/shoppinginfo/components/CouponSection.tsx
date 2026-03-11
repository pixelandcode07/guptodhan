"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { toast } from 'sonner'
import { X, Check, Loader2 } from 'lucide-react'

export interface AppliedCoupon {
  _id: string
  code: string
  value: number
  type: string
  title: string
  minimumOrderAmount: number
}

interface CouponSectionProps {
  subtotal: number
  onCouponApplied: (coupon: AppliedCoupon | null) => void
  appliedCoupon: AppliedCoupon | null
}

export default function CouponSection({ subtotal, onCouponApplied, appliedCoupon }: CouponSectionProps) {
  const [couponCode, setCouponCode] = useState('')
  const [validating, setValidating] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }

    setValidating(true)
    try {
      const response = await axios.get(`/api/v1/promo-code/code/${couponCode.trim()}`)
      
      if (response.data.success && response.data.data) {
        const promoCode = response.data.data
        
        // Validate promo code
        const now = new Date()
        const startDate = new Date(promoCode.startDate)
        const endingDate = new Date(promoCode.endingDate)
        
        // Check if promo code is active
        if (promoCode.status !== 'active') {
          toast.error('This coupon code is not active')
          return
        }
        
        // Check if promo code is within validity period
        if (now < startDate) {
          toast.error('This coupon code is not yet valid')
          return
        }
        
        if (now > endingDate) {
          toast.error('This coupon code has expired')
          return
        }
        
        // Check if order meets minimum order amount
        if (subtotal < promoCode.minimumOrderAmount) {
          toast.error(
            `This coupon requires a minimum order of ৳ ${promoCode.minimumOrderAmount.toLocaleString()}`
          )
          return
        }
        
        // Apply coupon
        const appliedCouponData: AppliedCoupon = {
          _id: promoCode._id,
          code: promoCode.code,
          value: promoCode.value,
          type: promoCode.type,
          title: promoCode.title,
          minimumOrderAmount: promoCode.minimumOrderAmount,
        }
        
        onCouponApplied(appliedCouponData)
        toast.success('Coupon applied successfully!', {
          description: `${promoCode.title} - ${promoCode.shortDescription || ''}`,
          duration: 3000,
        })
        setCouponCode('')
      } else {
        toast.error('Invalid coupon code')
      }
    } catch (error: unknown) {
      console.error('Error applying coupon:', error)
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to validate coupon code'
      toast.error('Coupon validation failed', {
        description: errorMessage,
        duration: 4000,
      })
    } finally {
      setValidating(false)
    }
  }

  const handleRemoveCoupon = () => {
    onCouponApplied(null)
    setCouponCode('')
    toast.success('Coupon removed')
  }

  const calculateDiscount = (): number => {
    if (!appliedCoupon) return 0
    
    // Handle both "Percentage" and "percentage" formats (case-insensitive)
    const typeLower = appliedCoupon.type.toLowerCase().trim()
    const isPercentage = typeLower === 'percentage' || typeLower.includes('percentage')
    
    if (isPercentage) {
      // Percentage discount - value from API is the percentage (e.g., 10 for 10%)
      const discount = (subtotal * appliedCoupon.value) / 100
      return Math.round(discount * 100) / 100 // Round to 2 decimal places
    } else {
      // Fixed amount discount - value from API is the fixed amount
      return Math.min(appliedCoupon.value, subtotal) // Don't exceed subtotal
    }
  }

  const discount = calculateDiscount()

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900">Apply Coupon</h3>
      
      {appliedCoupon ? (
        // Coupon Applied State
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">{appliedCoupon.code}</p>
                <p className="text-xs text-green-600">{appliedCoupon.title}</p>
                <p className="text-xs text-green-700 mt-1">
                  Discount: {(appliedCoupon.type.toLowerCase().trim() === 'percentage' || appliedCoupon.type.toLowerCase().includes('percentage'))
                    ? `${appliedCoupon.value}%` 
                    : `৳ ${appliedCoupon.value.toLocaleString()}`}
                  {' '}(-৳ {discount.toLocaleString()})
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveCoupon}
              className="text-green-700 hover:text-green-900 hover:bg-green-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        // Coupon Input State
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !validating) {
                handleApplyCoupon()
              }
            }}
            disabled={validating}
            className="flex-1"
          />
          <Button
            onClick={handleApplyCoupon}
            disabled={validating || !couponCode.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {validating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              'Apply'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

