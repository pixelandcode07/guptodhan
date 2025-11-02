"use client"

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import axios from 'axios'
// Removed unused FancyLoadingPage import - replaced with inline spinner

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
}

export default function InfoForm({ onFormDataChange, initialData }: InfoFormProps) {
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

  const [districts, setDistricts] = useState<District[]>([])
  const [upazilas, setUpazilas] = useState<Upazila[]>([])
  const [loading, setLoading] = useState(true)
  const [upazilaLoading, setUpazilaLoading] = useState(false)

  // Fetch districts from API
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/v1/upazila-thana')
        
        console.log('API Response:', response.data) // Debug log
        
        if (response.data.success && response.data.data) {
          // Extract unique districts from the response
          const uniqueDistricts = response.data.data.reduce((acc: District[], current: Upazila) => {
            if (!acc.find(item => item.district === current.district)) {
              acc.push({ district: current.district })
            }
            return acc
          }, [])
          
          console.log('Unique Districts:', uniqueDistricts) // Debug log
          setDistricts(uniqueDistricts)
        } else {
          console.error('API response not successful:', response.data)
          toast.error('Failed to load districts - invalid response')
        }
      } catch (error) {
        console.error('Error fetching districts:', error)
        toast.error('Failed to load districts')
        // Set some default districts as fallback
        setDistricts([
          { district: 'Dhaka' },
          { district: 'Chattogram' },
          { district: 'Sylhet' },
          { district: 'Rajshahi' },
          { district: 'Khulna' }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchDistricts()
  }, [])

  // Fetch upazilas when district changes
  const handleDistrictChange = async (districtName: string) => {
    try {
      setUpazilaLoading(true)
      
      // For now, we'll fetch all upazilas and filter by district
      // This is not optimal but works until we have a proper API route
      const response = await axios.get('/api/v1/upazila-thana')
      
      if (response.data.success && response.data.data) {
        // Filter upazilas by selected district
        const districtUpazilas = response.data.data.filter((upazila: Upazila) => 
          upazila.district === districtName
        )
        
        setUpazilas(districtUpazilas)
        
        // Update city and postal code based on selected district
        const cityName = districtName
        const postalCode = getPostalCodeByDistrict(districtName)
        
        // Reset upazila selection and update city when district changes
        setFormData(prev => ({
          ...prev,
          district: districtName,
          upazila: '',
          city: cityName,
          postalCode: postalCode
        }))
      }
    } catch (error) {
      console.error('Error fetching upazilas:', error)
      toast.error('Failed to load upazilas')
      // Set empty upazilas array as fallback
      setUpazilas([])
    } finally {
      setUpazilaLoading(false)
    }
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
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600">Loading districts...</p>
          </div>
        </div>
      ) : (
        <>
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
              disabled={!user || loading}
            >
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Loading districts..." : "Select district"} />
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
              disabled={!user || upazilaLoading || !formData.district}
            >
              <SelectTrigger>
                <SelectValue placeholder={upazilaLoading ? "Loading upazilas..." : "Select upazila/thana"} />
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
        </>
      )}
    </div>
  )
}
