"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner' 

type DonationItem = { 
  id: string; 
  title: string; 
  image: string; 
  category?: string 
}

interface DonationClaimModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item?: DonationItem;
}

export default function DonationClaimModal({ open, onOpenChange, item }: DonationClaimModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    reason: ''
  })

  // ইনপুট হ্যান্ডেল করার ফাংশন
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // সাবমিট হ্যান্ডেল করার ফাংশন
  const handleSubmit = async () => {
    // ১. বেসিক ভ্যালিডেশন (Frontend side)
    if (!formData.name || !formData.phone || !formData.email || !formData.reason) {
      toast.error("Please fill in all fields")
      return
    }
    if (formData.phone.length < 11) {
      toast.error("Phone number must be at least 11 characters")
      return
    }
    if (formData.reason.length < 10) {
      toast.error("Reason must be detailed (at least 10 chars)")
      return
    }

    try {
      setLoading(true)

      // ২. API কল করা হচ্ছে
      const response = await fetch('/api/v1/donation-claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Backend Validation (Zod) অনুযায়ী ডেটা পাঠানো হচ্ছে
        body: JSON.stringify({
          itemId: item?.id, // Backend expects 'itemId'
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          reason: formData.reason
        }),
      })

      const result = await response.json()

      // ৩. রেসপন্স হ্যান্ডলিং
      if (result.success) {
        toast.success("Request submitted successfully!")
        setFormData({ name: '', phone: '', email: '', reason: '' }) // ফর্ম ক্লিয়ার
        onOpenChange(false) // মডাল বন্ধ
      } else {
        // Zod বা সার্ভার এরর মেসেজ দেখানো
        if (Array.isArray(result.data)) {
           // যদি Zod থেকে multiple error আসে
           const messages = result.data.map((err: any) => err.message).join(', ');
           toast.error(messages);
        } else {
           // সাধারণ এরর মেসেজ
           toast.error(result.message || "Failed to submit request");
        }
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Request for Donation Item</DialogTitle>
        </DialogHeader>
        
        <div className="px-6 pb-6 space-y-4">
          {/* Item summary / Preview */}
          <div className="border rounded-md p-3 flex items-center gap-3 bg-gray-50">
            <div className="h-12 w-12 rounded bg-gray-200 overflow-hidden relative border border-gray-200">
              {item?.image ? (
                 <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-xs text-gray-400'>No Img</div>
              )}
            </div>
            <div className="text-sm">
              <div className="font-medium leading-5 text-gray-900">{item?.title ?? 'Unknown Item'}</div>
              <div className="text-xs text-gray-500">ID: {item?.id?.slice(-6) ?? '...'}</div>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-600">Full Name <span className='text-red-500'>*</span></div>
            <Input 
              name="name" 
              placeholder="eg. Yeamin Madbor" 
              value={formData.name} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-600">Phone Number <span className='text-red-500'>*</span></div>
            <Input 
              name="phone" 
              placeholder="eg. 01XXXXXXXXX" 
              value={formData.phone} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-600">Email Address <span className='text-red-500'>*</span></div>
            <Input 
              name="email" 
              type="email"
              placeholder="eg. example@email.com" 
              value={formData.email} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-600">Why do you need this? <span className='text-red-500'>*</span></div>
            <Textarea 
              name="reason" 
              placeholder="Please describe your situation shortly..." 
              className="min-h-24 resize-none" 
              value={formData.reason} 
              onChange={handleChange} 
            />
          </div>

          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                Submitting...
              </span>
            ) : 'Submit Request'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}