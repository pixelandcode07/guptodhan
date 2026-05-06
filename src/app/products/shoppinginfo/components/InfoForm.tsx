"use client"

import React, { useState, useEffect } from 'react'
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

// JSON Array string parsing for Initial Address Data
const extractCleanAddress = (rawAddress?: string) => {
  if (!rawAddress) return '';
  
  try {
    const parsedData = JSON.parse(rawAddress);
    if (Array.isArray(parsedData) && parsedData.length > 0) {
      if (parsedData[0].address) return parsedData[0].address;
    } else if (typeof parsedData === 'object' && parsedData !== null) {
      if (parsedData.address) return parsedData.address;
    }
  } catch (error) {
    if (rawAddress.includes('fullName:') || rawAddress.includes('address:')) {
      const match = rawAddress.match(/address:\s*([^,}]+)/);
      if (match && match[1]) {
        return match[1].replace(/["']/g, '').trim();
      }
    }
  }
  
  return rawAddress;
};

export default function InfoForm({ onFormDataChange, initialData, upazilas = [] }: InfoFormProps) {
  const { data: session } = useSession()
  const user = session?.user
  
  const [formData, setFormData] = useState<FormData>({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    district: initialData?.district || '',
    upazila: initialData?.upazila || '',
    address: extractCleanAddress(initialData?.address) || '',
    city: initialData?.city || '',
    postalCode: initialData?.postalCode || '',
    country: initialData?.country || 'Bangladesh'
  })

  // State for dynamic API districts
  const [apiDistricts, setApiDistricts] = useState<string[]>([])

  // Fetch Delivery Charges to get active districts directly from API
  useEffect(() => {
    const fetchApiDistricts = async () => {
      try {
        const res = await fetch('/api/v1/delivery-charge', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        });
        const data = await res.json();
        if (data?.data && Array.isArray(data.data)) {
          const fetchedDistricts = data.data.map((item: any) => item.districtName);
          const uniqueDistricts = Array.from(new Set(fetchedDistricts)).sort() as string[];
          setApiDistricts(uniqueDistricts);
        }
      } catch (err) {
        console.error("Failed to fetch districts from delivery-charge API", err);
      }
    };
    fetchApiDistricts();
  }, []);

  const handleDistrictChange = (districtName: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        district: districtName,
        upazila: '',
        city: districtName, // auto-fill city with district name as per previous logic
      }
      onFormDataChange(newData)
      return newData
    })
  }

  const handleUpazilaChange = (upazilaName: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        upazila: upazilaName,
      }
      onFormDataChange(newData)
      return newData
    })
  }

  const updateFormData = (field: keyof FormData, value: string) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onFormDataChange(newData)
  }

  const isFormValid = () => {
    return formData.name && formData.phone && formData.email && formData.district && formData.upazila && formData.address && formData.city && formData.postalCode && formData.country
  }

  return (
    <div className="space-y-5 rounded-lg bg-white p-4 sm:p-6 sm:space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Delivery Information</h1>
        {!user && (
          <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
            Login required to place order
          </div>
        )}
      </div>

      {/* Contact Information */}
      <section className="space-y-3">
        <h2 className="text-base font-medium text-gray-900 sm:text-lg">Contact Information</h2>
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
        <h2 className="text-base font-medium text-gray-900 sm:text-lg">Delivery Location</h2>
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
                {apiDistricts.map((district) => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upazila/Thana *</label>
            <Select 
              value={formData.upazila} 
              onValueChange={handleUpazilaChange}
              disabled={!user || !formData.district}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select upazila/thana" />
              </SelectTrigger>
              <SelectContent>
                {upazilas && upazilas.length > 0 ? (
                  upazilas.map((upazila) => (
                    <SelectItem key={upazila._id} value={upazila.upazilaThanaEnglish}>
                      {upazila.upazilaThanaEnglish} ({upazila.upazilaThanaBangla})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No Upazilas available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* City and Postal Code */}
      <section className="space-y-3">
        <h2 className="text-base font-medium text-gray-900 sm:text-lg">City & Postal Information</h2>
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
        <h2 className="text-base font-medium text-gray-900 sm:text-lg">Address Details</h2>
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