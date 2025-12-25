'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  Target,
  Share2,
  ShieldCheck,
  ArrowLeft,
  Users,
  Calendar,
} from 'lucide-react'
import DonationClaimModal from './DonationClaimModal'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Campaign {
  _id: string
  title: string
  description: string
  images?: string[]
  raisedAmount?: number
  goalAmount?: number
  donorsCount?: number
  createdAt: string
  category?: { name: string }
  creator?: { name: string }
  status?: 'active' | 'inactive' | 'completed'
  item?: 'money' | 'clothes' | 'food' | 'books' | 'other'
}

export default function DonationDetailsClient({ campaign }: { campaign: Campaign }) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // ✅ Safety check for campaign data
  if (!campaign || !campaign._id) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 font-bold">Failed to load donation data.</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 text-blue-600 hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const raised = campaign.raisedAmount || 0
  const goal = campaign.goalAmount || 0
  const percentage = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0
  const images = campaign.images || []
  const isMoney = campaign.item === 'money'
  const isActive = campaign.status === 'active'

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: campaign.title,
          text: campaign.description?.replace(/<[^>]*>/g, '').slice(0, 100),
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
      }
    } catch (error) {
      console.error('Share failed:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Navigation */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition-all font-medium group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Browse
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Gallery & Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-8 space-y-8"
        >
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={activeImage}
              className="relative h-[300px] md:h-[480px] w-full rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-200"
            >
              <Image
                src={images[activeImage] || '/img/placeholder.png'}
                alt={campaign.title || 'Campaign'}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
              />

              {/* Status Badge */}
              <Badge className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm px-4 py-1.5 font-semibold uppercase tracking-wider border-none shadow-lg">
                {campaign.category?.name || 'General'}
              </Badge>

              {/* Status Indicator */}
              {percentage >= 100 && (
                <Badge className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm px-4 py-1.5 font-semibold text-white flex items-center gap-2">
                  ✓ Goal Reached
                </Badge>
              )}

              {!isActive && percentage < 100 && (
                <Badge className="absolute top-4 right-4 bg-slate-500/90 backdrop-blur-sm px-4 py-1.5 font-semibold text-white">
                  Inactive
                </Badge>
              )}
            </motion.div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex gap-3 overflow-x-auto pb-2"
              >
                {images.map((img: string, idx: number) => (
                  <motion.button
                    key={`thumb-${idx}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImage === idx
                        ? 'border-blue-600 shadow-lg'
                        : 'border-transparent opacity-60 hover:opacity-80'
                    }`}
                  >
                    <Image 
                      src={img} 
                      alt={`Thumbnail ${idx + 1}`} 
                      fill 
                      className="object-cover" 
                      sizes="80px"
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Campaign Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-8 md:p-10 space-y-8">
                {/* Verification Badge */}
                <div className="flex items-center gap-2 text-green-600 font-semibold text-sm uppercase tracking-wide">
                  <ShieldCheck size={18} />
                  Verified by Guptodhan
                </div>

                {/* Title */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">
                    {campaign.title}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-slate-200 text-slate-600 text-sm">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-blue-600" />
                      <span>
                        <strong>{campaign.donorsCount || 0}</strong> {(campaign.donorsCount || 0) === 1 ? 'person' : 'people'} requested
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-blue-600" />
                      <span>
                        Posted{' '}
                        {campaign.createdAt
                          ? new Date(campaign.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'recently'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: campaign.description || 'No description provided.',
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN: Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4"
        >
          <div className="sticky top-24 space-y-6">
            {/* Progress Card */}
            <motion.div whileHover={{ y: -2 }} className="rounded-2xl overflow-hidden">
              <Card className="border border-slate-200 shadow-md bg-white">
                <CardContent className="p-8 space-y-8">
                  {/* Amount Section */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs uppercase font-bold text-slate-500 tracking-wide">
                        Amount Raised
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-slate-900">
                          ৳{raised.toLocaleString('en-BD')}
                        </span>
                        <span className="text-slate-400 font-semibold">raised</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 space-y-1">
                      <p className="text-xs uppercase font-bold text-slate-500 tracking-wide">
                        Target Amount
                      </p>
                      <p className="text-xl font-bold text-slate-900">
                        ৳{goal.toLocaleString('en-BD')}
                      </p>
                    </div>

                    {goal - raised > 0 && percentage < 100 && (
                      <div className="pt-2 space-y-1">
                        <p className="text-xs uppercase font-bold text-orange-600 tracking-wide">
                          Still Needed
                        </p>
                        <p className="text-lg font-bold text-orange-600">
                          ৳{(goal - raised).toLocaleString('en-BD')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                        Campaign Progress
                      </span>
                      <span className="text-2xl font-bold text-blue-600">{percentage}%</span>
                    </div>

                    <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg"
                      />
                    </div>

                    <p className="text-xs text-slate-500 font-medium">
                      {percentage >= 100 ? (
                        <span className="text-green-600 font-bold">✓ Goal reached!</span>
                      ) : (
                        `${percentage}% of ৳${goal.toLocaleString('en-BD')} collected`
                      )}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
                        onClick={() => setIsModalOpen(true)}
                        disabled={!isActive}
                      >
                        <Heart className="w-5 h-5 mr-2 fill-current" />
                        {isMoney ? 'Apply for Aid' : 'Claim Item'}
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className="w-full h-12 rounded-xl font-semibold border-slate-200 hover:border-blue-500 hover:bg-blue-50"
                        onClick={handleShare}
                      >
                        <Share2 size={18} className="mr-2" />
                        Share Campaign
                      </Button>
                    </motion.div>
                  </div>

                  {/* Verification Note */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex gap-4">
                    <ShieldCheck className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-xs text-slate-600 leading-snug">
                      <b>Verification Note:</b> Our team manually verifies every request to ensure transparency.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Organizer Card */}
            <motion.div whileHover={{ y: -2 }} className="rounded-2xl overflow-hidden">
              <Card className="border-none shadow-md rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <CardContent className="p-6 md:p-8 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Target size={24} className="text-blue-400" />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-1">Organizer</h3>
                    <p className="text-slate-300 text-sm">
                      Created by <strong>{campaign.creator?.name || 'Guptodhan Partner'}</strong>
                    </p>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-none rounded-lg font-semibold h-11">
                      Contact Support
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ✅ FIXED: Properly pass item data to modal */}
      <DonationClaimModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        item={{
          id: campaign._id,
          title: campaign.title,
          image: images[0] || undefined,
          type: campaign.item || 'money',
        }}
      />
    </div>
  )
}