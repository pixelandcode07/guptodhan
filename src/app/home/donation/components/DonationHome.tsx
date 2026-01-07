"use client"

import DonationModal from './DonationModal'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import DonationClaimModal from './DonationClaimModal'
import { Badge } from '@/components/ui/badge'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Package, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

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

    // ✅ Fetch only approved AND active campaigns
    const refreshCampaigns = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/v1/public/donation-campaigns');
            const result = await response.json();
            
            if (result.success && result.data) {
                // Filter: শুধু approved AND active campaigns
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
        <div className='max-w-7xl mx-auto'>
            <DonationModal categories={initialCategories} onSuccess={refreshCampaigns} />
            <DonationClaimModal open={claimOpen} onOpenChange={setClaimOpen} item={selectedItem} />

            <section id='browse-items' className='mt-6 px-4'>
                <div className='flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm border'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800'>Browse Active Donations</h2>
                        <p className='text-sm text-gray-500 mt-1'>
                            {campaigns.length} active {campaigns.length === 1 ? 'campaign' : 'campaigns'} available
                        </p>
                    </div>
                    <div className='flex items-center gap-3 w-full sm:w-auto'>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Filter by Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='all'>All Categories</SelectItem>
                                {initialCategories.map(cat => (
                                    <SelectItem key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button 
                            variant="outline" 
                            size="icon"
                            onClick={refreshCampaigns}
                            disabled={loading}
                            title="Refresh campaigns"
                        >
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        </Button>
                    </div>
                </div>

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
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                            {filteredItems.slice(0, displayCount).map(camp => {
                                const isOwner = session?.user && (session.user as any).id === camp.creator?._id;
                                const progress = camp.goalAmount && camp.raisedAmount 
                                    ? Math.round((camp.raisedAmount / camp.goalAmount) * 100) 
                                    : 0;

                                return (
                                    <div key={camp._id} className='bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full'>
                                        
                                        {/* Image area */}
                                        <Link href={`/home/donation/${camp._id}`} className="relative w-full aspect-[4/3] bg-gray-200 overflow-hidden block">
                                            <Image
                                                src={camp.images?.[0] || '/img/placeholder.png'}
                                                alt={camp.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {camp.category?.name && (
                                                <div className="absolute top-3 right-3 z-10">
                                                    <Badge variant="secondary" className="bg-white/90 text-black shadow-sm backdrop-blur-sm">
                                                        {camp.category.name}
                                                    </Badge>
                                                </div>
                                            )}
                                            {isOwner && (
                                                <div className="absolute top-3 left-3 z-10">
                                                    <Badge className="bg-blue-600 text-white shadow-sm">My Post</Badge>
                                                </div>
                                            )}
                                            
                                            {/* Progress badge */}
                                            {camp.goalAmount && camp.goalAmount > 0 && (
                                                <div className="absolute bottom-3 left-3 z-10">
                                                    <Badge className={`${progress >= 100 ? 'bg-green-600' : 'bg-blue-600'} text-white shadow-sm font-bold`}>
                                                        {progress}% Raised
                                                    </Badge>
                                                </div>
                                            )}
                                        </Link>
                                        
                                        <div className='p-4 flex flex-col flex-grow'>
                                            {/* Title */}
                                            <Link href={`/home/donation/${camp._id}`}>
                                                <h3 className='font-bold text-gray-900 text-lg mb-2 line-clamp-1 hover:text-blue-600 transition-colors' title={camp.title}>
                                                    {camp.title}
                                                </h3>
                                            </Link>
                                            
                                            {/* Description */}
                                            <p className='text-sm text-gray-500 line-clamp-2 mb-3 flex-grow'>
                                                {camp.description?.replace(/<[^>]*>/g, '') || 'No description available.'}
                                            </p>
                                            
                                            {/* Progress bar (if money campaign) */}
                                            {camp.item === 'money' && camp.goalAmount && camp.goalAmount > 0 && (
                                                <div className="mb-3">
                                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                        <span>৳{(camp.raisedAmount || 0).toLocaleString()}</span>
                                                        <span>৳{camp.goalAmount.toLocaleString()}</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full ${progress >= 100 ? 'bg-green-600' : 'bg-blue-600'} transition-all duration-500`}
                                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Action Button */}
                                            {isOwner ? (
                                                <Button 
                                                    className='w-full bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100 mt-auto'
                                                    disabled
                                                >
                                                    You are the donor
                                                </Button>
                                            ) : (
                                                <Button
                                                    className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium mt-auto'
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
                                                    {camp.item === 'money' ? 'Request Fund' : 'Request Item'}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        {hasMoreItems && (
                            <div className='flex justify-center py-10'>
                                <Button 
                                    variant={'outline'} 
                                    onClick={() => setDisplayCount(prev => prev + 8)} 
                                    className='px-8'
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