"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Target, Share2, ShieldCheck, ArrowLeft, Users, Calendar } from "lucide-react"
import DonationClaimModal from "./DonationClaimModal"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function DonationDetailsClient({ campaign }: { campaign: any }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => { setMounted(true) }, []);
  if (!mounted) return null;

  // 100% Dynamic Data Mapping
  const raised = campaign?.raisedAmount || 0;
  const goal = campaign?.goalAmount || 0;
  const percentage = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;
  const images = campaign?.images || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Navigation */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition-all font-medium">
        <ArrowLeft size={18} /> Back to Browse
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Gallery & Info */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="relative h-[300px] md:h-[480px] w-full rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-200"
            >
              <Image src={images[activeImage] || '/img/placeholder.png'} alt={campaign.title} fill className="object-cover" priority />
              <Badge className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm px-4 py-1 font-semibold uppercase tracking-wider border-none">
                {campaign.category?.name || "General"}
              </Badge>
            </motion.div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img: string, idx: number) => (
                  <button key={idx} onClick={() => setActiveImage(idx)} className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-blue-600' : 'border-transparent opacity-60'}`}>
                    <Image src={img} alt="thumb" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-green-600 font-semibold text-sm mb-4 uppercase tracking-wide">
              <ShieldCheck size={18} /> Verified by Guptodhan
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">
              {campaign.title}
            </h1>
            <div className="flex gap-6 mb-8 text-slate-500 text-sm border-b pb-6">
              <div className="flex items-center gap-2"><Users size={16}/> {campaign.donorsCount || 0} Requests</div>
              <div className="flex items-center gap-2"><Calendar size={16}/> Posted {new Date(campaign.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-normal">
              <div dangerouslySetInnerHTML={{ __html: campaign.description }} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar (Progress & Action) */}
        <div className="lg:col-span-4">
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="sticky top-24 space-y-6">
            <Card className="border border-slate-200 shadow-md rounded-2xl overflow-hidden bg-white">
              <CardContent className="p-8 space-y-8">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-900">৳{raised.toLocaleString()}</span>
                    <span className="text-slate-400 font-semibold">raised</span>
                  </div>
                  <p className="text-slate-500 text-sm font-medium">Targeting <b>৳{goal.toLocaleString()}</b></p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold text-blue-600 uppercase tracking-wide">
                    <span>Campaign Progress</span>
                    <span>{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-2 bg-slate-100" />
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-100"
                    onClick={() => setIsModalOpen(true)}
                    disabled={campaign.status === 'completed'}
                  >
                    <Heart className="w-5 h-5 mr-2 fill-current" /> 
                    {campaign.item === 'money' ? 'Apply for Aid' : 'Claim Item'}
                  </Button>
                  <Button variant="outline" className="w-full h-12 rounded-xl font-semibold border-slate-200" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied!");
                  }}>
                    <Share2 size={18} className="mr-2" /> Share Campaign
                  </Button>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex gap-4">
                  <ShieldCheck className="text-blue-600 shrink-0" size={24} />
                  <p className="text-xs text-slate-500 leading-snug">
                    <b>Verification Note:</b> Our team manually verifies every request to ensure transparency.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl bg-slate-900 text-white p-6">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                  <Target size={20} className="text-blue-400" />
                </div>
                <h3 className="font-bold mb-2">Organizer Information</h3>
                <p className="text-slate-400 text-xs mb-4">Organized by {campaign.creator?.name || "Guptodhan Partner"}</p>
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-none rounded-lg font-semibold h-10">Contact Support</Button>
            </Card>
          </motion.div>
        </div>
      </div>

      <DonationClaimModal 
        open={isModalOpen} onOpenChange={setIsModalOpen}
        item={{ id: campaign._id, title: campaign.title, image: images[0] || '', type: campaign.item }}
      />
    </div>
  )
}