"use client"

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSession } from 'next-auth/react'

interface District {
  district: string
}

interface Upazila {
  _id: string
  district: string
  upazilaThanaEnglish: string
  upazilaThanaBangla: string
  websiteLink: string
  createdAt: string
}

interface FormData {
  name: string
  phone: string
  email: string
  district: string
  upazila: string
  address: string
  city: string
  postalCode: string
  country: string
}

interface InfoFormProps {
  onFormDataChange: (data: FormData) => void
  initialData?: Partial<FormData>
  districts?: District[]
  upazilas?: Upazila[]
}

export default function InfoForm({ onFormDataChange, initialData, districts = [], upazilas = [] }: InfoFormProps) {
  const { data: session } = useSession()
  const user = session?.user
  
  const [formData, setFormData] = useState<FormData>({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    district: initialData?.district || '',
    upazila: initialData?.upazila || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    postalCode: initialData?.postalCode || '',
    country: initialData?.country || 'Bangladesh'
  })

  // Handle district change - update city, postal code, and reset upazila
  const handleDistrictChange = (districtName: string) => {
    const cityName = districtName
    const postalCode = getPostalCodeByDistrict(districtName)
    
    // Reset upazila selection and update city when district changes
    setFormData(prev => {
      const newData = {
        ...prev,
        district: districtName,
        upazila: '',
        city: cityName,
        postalCode: postalCode
      }
      onFormDataChange(newData)
      return newData
    })
  }

  // Helper function to get postal code based on district name
  const getPostalCodeByDistrict = (districtName: string) => {
    const postalCodeMap: { [key: string]: string } = {
      'Dhaka': '1000',
      'Chattogram': '4000',
      'Sylhet': '3100',
      'Rajshahi': '6000',
      'Khulna': '9000',
      'Barishal': '8200',
      'Rangpur': '5400',
      'Mymensingh': '2200',
      'Cumilla': '3500',
      'Bogura': '5800',
      'Jessore': '7400',
      'Dinajpur': '5200',
      'Tangail': '1900',
      'Kushtia': '7000',
      'Pabna': '6600',
      'Faridpur': '7800',
      'Narayanganj': '1400',
      'Gazipur': '1700',
      'Chandpur': '3600',
      'Lakshmipur': '3700'
    }
    
    return postalCodeMap[districtName] || '1000'
  }

  // Update form data and notify parent
  const updateFormData = (field: keyof FormData, value: string) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onFormDataChange(newData)
  }

  // Check if form is valid
  const isFormValid = () => {
    return formData.name && formData.phone && formData.email && formData.district && formData.upazila && formData.address && formData.city && formData.postalCode && formData.country
  }

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Delivery Information</h1>
        {!user && (
          <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
            Login required to place order
          </div>
        )}
      </div>

      {/* Contact Information */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <Input 
              placeholder="Enter your full name" 
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              disabled={!user}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <Input 
              placeholder="Enter your phone number" 
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              disabled={!user}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <Input 
              placeholder="Enter your email address" 
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              disabled={!user}
            />
          </div>
        </div>
      </section>

      {/* Location Information */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium text-gray-900">Delivery Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
            <Select 
              value={formData.district} 
              onValueChange={handleDistrictChange}
              disabled={!user}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district.district} value={district.district}>
                    {district.district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upazila/Thana *</label>
            <Select 
              value={formData.upazila} 
              onValueChange={(value) => updateFormData('upazila', value)}
              disabled={!user || !formData.district}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select upazila/thana" />
              </SelectTrigger>
              <SelectContent>
                {upazilas.map((upazila) => (
                  <SelectItem key={upazila._id} value={upazila.upazilaThanaEnglish}>
                    {upazila.upazilaThanaEnglish} ({upazila.upazilaThanaBangla})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* City and Postal Code */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium text-gray-900">City & Postal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <Input 
              placeholder="City name" 
              value={formData.city}
              onChange={(e) => updateFormData('city', e.target.value)}
              disabled={!user}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
            <Input 
              placeholder="Postal code" 
              value={formData.postalCode}
              onChange={(e) => updateFormData('postalCode', e.target.value)}
              disabled={!user}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
            <Input 
              placeholder="Country" 
              value={formData.country}
              onChange={(e) => updateFormData('country', e.target.value)}
              disabled={!user}
            />
          </div>
        </div>
      </section>

      {/* Address Details */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium text-gray-900">Address Details</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
          <Textarea 
            placeholder="Enter your detailed address (house number, road, area)" 
            className="min-h-24"
            value={formData.address}
            onChange={(e) => updateFormData('address', e.target.value)}
            disabled={!user}
          />
        </div>
      </section>

      {/* Login Required Message */}
      {!user && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
            <div className="text-sm">
              <p className="font-medium text-orange-800">Login Required</p>
              <p className="text-orange-700 text-xs mt-1">
                Please login or register to fill out the delivery information and place your order.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form Status */}
      {user && (
        <div className="text-sm text-gray-600">
          {isFormValid() ? (
            <span className="text-green-600">✓ All required information provided</span>
          ) : (
            <span className="text-orange-600">Please fill in all required fields</span>
          )}
        </div>
      )}
    </div>
  )
}
