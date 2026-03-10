"use client"

import DonationModal from './DonationModal'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import DonationClaimModal from './DonationClaimModal'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Package, RefreshCw, LayoutGrid, MapPin, Heart, HandHeart } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface DonationCampaign {
    _id: string;
    title: string;
    images: string[];
    item: string;
    category?: { _id: string; name: string; };
    description?: string;
    createdAt?: string;
    creator?: { _id: string; name: string };
    status?: string;
    moderationStatus?: string;
    goalAmount?: number;
    raisedAmount?: number;
}

interface DonationCategory {
    _id: string;
    name: string;
    icon: string;
    status: string;
}

interface DonationHomeProps {
    initialCampaigns: DonationCampaign[];
    initialCategories: DonationCategory[];
}

export default function DonationHome({ initialCampaigns, initialCategories }: DonationHomeProps) {
    const { data: session } = useSession()
    const [campaigns, setCampaigns] = useState<DonationCampaign[]>(initialCampaigns)
    const [category, setCategory] = useState<string>('all')
    const [displayCount, setDisplayCount] = useState<number>(8)
    const [claimOpen, setClaimOpen] = useState<boolean>(false)
    const [selectedItem, setSelectedItem] = useState<{ id: string, title: string, image: string, type: string } | undefined>(undefined)
    const [loading, setLoading] = useState(false)

    const activeCategories = initialCategories.filter((c) => c.status === 'active');

    const refreshCampaigns = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/v1/public/donation-campaigns');
            const result = await response.json();
            if (result.success && result.data) {
                const activeCampaigns = result.data.filter((camp: DonationCampaign) =>
                    camp.moderationStatus === 'approved' && camp.status === 'active'
                );
                setCampaigns(activeCampaigns);
                if (activeCampaigns.length === 0) {
                    toast.info('No active donation campaigns available at the moment');
                }
            }
        } catch (err) {
            console.error('Failed to refresh campaigns:', err);
            toast.error('Failed to load campaigns');
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refreshCampaigns()
    }, [])

    const filteredItems = category === 'all'
        ? campaigns
        : campaigns.filter(camp => camp.category?._id === category);

    const hasMoreItems = displayCount < filteredItems.length;

    return (
        <div className='md:max-w-[95vw] xl:container mx-auto px-4 md:px-8'>
            <DonationModal categories={initialCategories} onSuccess={refreshCampaigns} />
            <DonationClaimModal open={claimOpen} onOpenChange={setClaimOpen} item={selectedItem} />

            <section id='browse-items' className='mt-6'>

                {/* ================================ */}
                {/* Category Filter                  */}
                {/* ================================ */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className='text-xl font-bold text-gray-800'>Browse by Category</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{campaigns.length} active {campaigns.length === 1 ? 'campaign' : 'campaigns'}</span>
                            <button
                                onClick={refreshCampaigns}
                                disabled={loading}
                                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw size={16} className={loading ? 'animate-spin text-blue-600' : 'text-gray-500'} />
                            </button>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto scrollbar-hide pb-2">
                        <div className="flex gap-4 min-w-max px-1">
                            {/* All Button */}
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setCategory('all')}
                                className={`flex flex-col items-center justify-center gap-3 rounded-2xl px-8 py-5 min-w-[140px] transition-all duration-200 border
                                    ${category === 'all'
                                        ? "bg-[#00005E] text-white border-[#00005E] shadow-lg shadow-blue-900/20"
                                        : "bg-[#eef0f8] text-[#00005E] border-transparent hover:border-[#00005E]/20 hover:shadow-md"
                                    }`}
                            >
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white">
                                    <LayoutGrid className="w-7 h-7 text-[#00005E]" />
                                </div>
                                <span className="text-sm font-bold whitespace-nowrap">All</span>
                            </motion.button>

                            {activeCategories.map((cat) => {
                                const isSelected = category === cat._id;
                                return (
                                    <motion.button
                                        key={cat._id}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setCategory(isSelected ? 'all' : cat._id)}
                                        className={`flex flex-col items-center justify-center gap-3 rounded-2xl px-8 py-5 min-w-[140px] transition-all duration-200 border
                                            ${isSelected
                                                ? "bg-[#00005E] text-white border-[#00005E] shadow-lg shadow-blue-900/20"
                                                : "bg-[#eef0f8] text-[#00005E] border-transparent hover:border-[#00005E]/20 hover:shadow-md"
                                            }`}
                                    >
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden bg-white">
                                            <img
                                                src={cat.icon}
                                                alt={cat.name}
                                                width={36}
                                                height={36}
                                                className="object-contain"
                                            />
                                        </div>
                                        <span className="text-sm font-bold whitespace-nowrap line-clamp-1 max-w-[120px] text-center">
                                            {cat.name}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ================================ */}
                {/* Campaigns Grid                   */}
                {/* ================================ */}
                {loading ? (
                    <div className='flex flex-col justify-center items-center py-20 bg-white rounded-xl border border-dashed border-gray-300'>
                        <RefreshCw className="animate-spin text-blue-600 mb-3" size={48} />
                        <p className='text-lg font-medium text-gray-600'>Loading campaigns...</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className='flex flex-col justify-center items-center py-20 bg-white rounded-xl border border-dashed border-gray-300'>
                        <div className="bg-gray-100 p-4 rounded-full mb-3">
                            <Package className="text-gray-400" size={48} />
                        </div>
                        <p className='text-lg font-medium text-gray-600 mb-1'>No active donation campaigns found</p>
                        <p className='text-sm text-gray-500'>
                            {category !== 'all'
                                ? 'Try selecting a different category'
                                : 'New campaigns will appear here once approved'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
                            {filteredItems.slice(0, displayCount).map((camp, index) => {
                                const isOwner = session?.user && (session.user as any).id === camp.creator?._id;
                                const progress = camp.goalAmount && camp.raisedAmount
                                    ? Math.round((camp.raisedAmount / camp.goalAmount) * 100)
                                    : 0;
                                const cleanDescription = camp.description?.replace(/<[^>]*>/g, '').replace(/\*\*/g, '').trim() || '';

                                return (
                                    <motion.div
                                        key={camp._id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className='bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col'
                                    >
                                        {/* ======================== */}
                                        {/* Image Section            */}
                                        {/* ======================== */}
                                        <Link href={`/donation/${camp._id}`} className="relative w-full overflow-hidden block" style={{ aspectRatio: '16/10' }}>
                                            <Image
                                                src={camp.images?.[0] || '/img/placeholder.png'}
                                                alt={camp.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />

                                            {/* Dark gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                                            {/* Category Badge - top left */}
                                            {camp.category?.name && (
                                                <div className="absolute top-3 left-3 z-10">
                                                    <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-[#00005E] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                                                        {camp.category.name}
                                                    </span>
                                                </div>
                                            )}

                                            {/* My Post badge */}
                                            {isOwner && (
                                                <div className="absolute top-3 right-3 z-10">
                                                    <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                                                        My Post
                                                    </span>
                                                </div>
                                            )}

                                            {/* Item type badge - bottom left */}
                                            <div className="absolute bottom-3 left-3 z-10">
                                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm
                                                    ${camp.item === 'money'
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-orange-500 text-white'
                                                    }`}>
                                                    {camp.item === 'money' ? '💸 Fund' : '📦 Item'}
                                                </span>
                                            </div>
                                        </Link>

                                        {/* ======================== */}
                                        {/* Content Section          */}
                                        {/* ======================== */}
                                        <div className='p-4 flex flex-col flex-grow gap-3'>

                                            {/* Creator */}
                                            {camp.creator?.name && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-[#00005E]/10 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-[9px] font-bold text-[#00005E]">
                                                            {camp.creator.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-500 truncate">{camp.creator.name}</span>
                                                </div>
                                            )}

                                            {/* Title */}
                                            <Link href={`/donation/${camp._id}`}>
                                                <h3 className='font-bold text-gray-900 text-base line-clamp-2 hover:text-blue-600 transition-colors leading-snug'>
                                                    {camp.title}
                                                </h3>
                                            </Link>

                                            {/* Description */}
                                            {cleanDescription && (
                                                <p className='text-xs text-gray-500 line-clamp-2 leading-relaxed flex-grow'>
                                                    {cleanDescription}
                                                </p>
                                            )}

                                            {/* Progress bar for money campaigns */}
                                            {camp.item === 'money' && camp.goalAmount && camp.goalAmount > 0 && (
                                                <div className="space-y-1.5">
                                                    <div className="flex justify-between text-xs font-semibold">
                                                        <span className="text-emerald-600">৳{(camp.raisedAmount || 0).toLocaleString()} raised</span>
                                                        <span className="text-gray-400">Goal: ৳{camp.goalAmount.toLocaleString()}</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.min(progress, 100)}%` }}
                                                            transition={{ duration: 1, delay: 0.3 }}
                                                            className={`h-full rounded-full ${progress >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                                        />
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 text-right">{progress}% funded</p>
                                                </div>
                                            )}

                                            {/* Divider */}
                                            <div className="h-px bg-gray-100" />

                                            {/* Action Button */}
                                            {isOwner ? (
                                                <button
                                                    disabled
                                                    className='w-full py-2.5 bg-gray-50 text-gray-400 text-sm font-semibold rounded-xl cursor-not-allowed flex items-center justify-center gap-2'
                                                >
                                                    <Heart className="w-4 h-4" />
                                                    You are the donor
                                                </button>
                                            ) : (
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className='w-full py-2.5 bg-[#00005E] hover:bg-[#000045] text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-900/20'
                                                    onClick={() => {
                                                        setSelectedItem({
                                                            id: camp._id,
                                                            title: camp.title,
                                                            image: camp.images?.[0] || '',
                                                            type: camp.item
                                                        });
                                                        setClaimOpen(true);
                                                    }}
                                                >
                                                    <HandHeart className="w-4 h-4" />
                                                    {camp.item === 'money' ? 'Request Fund' : 'Request Item'}
                                                </motion.button>
                                            )}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>

                        {hasMoreItems && (
                            <div className='flex justify-center py-10'>
                                <Button
                                    variant={'outline'}
                                    onClick={() => setDisplayCount(prev => prev + 8)}
                                    className='px-8 border-2 border-[#00005E] text-[#00005E] hover:bg-[#00005E] hover:text-white font-bold rounded-xl transition-all'
                                >
                                    Load More ({filteredItems.length - displayCount} remaining)
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    )
}