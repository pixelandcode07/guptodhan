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
import { AlertCircle, CheckCircle2, Loader2, Package, DollarSign, Heart, Users, TrendingUp, Phone, Mail, User, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

// ✅ Fixed: Proper TypeScript Types
interface DonationItem {
  id: string
  title: string
  image?: string
  type: string
}

interface DonationClaimModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  item?: DonationItem
}

interface IDonationCampaign {
  _id: string
  title: string
  description: string
  images: string[]
  item: string
  category?: { _id: string; name: string }
  creator?: { _id: string; name: string; profilePicture?: string }
  status?: string
  moderationStatus?: string
  goalAmount?: number
  raisedAmount?: number
  donorsCount?: number
  createdAt?: string
}

interface DonationDetailsClientProps {
  campaign: IDonationCampaign
}

// ✅ Modal Component (Same as before, kept for completeness)
function DonationClaimModal({ open, onOpenChange, item }: DonationClaimModalProps) {
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
    accountNumber: '',
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
        accountNumber: '',
      })
      setErrors({})
    }
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

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
    if (!session) {
      toast.error('Please login first to submit a request')
      onOpenChange(false)
      return
    }

    if (!validateForm()) {
      toast.error('Please fill all required fields correctly')
      return
    }

    try {
      setLoading(true)

      let finalReason = formData.reason.trim()
      if (item?.type === 'money') {
        finalReason += `\n\n━━━━━━━━━━━━━━━━━━━━\n💰 Money Request Details:\n━━━━━━━━━━━━━━━━━━━━\n• Amount: ${formData.amount} BDT\n• Payment Method: ${formData.paymentMethod.toUpperCase()}\n• Account Number: ${formData.accountNumber}`
      }

      const response = await fetch('/api/v1/donation-claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId: item?.id,
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          reason: finalReason,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold">Request submitted successfully!</p>
              <p className="text-sm text-slate-600 mt-1">We'll review your request and contact you soon.</p>
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
              <p className="text-sm text-slate-600 mt-1">{result.message || 'Failed to submit request'}</p>
            </div>
          </div>
        )
      }
    } catch (error) {
      console.error('Claim submission error:', error)
      toast.error('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const isMoney = item?.type === 'money'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full max-w-2xl p-0 max-h-[95vh] overflow-hidden rounded-xl flex flex-col">
        {/* Header - Fixed */}
        <DialogHeader className="px-4 sm:px-6 pt-6 pb-4 border-b bg-gradient-to-r from-blue-50 via-blue-50 to-indigo-50 flex-shrink-0">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isMoney 
                ? 'bg-gradient-to-br from-green-100 to-emerald-100' 
                : 'bg-gradient-to-br from-blue-100 to-indigo-100'
            }`}>
              {isMoney ? (
                <DollarSign className="text-green-600" size={24} />
              ) : (
                <Package className="text-blue-600" size={24} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900">
                {isMoney ? 'Request for Financial Aid' : 'Request for Donation Item'}
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-xs sm:text-sm text-slate-600">
                Fill out this form carefully. Our team will review and contact you within 2-3 business days.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="px-4 sm:px-6 py-6 space-y-6 overflow-y-auto flex-1">
          {/* Item Preview Card */}
          <div className="border-2 border-blue-100 rounded-lg p-3 sm:p-4 flex items-center gap-3 sm:gap-4 bg-blue-50/50 hover:bg-blue-50 transition-colors">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg bg-white overflow-hidden relative border border-blue-200 flex-shrink-0">
              {item?.image ? (
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Package className="text-slate-300" size={20} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug truncate">
                {item?.title ?? 'Unknown Item'}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                  isMoney 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {item?.type}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-slate-200">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">1</div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <User size={16} />
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`h-10 text-sm ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.name}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Phone size={16} />
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="01XXXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`h-10 text-sm ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Mail size={16} />
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`h-10 text-sm ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Money-Specific Fields */}
          {isMoney && (
            <div className="space-y-4 bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-5 rounded-lg border-2 border-green-200">
              <div className="flex items-center gap-2 pb-3 border-b-2 border-green-300">
                <div className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">2</div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Payment Details</h3>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-xs sm:text-sm font-semibold text-slate-700">
                  Amount Needed (BDT) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="e.g. 5000"
                  value={formData.amount}
                  onChange={handleChange}
                  className={`h-10 text-sm bg-white ${errors.amount ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.amount && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.amount}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Payment Method */}
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod" className="text-xs sm:text-sm font-semibold text-slate-700">
                    Payment Method <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(val) => setFormData({ ...formData, paymentMethod: val })}
                  >
                    <SelectTrigger id="paymentMethod" className="h-10 text-sm bg-white">
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

                {/* Account Number */}
                <div className="space-y-2">
                  <Label htmlFor="accountNumber" className="text-xs sm:text-sm font-semibold text-slate-700">
                    Account Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    placeholder="01XXX... or Account No"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className={`h-10 text-sm bg-white ${errors.accountNumber ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.accountNumber && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.accountNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Reason Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-slate-200">
              <div className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold flex-shrink-0 ${
                isMoney ? 'bg-blue-600' : 'bg-blue-600'
              }`}>
                {isMoney ? '3' : '2'}
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Tell Us Your Story</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason" className="text-xs sm:text-sm font-semibold text-slate-700">
                Describe Your Situation <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="Please explain in detail why you need this donation. Be honest and specific about your situation..."
                className={`min-h-32 resize-none text-sm ${errors.reason ? 'border-red-500 focus:border-red-500' : ''}`}
                value={formData.reason}
                onChange={handleChange}
              />
              {errors.reason && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.reason}
                </p>
              )}
              <p className="text-xs text-slate-500">
                Provide as much detail as possible to help us understand your needs better.
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
            <div className="text-xs sm:text-sm text-blue-800 leading-relaxed">
              <p className="font-semibold mb-2">Important Information:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>All requests are reviewed manually by our team</li>
                <li>You will be contacted via email or phone for verification</li>
                <li>False information may result in request rejection</li>
                <li>Processing time: 2-3 business days</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button - Fixed at bottom */}
        <div className="px-4 sm:px-6 pb-6 border-t bg-white flex-shrink-0">
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold h-11 sm:h-12 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 mt-4"
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

// ✅ Main Component - Professional & Responsive with Correct Alignment
export default function DonationDetailsClient({ campaign }: DonationDetailsClientProps) {
  const { data: session } = useSession()
  const [claimOpen, setClaimOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<DonationItem | undefined>(undefined)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const isOwner = session?.user && (session.user as any).id === campaign.creator?._id
  const progress =
    campaign.goalAmount && campaign.goalAmount > 0
      ? Math.round((campaign.raisedAmount || 0) / campaign.goalAmount * 100)
      : 0

  const handleRequestClick = () => {
    if (!session) {
      toast.error('Please login first to request this item')
      return
    }

    setSelectedItem({
      id: campaign._id,
      title: campaign.title,
      image: campaign.images?.[0] || '',
      type: campaign.item,
    })
    setClaimOpen(true)
  }

  const formatDate = (date: string | undefined) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* ✅ Alignment Fixed Matches JustForYou */}
      <div className="md:max-w-[95vw] xl:container mx-auto px-4 md:px-8 py-6 sm:py-8">
        <DonationClaimModal open={claimOpen} onOpenChange={setClaimOpen} item={selectedItem} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left: Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery - Hero Section */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200">
              <div className="relative aspect-video bg-gradient-to-br from-slate-200 to-slate-100 overflow-hidden group">
                {campaign.images && campaign.images.length > 0 ? (
                  <>
                    <Image
                      src={campaign.images[currentImageIndex]}
                      alt={campaign.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                    />
                    {campaign.images.length > 1 && (
                      <>
                        {/* Previous Button */}
                        <button
                          onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? campaign.images.length - 1 : prev - 1))}
                          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2.5 rounded-full transition-all z-10 group-hover:bg-black/70"
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={20} />
                        </button>

                        {/* Next Button */}
                        <button
                          onClick={() => setCurrentImageIndex((prev) => (prev === campaign.images.length - 1 ? 0 : prev + 1))}
                          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2.5 rounded-full transition-all z-10 group-hover:bg-black/70"
                          aria-label="Next image"
                        >
                          <ChevronRight size={20} />
                        </button>

                        {/* Dots Indicator */}
                        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 flex-wrap justify-center px-2">
                          {campaign.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`h-2 rounded-full transition-all duration-300 ${
                                idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 w-2 hover:bg-white/70'
                              }`}
                              aria-label={`Go to image ${idx + 1}`}
                            />
                          ))}
                        </div>

                        {/* Image Counter */}
                        <div className="absolute top-3 right-3 bg-black/60 px-3 py-1 rounded-full text-white text-xs font-semibold">
                          {currentImageIndex + 1} / {campaign.images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100">
                    <Package className="text-slate-400" size={64} />
                  </div>
                )}
              </div>
            </div>

            {/* Campaign Details Card */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-slate-200 space-y-6">
              {/* Title and Badges */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                  {campaign.title}
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  {campaign.category && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-semibold">
                      {campaign.category.name}
                    </Badge>
                  )}
                  <Badge className={`${
                    campaign.item === 'money' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-purple-100 text-purple-800'
                  } capitalize text-xs sm:text-sm font-semibold`}>
                    {campaign.item}
                  </Badge>
                  {campaign.status && (
                    <Badge className="bg-blue-600 text-white text-xs sm:text-sm font-semibold capitalize">
                      {campaign.status}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Meta Info */}
              {campaign.createdAt && (
                <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-600 border-y border-slate-200 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Posted {formatDate(campaign.createdAt)}</span>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="prose prose-sm sm:prose max-w-none text-slate-700 leading-relaxed">
                <div
                  dangerouslySetInnerHTML={{
                    __html: campaign.description || '<p>No description available.</p>',
                  }}
                  className="text-sm sm:text-base"
                />
              </div>

              {/* Creator Info - Enhanced */}
              {campaign.creator && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-xs text-slate-600 mb-3 font-semibold uppercase tracking-wide">Campaign Organizer</p>
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                      {campaign.creator.profilePicture ? (
                        <Image
                          src={campaign.creator.profilePicture}
                          alt={campaign.creator.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                          {campaign.creator.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-sm sm:text-base">{campaign.creator.name}</p>
                      <p className="text-xs text-slate-600">Donation Campaign Creator</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Stats & Action Sidebar */}
          <div className="space-y-6">
            {/* Sticky Stats Card */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-slate-200 space-y-6 sticky top-4">
              {/* Money Campaign Stats */}
              {campaign.item === 'money' && campaign.goalAmount && campaign.goalAmount > 0 && (
                <>
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                      <DollarSign size={20} className="text-green-600" />
                      Fundraising Progress
                    </h3>

                    {/* Amount Display */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-900">
                          ৳{(campaign.raisedAmount || 0).toLocaleString('bn-BD')}
                        </span>
                        <span className="text-sm font-semibold text-slate-600">
                          ৳{campaign.goalAmount.toLocaleString('bn-BD')}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-700 ease-out ${
                            progress >= 100 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>

                      {/* Progress Percentage */}
                      <div className="text-center pt-1">
                        <p className={`text-lg font-bold ${
                          progress >= 100 ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {progress}% Funded
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg text-center border border-blue-100">
                      <Users className="text-blue-600 mx-auto mb-2" size={20} />
                      <p className="text-xs text-slate-600 font-semibold mb-1">Supporters</p>
                      <p className="font-bold text-slate-900 text-xl">{campaign.donorsCount || 0}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg text-center border border-green-100">
                      <TrendingUp className="text-green-600 mx-auto mb-2" size={20} />
                      <p className="text-xs text-slate-600 font-semibold mb-1">Status</p>
                      <p className="font-bold text-slate-900 text-lg capitalize">
                        {campaign.status === 'completed' ? '✓ Done' : campaign.status || 'Active'}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Non-Money Campaign Stats */}
              {campaign.item !== 'money' && (
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-pink-100">
                    <Heart className="text-red-600" size={28} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-semibold mb-1">Total Requests</p>
                    <p className="text-4xl font-bold text-slate-900">{campaign.donorsCount || 0}</p>
                  </div>
                  <p className="text-xs text-slate-600">People have requested this item</p>
                </div>
              )}
            </div>

            {/* Action Button */}
            {isOwner ? (
              <Button
                className="w-full h-12 bg-slate-300 text-slate-700 cursor-not-allowed hover:bg-slate-300 font-bold text-base shadow-md"
                disabled
              >
                ✓ Your Campaign
              </Button>
            ) : (
              <Button
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
                onClick={handleRequestClick}
              >
                {campaign.item === 'money' ? '💰 Support Campaign' : '🎁 Request Item'}
              </Button>
            )}

            {/* Help Info Box */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                <div className="text-xs text-blue-900 space-y-2">
                  <p className="font-bold text-sm">How it works:</p>
                  <ul className="space-y-1.5">
                    <li className="flex gap-2">
                      <span className="font-bold">1.</span>
                      <span>Click the button above to start</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">2.</span>
                      <span>Fill out your details honestly</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">3.</span>
                      <span>Our team will review & contact you</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Safety Badge */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 text-center">
              <CheckCircle2 className="text-green-600 mx-auto mb-2" size={20} />
              <p className="text-xs text-green-900 font-semibold">
                ✓ All requests are verified
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}