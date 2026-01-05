"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { AlertCircle, CheckCircle2, Loader2, Package, DollarSign } from 'lucide-react'

type DonationItem = { 
  id: string; 
  title: string; 
  image?: string; 
  type: string; 
}

interface DonationClaimModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item?: DonationItem;
}

export default function DonationClaimModal({ open, onOpenChange, item }: DonationClaimModalProps) {
  const { data: session } = useSession()
  const token = (session as any)?.accessToken
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    reason: '',
    amount: '',
    paymentMethod: 'bkash',
    accountNumber: ''
  })

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({ 
        name: '', 
        phone: '', 
        email: '', 
        reason: '', 
        amount: '', 
        paymentMethod: 'bkash', 
        accountNumber: '' 
      })
      setErrors({})
    }
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // ✅ Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    } else if (!/^01[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format (01XXXXXXXXX)'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required'

    // Money-specific validation
    if (item?.type === 'money') {
      if (!formData.amount.trim()) {
        newErrors.amount = 'Amount is required'
      } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
        newErrors.amount = 'Amount must be a positive number'
      }
      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = 'Account number is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    // Check login
    if (!session) {
      toast.error("Please login first to submit a request")
      onOpenChange(false)
      return
    }

    // Validate form
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly")
      return
    }

    try {
      setLoading(true)

      // Build reason with money details if applicable
      let finalReason = formData.reason.trim()
      if (item?.type === 'money') {
        finalReason += `\n\n━━━━━━━━━━━━━━━━━━━━\n💰 Money Request Details:\n━━━━━━━━━━━━━━━━━━━━\n• Amount: ${formData.amount} BDT\n• Payment Method: ${formData.paymentMethod.toUpperCase()}\n• Account Number: ${formData.accountNumber}`
      }

      const response = await fetch('/api/v1/donation-claims', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          itemId: item?.id,
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          reason: finalReason 
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold">Request submitted successfully!</p>
              <p className="text-sm text-slate-600 mt-1">
                We'll review your request and contact you soon.
              </p>
            </div>
          </div>
        )
        onOpenChange(false)
      } else {
        toast.error(
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold">Submission failed</p>
              <p className="text-sm text-slate-600 mt-1">
                {result.message || "Failed to submit request"}
              </p>
            </div>
          </div>
        )
      }
    } catch (error) {
      console.error('Claim submission error:', error)
      toast.error("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const isMoney = item?.type === 'money'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3 mb-2">
            {isMoney ? (
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="text-green-600" size={20} />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="text-blue-600" size={20} />
              </div>
            )}
            <div>
              <DialogTitle className="text-xl">
                {isMoney ? 'Request for Financial Aid' : 'Request for Donation Item'}
              </DialogTitle>
              <DialogDescription className="mt-1">
                Fill out this form carefully. Our team will review and contact you.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="px-6 pb-6 space-y-5">
          {/* Item Preview Card */}
          <div className="border-2 border-blue-100 rounded-xl p-4 flex items-center gap-4 bg-blue-50/50">
            <div className="h-16 w-16 rounded-lg bg-white overflow-hidden relative border-2 border-blue-200 flex-shrink-0">
              {item?.image ? (
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              ) : (
                <div className='w-full h-full flex items-center justify-center'>
                  <Package className="text-slate-300" size={24} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-900 text-base leading-snug truncate">
                {item?.title ?? 'Unknown Item'}
              </div>
              <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-200 text-blue-800 rounded-full font-medium capitalize">
                  {item?.type}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 pb-2 border-b">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                  Full Name <span className='text-red-500'>*</span>
                </Label>
                <Input 
                  id="name"
                  name="name" 
                  placeholder="Enter your full name" 
                  value={formData.name} 
                  onChange={handleChange}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12}/> {errors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                  Phone Number <span className='text-red-500'>*</span>
                </Label>
                <Input 
                  id="phone"
                  name="phone" 
                  placeholder="01XXXXXXXXX" 
                  value={formData.phone} 
                  onChange={handleChange}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12}/> {errors.phone}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                Email Address <span className='text-red-500'>*</span>
              </Label>
              <Input 
                id="email"
                name="email" 
                type="email" 
                placeholder="your.email@example.com" 
                value={formData.email} 
                onChange={handleChange}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12}/> {errors.email}</p>}
            </div>
          </div>

          {/* Money-Specific Fields */}
          {isMoney && (
            <div className="space-y-4 bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-green-300">
                <span className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                Payment Details
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-xs font-semibold text-slate-700">
                  Amount Needed (BDT) <span className='text-red-500'>*</span>
                </Label>
                <Input 
                  id="amount"
                  name="amount" 
                  type="number" 
                  placeholder="e.g. 5000" 
                  value={formData.amount} 
                  onChange={handleChange} 
                  className={`bg-white ${errors.amount ? 'border-red-500' : ''}`}
                />
                {errors.amount && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12}/> {errors.amount}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod" className="text-xs font-semibold text-slate-700">
                    Payment Method <span className='text-red-500'>*</span>
                  </Label>
                  <Select 
                    value={formData.paymentMethod} 
                    onValueChange={(val) => setFormData({...formData, paymentMethod: val})}
                  >
                    <SelectTrigger id="paymentMethod" className="bg-white">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bkash">bKash</SelectItem>
                      <SelectItem value="nagad">Nagad</SelectItem>
                      <SelectItem value="rocket">Rocket</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accountNumber" className="text-xs font-semibold text-slate-700">
                    Account Number <span className='text-red-500'>*</span>
                  </Label>
                  <Input 
                    id="accountNumber"
                    name="accountNumber" 
                    placeholder="01XXX... or Account No" 
                    value={formData.accountNumber} 
                    onChange={handleChange} 
                    className={`bg-white ${errors.accountNumber ? 'border-red-500' : ''}`}
                  />
                  {errors.accountNumber && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12}/> {errors.accountNumber}</p>}
                </div>
              </div>
            </div>
          )}
          
          {/* Reason Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 pb-2 border-b">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                {isMoney ? '3' : '2'}
              </span>
              Why do you need this?
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-xs font-semibold text-slate-700">
                Describe Your Situation <span className='text-red-500'>*</span>
              </Label>
              <Textarea 
                id="reason"
                name="reason" 
                placeholder="Please explain in detail why you need this donation. Be honest and specific about your situation..." 
                className={`min-h-32 resize-none ${errors.reason ? 'border-red-500' : ''}`}
                value={formData.reason} 
                onChange={handleChange} 
              />
              {errors.reason && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12}/> {errors.reason}</p>}
              <p className="text-xs text-slate-500">
                Provide as much detail as possible to help us understand your needs better.
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
            <div className="text-xs text-blue-800 leading-relaxed">
              <p className="font-semibold mb-1">Important Information:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>All requests are reviewed manually by our team</li>
                <li>You'll be contacted via email or phone for verification</li>
                <li>False information may result in request rejection</li>
              </ul>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold h-12 text-base shadow-lg hover:shadow-xl transition-all" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Submitting Request...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2" size={18} />
                Submit Request
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}