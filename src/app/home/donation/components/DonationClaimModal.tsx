"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState, useEffect } from 'react'
import { toast } from 'sonner' 

type DonationItem = { 
  id: string; 
  title: string; 
  image: string; 
  type: string; // 🔥 item type (money, clothes etc)
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
    reason: '',
    // 🔥 Money এর জন্য নতুন ফিল্ড
    amount: '',
    paymentMethod: 'bkash',
    accountNumber: ''
  })

  // মডাল ওপেন হলে বা আইটেম চেঞ্জ হলে ফর্ম রিসেট না হয়, কিন্তু টাইপ চেক করার জন্য এফেক্ট রাখা ভালো
  useEffect(() => {
    if (!open) {
        setFormData({ name: '', phone: '', email: '', reason: '', amount: '', paymentMethod: 'bkash', accountNumber: '' })
    }
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    // Basic Validation
    if (!formData.name || !formData.phone || !formData.email || !formData.reason) {
      toast.error("Please fill in basic information fields")
      return
    }
    if (formData.phone.length < 11) {
      toast.error("Invalid phone number")
      return
    }

    // 🔥 Money Validation
    if (item?.type === 'money') {
        if (!formData.amount || Number(formData.amount) <= 0) {
            toast.error("Please enter a valid amount")
            return
        }
        if (!formData.accountNumber) {
            toast.error("Please enter your account number to receive money")
            return
        }
    }

    try {
      setLoading(true)

      // Reason এর সাথে টাকার তথ্য যোগ করে দিচ্ছি (কারণ ব্যাকএন্ডে এই ফিল্ডগুলো নাও থাকতে পারে)
      // যদি ব্যাকএন্ড আপডেট করেন তবে আলাদা ফিল্ড পাঠাবেন।
      let finalReason = formData.reason;
      if (item?.type === 'money') {
          finalReason += `\n\n[Money Request Details]\nAmount: ${formData.amount} BDT\nMethod: ${formData.paymentMethod}\nAccount: ${formData.accountNumber}`;
      }

      const response = await fetch('/api/v1/donation-claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item?.id,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          reason: finalReason // 🔥 বিস্তারিত তথ্য এখানে যাচ্ছে
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Request submitted successfully!")
        onOpenChange(false)
      } else {
        toast.error(result.message || "Failed to submit request")
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            {item?.type === 'money' ? 'Request for Financial Aid' : 'Request for Donation Item'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 pb-6 space-y-4">
          {/* Item Preview */}
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
              <div className="text-xs text-gray-500 capitalize">Type: {item?.type}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-1">
                <div className="text-xs font-medium text-gray-600">Full Name <span className='text-red-500'>*</span></div>
                <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
             </div>
             <div className="space-y-1">
                <div className="text-xs font-medium text-gray-600">Phone <span className='text-red-500'>*</span></div>
                <Input name="phone" placeholder="01XXXXXXXXX" value={formData.phone} onChange={handleChange} />
             </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-600">Email <span className='text-red-500'>*</span></div>
            <Input name="email" type="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} />
          </div>

          {/* 🔥 Conditional Fields for Money */}
          {item?.type === 'money' && (
             <div className="bg-blue-50 p-4 rounded-md border border-blue-100 space-y-3">
                <h4 className="text-sm font-semibold text-blue-800">Payment Details</h4>
                
                <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-600">Amount Needed (BDT) <span className='text-red-500'>*</span></div>
                    <Input 
                        name="amount" 
                        type="number" 
                        placeholder="e.g. 5000" 
                        value={formData.amount} 
                        onChange={handleChange} 
                        className="bg-white"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-600">Payment Method <span className='text-red-500'>*</span></div>
                        <Select 
                            value={formData.paymentMethod} 
                            onValueChange={(val) => setFormData({...formData, paymentMethod: val})}
                        >
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bkash">Bkash</SelectItem>
                                <SelectItem value="nagad">Nagad</SelectItem>
                                <SelectItem value="rocket">Rocket</SelectItem>
                                <SelectItem value="bank">Bank Transfer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-600">Account Number <span className='text-red-500'>*</span></div>
                        <Input 
                            name="accountNumber" 
                            placeholder="01XXX... / Acc No" 
                            value={formData.accountNumber} 
                            onChange={handleChange} 
                            className="bg-white"
                        />
                    </div>
                </div>
             </div>
          )}
          
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-600">Reason / Situation <span className='text-red-500'>*</span></div>
            <Textarea 
              name="reason" 
              placeholder="Please describe why you need this donation..." 
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
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}