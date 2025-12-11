"use client"

import DonationModal from './DonationModal'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import DonationClaimModal from './DonationClaimModal'

// টাইপ ডেফিনিশন
interface DonationCampaign {
    _id: string;
    title: string;
    images: string[];
    item: 'money' | 'clothes' | 'food' | 'books' | 'other';
    category?: { _id: string; name: string; };
    description?: string;
}

interface DonationCategory {
    _id: string;
    name: string;
    icon?: string;
    status: 'active' | 'inactive';
}

interface DonationHomeProps {
    initialCampaigns: DonationCampaign[];
    initialCategories: DonationCategory[];
}

export default function DonationHome({ initialCampaigns, initialCategories }: DonationHomeProps) {
    // Props থেকে ডাটা ইনিশিয়ালাইজ করছি
    const [campaigns, setCampaigns] = useState<DonationCampaign[]>(initialCampaigns)
    const [categories] = useState<DonationCategory[]>(initialCategories)
    
    const [category, setCategory] = useState<string>('all')
    const [displayCount, setDisplayCount] = useState<number>(8) // শুরুতে একটু বেশি দেখালে ভালো
    const [claimOpen, setClaimOpen] = useState<boolean>(false)
    const [selectedItem, setSelectedItem] = useState<{ id: string, title: string, image: string, category?: string } | undefined>(undefined)

    // ক্যাটাগরি চেঞ্জ হলে ডিসপ্লে রিসেট
    useEffect(() => {
        setDisplayCount(8)
    }, [category])

    // নতুন ক্যাম্পেইন তৈরি হলে রিফ্রেশ করার ফাংশন
    const refreshCampaigns = async () => {
        try {
            const response = await fetch('/api/v1/public/donation-campaigns');
            const result = await response.json();
            if (result.success && result.data) {
                setCampaigns(result.data);
            }
        } catch (err) {
            console.error('Failed to refresh campaigns:', err);
        }
    }

    const handleSubmit = (data: any) => {
        // Legacy support
    }

    // ফিল্টারিং লজিক
    const items = campaigns.map(campaign => ({
        id: campaign._id,
        title: campaign.title,
        image: campaign.images && campaign.images.length > 0 ? campaign.images[0] : '/img/banner.png',
        category: campaign.item,
        categoryId: campaign.category?._id,
        categoryName: campaign.category?.name || campaign.item,
        description: campaign.description
    }));

    const filteredItems = category === 'all' 
        ? items 
        : items.filter(item => item.categoryId === category);
        
    const hasMoreItems = displayCount < filteredItems.length;

    return (
        <div className='mt-5 max-w-7xl mx-auto'>
            {/* Modal Components */}
            <DonationModal onSubmit={handleSubmit} categories={categories} onSuccess={refreshCampaigns} />
            <DonationClaimModal open={claimOpen} onOpenChange={setClaimOpen} item={selectedItem} />

            <section id='browse-items' className='mt-6 px-4 pb-10'>
                {/* Header & Filter */}
                <div className='flex flex-col sm:flex-row items-center justify-between gap-4 mb-8'>
                    <h2 className='text-2xl font-bold text-gray-800'>Browse Available Items</h2>
                    <div className='flex items-center gap-3'>
                        <label className='text-sm font-medium text-gray-600 hidden sm:block'>Filter by:</label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="w-[180px] bg-white">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='all'>All Categories</SelectItem>
                                {categories
                                    .filter(cat => cat.status === 'active')
                                    .map(cat => (
                                        <SelectItem key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Grid Content */}
                {filteredItems.length === 0 ? (
                    <div className='flex flex-col justify-center items-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300'>
                        <p className='text-lg font-medium text-gray-600 mb-1'>No donation items found</p>
                        <p className='text-sm text-gray-400'>Check back later or change filter</p>
                    </div>
                ) : (
                    <>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                            {filteredItems.slice(0, displayCount).map(item => (
                                <div 
                                    key={item.id} 
                                    className='bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group'
                                >
                                    {/* Image Section */}
                                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {item.categoryName && (
                                            <div className="absolute top-3 left-3 z-10">
                                                <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-xs font-bold text-gray-700 rounded-full shadow-sm">
                                                    {item.categoryName}
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    
                                    {/* Content Section */}
                                    <div className='p-5 flex-1 flex flex-col'>
                                        <h3 className='font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors'>
                                            {item.title}
                                        </h3>
                                        
                                        {item.description && (
                                            <p className='text-sm text-gray-500 line-clamp-2 mb-4 flex-1'>
                                                {item.description}
                                            </p>
                                        )}
                                        
                                        <Button
                                            variant={'default'}
                                            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-all'
                                            onClick={() => { setSelectedItem(item); setClaimOpen(true) }}
                                        >
                                            Claim Item
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMoreItems && (
                            <div className='flex justify-center py-10'>
                                <Button
                                    variant={'outline'}
                                    onClick={() => setDisplayCount(prev => prev + 8)}
                                    className='px-10 py-6 text-base hover:bg-gray-50'
                                >
                                    Load More Items
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    )
}