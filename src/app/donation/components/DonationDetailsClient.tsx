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
import { AlertCircle, CheckCircle2, Loader2, Package, DollarSign, Heart, Users, TrendingUp, Phone, Mail, User, ChevronLeft, ChevronRight, Calendar, HandHeart, X } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import LogInRegister from '@/app/components/LogInAndRegister/LogIn_Register'

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
  onLoginRequired: () => void
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

function DonationClaimModal({ open, onOpenChange, item, onLoginRequired }: DonationClaimModalProps) {
  const { data: session } = useSession()
  const token = (session as any)?.accessToken
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', reason: '',
    amount: '', paymentMethod: 'bkash', accountNumber: '',
  })

  useEffect(() => {
    if (!open) {
      setFormData({ name: '', phone: '', email: '', reason: '', amount: '', paymentMethod: 'bkash', accountNumber: '' })
      setErrors({})
    }
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.phone.trim()) { newErrors.phone = 'Phone is required' }
    else if (!/^01[0-9]{9}$/.test(formData.phone)) { newErrors.phone = 'Invalid phone format (01XXXXXXXXX)' }
    if (!formData.email.trim()) { newErrors.email = 'Email is required' }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { newErrors.email = 'Invalid email format' }
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required'
    if (item?.type === 'money') {
      if (!formData.amount.trim()) { newErrors.amount = 'Amount is required' }
      else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) { newErrors.amount = 'Amount must be a positive number' }
      if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!session) {
      onOpenChange(false)
      setTimeout(() => onLoginRequired(), 200)
      return
    }
    if (!validateForm()) { toast.error('Please fill all required fields correctly'); return }
    try {
      setLoading(true)
      let finalReason = formData.reason.trim()
      if (item?.type === 'money') {
        finalReason += `\n\nAmount: ${formData.amount} BDT\nMethod: ${formData.paymentMethod.toUpperCase()}\nAccount: ${formData.accountNumber}`
      }
      const response = await fetch('/api/v1/donation-claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ itemId: item?.id, name: formData.name.trim(), phone: formData.phone.trim(), email: formData.email.trim(), reason: finalReason }),
      })
      const result = await response.json()
      if (result.success) {
        toast.success('Request submitted successfully!')
        onOpenChange(false)
      } else {
        toast.error(result.message || 'Failed to submit request')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isMoney = item?.type === 'money'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full max-w-lg p-0 max-h-[92vh] overflow-hidden rounded-2xl flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isMoney ? 'bg-emerald-50' : 'bg-blue-50'}`}>
              {isMoney ? <DollarSign className="text-emerald-600" size={20} /> : <Package className="text-blue-600" size={20} />}
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-gray-900">
                {isMoney ? 'Request Financial Aid' : 'Request Donation Item'}
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 mt-0.5">
                Our team will review and contact you within 2-3 business days.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="h-12 w-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-white">
              {item?.image
                ? <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><Package className="text-gray-300" size={18} /></div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{item?.title ?? 'Unknown Item'}</p>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${isMoney ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                {item?.type}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Personal Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5"><User size={12} /> Full Name <span className="text-red-500">*</span></Label>
                <Input name="name" placeholder="Your full name" value={formData.name} onChange={handleChange} className={`h-9 text-sm ${errors.name ? 'border-red-400' : ''}`} />
                {errors.name && <p className="text-[11px] text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5"><Phone size={12} /> Phone <span className="text-red-500">*</span></Label>
                <Input name="phone" placeholder="01XXXXXXXXX" value={formData.phone} onChange={handleChange} className={`h-9 text-sm ${errors.phone ? 'border-red-400' : ''}`} />
                {errors.phone && <p className="text-[11px] text-red-500">{errors.phone}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5"><Mail size={12} /> Email <span className="text-red-500">*</span></Label>
              <Input name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} className={`h-9 text-sm ${errors.email ? 'border-red-400' : ''}`} />
              {errors.email && <p className="text-[11px] text-red-500">{errors.email}</p>}
            </div>
          </div>

          {isMoney && (
            <div className="space-y-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Details</h3>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">Amount Needed (BDT) <span className="text-red-500">*</span></Label>
                <Input name="amount" type="number" placeholder="e.g. 5000" value={formData.amount} onChange={handleChange} className={`h-9 text-sm bg-white ${errors.amount ? 'border-red-400' : ''}`} />
                {errors.amount && <p className="text-[11px] text-red-500">{errors.amount}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-700">Payment Method <span className="text-red-500">*</span></Label>
                  <Select value={formData.paymentMethod} onValueChange={(val) => setFormData({ ...formData, paymentMethod: val })}>
                    <SelectTrigger className="h-9 text-sm bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bkash">bKash</SelectItem>
                      <SelectItem value="nagad">Nagad</SelectItem>
                      <SelectItem value="rocket">Rocket</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-700">Account Number <span className="text-red-500">*</span></Label>
                  <Input name="accountNumber" placeholder="01XXX..." value={formData.accountNumber} onChange={handleChange} className={`h-9 text-sm bg-white ${errors.accountNumber ? 'border-red-400' : ''}`} />
                  {errors.accountNumber && <p className="text-[11px] text-red-500">{errors.accountNumber}</p>}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-700">Your Situation <span className="text-red-500">*</span></Label>
            <Textarea
              name="reason"
              placeholder="Explain why you need this donation. Be honest and specific..."
              className={`min-h-28 resize-none text-sm ${errors.reason ? 'border-red-400' : ''}`}
              value={formData.reason}
              onChange={handleChange}
            />
            {errors.reason && <p className="text-[11px] text-red-500">{errors.reason}</p>}
          </div>

          <div className="flex gap-2.5 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800">
            <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={14} />
            <p>All requests are reviewed manually. You will be contacted for verification. Processing time: 2-3 business days.</p>
          </div>
        </div>

        <div className="px-6 pb-5 pt-3 border-t bg-white flex-shrink-0">
          <Button onClick={handleSubmit} disabled={loading}
            className="w-full h-11 bg-[#00005E] hover:bg-[#000045] text-white font-bold rounded-xl text-sm">
            {loading ? <><Loader2 className="animate-spin mr-2" size={16} />Submitting...</> : <><CheckCircle2 className="mr-2" size={16} />Submit Request</>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function DonationDetailsClient({ campaign }: DonationDetailsClientProps) {
  const { data: session } = useSession()
  const [claimOpen, setClaimOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<DonationItem | undefined>(undefined)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const isOwner = session?.user && (session.user as any).id === campaign.creator?._id
  const progress = campaign.goalAmount && campaign.goalAmount > 0
    ? Math.round((campaign.raisedAmount || 0) / campaign.goalAmount * 100) : 0

  // ✅ Here is the logic: if not logged in, show Login Modal
  const handleRequestClick = () => {
    if (!session) {
      setLoginOpen(true)
      return
    }
    setSelectedItem({ id: campaign._id, title: campaign.title, image: campaign.images?.[0] || '', type: campaign.item })
    setClaimOpen(true)
  }

  const formatDate = (date: string | undefined) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ✅ Login Modal — fixed overlay, Dialog এর উপর নির্ভর করে না */}
      {/* Note: Wrapped LogInRegister inside Dialog so shadcn UI doesn't crash */}
      <AnimatePresence>
        {loginOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLoginOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLoginOpen(false)}
                className="absolute top-3 right-3 z-20 p-1.5 bg-white/80 hover:bg-white rounded-full shadow transition-colors"
              >
                <X size={16} className="text-gray-600" />
              </button>
              
              <Dialog open={true} onOpenChange={setLoginOpen}>
                <LogInRegister />
              </Dialog>
              
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="md:max-w-[95vw] xl:container mx-auto px-4 md:px-8 py-8">
        <DonationClaimModal
          open={claimOpen}
          onOpenChange={setClaimOpen}
          item={selectedItem}
          onLoginRequired={() => setLoginOpen(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* ======================== */}
          {/* LEFT: Image + Details    */}
          {/* ======================== */}
          <div className="lg:col-span-2 space-y-5">

            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="relative w-full bg-gray-100" style={{ aspectRatio: '16/10' }}>
                {campaign.images?.length > 0 ? (
                  <>
                    <img
                      src={campaign.images[currentImageIndex]}
                      alt={campaign.title}
                      className="w-full h-full object-contain"
                    />
                    {campaign.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => prev === 0 ? campaign.images.length - 1 : prev - 1)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all z-10"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => prev === campaign.images.length - 1 ? 0 : prev + 1)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all z-10"
                        >
                          <ChevronRight size={18} />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {campaign.images.map((_, idx) => (
                            <button key={idx} onClick={() => setCurrentImageIndex(idx)}
                              className={`h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-5' : 'bg-white/50 w-1.5'}`}
                            />
                          ))}
                        </div>
                        <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                          {currentImageIndex + 1} / {campaign.images.length}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="text-gray-300" size={56} />
                  </div>
                )}
              </div>

              {campaign.images?.length > 1 && (
                <div className="flex gap-2 p-3 border-t border-gray-100 overflow-x-auto">
                  {campaign.images.map((img, idx) => (
                    <button key={idx} onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex ? 'border-[#00005E]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Campaign Details */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 space-y-5">
              <div className="flex flex-wrap gap-2">
                {campaign.category && (
                  <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                    {campaign.category.name}
                  </span>
                )}
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize
                  ${campaign.item === 'money' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                  {campaign.item === 'money' ? '💸 Fund' : '📦 Item'}
                </span>
                {campaign.status && (
                  <span className="text-xs font-semibold px-3 py-1 bg-gray-50 text-gray-600 rounded-full border border-gray-100 capitalize">
                    {campaign.status}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {campaign.title}
              </h1>

              {campaign.createdAt && (
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Calendar size={14} />
                  <span>{formatDate(campaign.createdAt)}</span>
                </div>
              )}

              <div className="h-px bg-gray-100" />

              <div
                dangerouslySetInnerHTML={{ __html: campaign.description || '<p>No description available.</p>' }}
                className="text-sm sm:text-base text-gray-600 leading-relaxed prose prose-sm max-w-none"
              />

              {campaign.creator && (
                <>
                  <div className="h-px bg-gray-100" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-100">
                      {campaign.creator.profilePicture ? (
                        <img src={campaign.creator.profilePicture} alt={campaign.creator.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#00005E] text-white font-bold text-sm">
                          {campaign.creator.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{campaign.creator.name}</p>
                      <p className="text-xs text-gray-400">Campaign Organizer</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ======================== */}
          {/* RIGHT: Sidebar           */}
          {/* ======================== */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-5 sticky top-4">

              {campaign.item === 'money' && campaign.goalAmount && campaign.goalAmount > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <DollarSign size={16} className="text-emerald-600" /> Fundraising Progress
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-emerald-600">৳{(campaign.raisedAmount || 0).toLocaleString()}</span>
                      <span className="text-gray-400">৳{campaign.goalAmount.toLocaleString()}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full rounded-full ${progress >= 100 ? 'bg-emerald-500' : 'bg-[#00005E]'}`}
                      />
                    </div>
                    <p className="text-xs text-gray-400 text-right">{progress}% funded</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                      <Users className="text-[#00005E] mx-auto mb-1" size={16} />
                      <p className="text-[10px] text-gray-400 font-semibold mb-0.5">Supporters</p>
                      <p className="font-bold text-gray-900">{campaign.donorsCount || 0}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                      <TrendingUp className="text-emerald-500 mx-auto mb-1" size={16} />
                      <p className="text-[10px] text-gray-400 font-semibold mb-0.5">Status</p>
                      <p className="font-bold text-gray-900 text-sm capitalize">
                        {campaign.status === 'completed' ? '✓ Done' : campaign.status || 'Active'}
                      </p>
                    </div>
                  </div>
                  <div className="h-px bg-gray-100" />
                </div>
              )}

              {campaign.item !== 'money' && (
                <div className="text-center py-2 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                    <Heart className="text-red-500" size={22} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{campaign.donorsCount || 0}</p>
                    <p className="text-xs text-gray-400 mt-0.5">people requested this item</p>
                  </div>
                  <div className="h-px bg-gray-100" />
                </div>
              )}

              {isOwner ? (
                <button disabled className="w-full py-3 bg-gray-50 text-gray-400 text-sm font-semibold rounded-xl cursor-not-allowed border border-gray-100">
                  ✓ Your Campaign
                </button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRequestClick} // This securely redirects to Login if not signed in
                  className="w-full py-3 bg-[#00005E] hover:bg-[#000045] text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <HandHeart size={16} />
                  {campaign.item === 'money' ? 'Support Campaign' : 'Request Item'}
                </motion.button>
              )}

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 space-y-2.5">
                <p className="text-xs font-bold text-gray-700">How it works</p>
                {[
                  "Click the button to submit a request",
                  "Fill your details honestly",
                  "Our team reviews & contacts you",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-gray-600">
                    <span className="w-4 h-4 rounded-full bg-[#00005E] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-emerald-600 font-semibold">
                <CheckCircle2 size={14} />
                All requests are manually verified
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}