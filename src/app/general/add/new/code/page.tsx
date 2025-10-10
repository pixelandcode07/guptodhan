"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import UploadImage from '@/components/ReusableComponents/UploadImage'
import { toast } from 'sonner'

export default function AddPromoCodePage() {
  const router = useRouter()
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endingDate, setEndingDate] = useState('')
  const [type, setType] = useState('')
  const [value, setValue] = useState('')
  const [minimumOrderAmount, setMinimumOrderAmount] = useState('')
  const [code, setCode] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async () => {
    if (isSubmitting) return
    
    try {
      setIsSubmitting(true)
      
      if (!title || !startDate || !endingDate || !type || !value || !code) {
        throw new Error('Please fill all required fields.')
      }

      if (!iconFile) {
        throw new Error('Please upload a promo code icon.')
      }

      const formData = new FormData()
      formData.append('promoCodeId', `PC-${Date.now()}`)
      formData.append('title', title)
      formData.append('startDate', startDate)
      formData.append('endingDate', endingDate)
      formData.append('type', type)
      formData.append('shortDescription', shortDescription)
      formData.append('value', value)
      formData.append('minimumOrderAmount', minimumOrderAmount || '0')
      formData.append('code', code)
      formData.append('status', 'active')
      formData.append('icon', iconFile)

      const res = await fetch('/api/v1/promo-code', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData?.message || 'Failed to create promo code')
      }

      toast.success('Promo code created successfully!')
      router.replace('/general/view/all/promo/codes')
    } catch (e: unknown) {
      const err = e as { message?: string }
      toast.error(err?.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Create Promo Code</h1>
                <p className="text-sm text-gray-600">Add a new discount code for your customers</p>
              </div>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6 sm:space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-3">
                <h3 className="text-sm sm:text-base font-medium text-gray-900">Basic Information</h3>
                <p className="text-xs text-gray-600">Enter the essential details</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Icon Upload */}
                <div className="lg:col-span-1">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Promo Icon *</Label>
                  <UploadImage
                    name="promo_icon"
                    onChange={(_name, file) => setIconFile(file)}
                  />
                </div>

                {/* Form Fields */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Title *</Label>
                    <Input 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-10 sm:h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      placeholder="25% OFF Promo"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Effective Date *</Label>
                      <Input 
                        type="date"
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)}
                        className="h-10 sm:h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Expiry Date *</Label>
                      <Input 
                        type="date"
                        value={endingDate} 
                        onChange={(e) => setEndingDate(e.target.value)}
                        className="h-10 sm:h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Type *</Label>
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="h-10 sm:h-11 border-gray-300 focus:border-green-500 focus:ring-green-500">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Percentage">Percentage</SelectItem>
                          <SelectItem value="Fixed Amount">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Value *</Label>
                      <Input 
                        type="number"
                        value={value} 
                        onChange={(e) => setValue(e.target.value)}
                        className="h-10 sm:h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        placeholder="Enter discount value"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Minimum Order Amount</Label>
                    <Input 
                      type="number"
                      value={minimumOrderAmount} 
                      onChange={(e) => setMinimumOrderAmount(e.target.value)}
                      className="h-10 sm:h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      placeholder="Enter minimum order amount"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Code *</Label>
                    <Input 
                      value={code} 
                      onChange={(e) => setCode(e.target.value)}
                      className="h-10 sm:h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      placeholder="SNNY22"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Short Description</Label>
                    <Textarea 
                      value={shortDescription} 
                      onChange={(e) => setShortDescription(e.target.value)}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      placeholder="During this sale, we're offering 25% OFF this summary. Make sure you don't miss it."
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-gray-200">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => router.back()}
                className="w-full sm:w-auto h-10 sm:h-11"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto h-10 sm:h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
              >
                {isSubmitting ? "Creating..." : "Create Promo Code"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


