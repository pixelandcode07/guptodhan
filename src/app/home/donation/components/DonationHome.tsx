"use client"

import DonationBanner from './DonationBanner'
import DonationModal from './DonationModal'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import DonationClaimModal from './DonationClaimModal'

interface DonationCampaign {
    _id: string;
    title: string;
    images: string[];
    item: 'money' | 'clothes' | 'food' | 'books' | 'other';
    category?: {
        _id: string;
        name: string;
    };
    description?: string;
}

interface DonationCategory {
    _id: string;
    name: string;
    icon?: string;
    status: 'active' | 'inactive';
}

export default function DonationHome() {
    const [campaigns, setCampaigns] = useState<DonationCampaign[]>([])
    const [categories, setCategories] = useState<DonationCategory[]>([])
    const [category, setCategory] = useState<string>('all')
    const [displayCount, setDisplayCount] = useState<number>(5)
    const [claimOpen, setClaimOpen] = useState<boolean>(false)
    const [selectedItem, setSelectedItem] = useState<{ id: string, title: string, image: string, category?: string } | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch campaigns and categories from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch campaigns
                const campaignsResponse = await fetch('/api/v1/public/donation-campaigns');
                const campaignsResult = await campaignsResponse.json();
                
                if (campaignsResult.success && campaignsResult.data) {
                    setCampaigns(campaignsResult.data);
                }

                // Fetch categories
                const categoriesResponse = await fetch('/api/v1/public/donation-categories');
                const categoriesResult = await categoriesResponse.json();
                
                if (categoriesResult.success && categoriesResult.data) {
                    setCategories(categoriesResult.data);
                }
            } catch (err) {
                console.error('Failed to fetch donation data:', err);
                setError('Failed to load donation data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [])

    const handleSubmit = (data: { title: string, image?: string, category?: string }) => {
        // This is kept for backward compatibility, but actual submission happens in DonationModal
    }

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

    useEffect(() => {
        setDisplayCount(5) // Reset display count when category changes
    }, [category])

    // Map campaigns to items format for display
    const items = campaigns.map(campaign => ({
        id: campaign._id,
        title: campaign.title,
        image: campaign.images && campaign.images.length > 0 ? campaign.images[0] : '/img/banner.png',
        category: campaign.item,
        categoryId: campaign.category?._id,
        categoryName: campaign.category?.name || campaign.item,
        description: campaign.description
    }));

    // Filter items by category (only by category ID from API)
    const filteredItems = category === 'all' 
        ? items 
        : items.filter(item => item.categoryId === category);
    const hasMoreItems = displayCount < filteredItems.length;

    if (loading) {
        return (
            <div className='mt-5 max-w-7xl mx-auto'>
                <DonationBanner />
                <section id='browse-items' className='mt-6'>
                    <div className='flex justify-center items-center py-20'>
                        <div className='text-gray-500'>Loading donation campaigns...</div>
                    </div>
                </section>
            </div>
        );
    }

    if (error) {
        return (
            <div className='mt-5 max-w-7xl mx-auto'>
                <DonationBanner />
                <section id='browse-items' className='mt-6'>
                    <div className='flex justify-center items-center py-20'>
                        <div className='text-red-500'>{error}</div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className='mt-5 max-w-7xl mx-auto'>
            <DonationModal onSubmit={handleSubmit} categories={categories} onSuccess={refreshCampaigns} />
            <DonationBanner />
            <section id='browse-items' className='mt-6'>
                <div className='flex items-center justify-between px-4'>
                    <h2 className='text-lg font-semibold'>Browse Available Items</h2>
                    <div className='flex items-center gap-2'>
                        <label className='text-sm text-gray-600'>Select categories</label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='all'>All</SelectItem>
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
                {filteredItems.length === 0 ? (
                    <div className='flex justify-center items-center py-20 px-4'>
                        <div className='text-gray-500 text-center'>
                            <p className='text-lg font-medium mb-2'>No donation campaigns found</p>
                            <p className='text-sm'>Be the first to create a donation campaign!</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4'>
                            {filteredItems.slice(0, displayCount).map(item => (
                                <div 
                                    key={item.id} 
                                    className='bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group'
                                >
                                    {/* Image Section with Overlay */}
                                    <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        {/* Category Badge */}
                                        {item.categoryName && (
                                            <div className="absolute top-3 left-3">
                                                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 rounded-full shadow-sm">
                                                    {item.categoryName}
                                                </span>
                                            </div>
                                        )}
                                        {/* Gradient Overlay on Hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    
                                    {/* Content Section */}
                                    <div className='p-4 flex-1 flex flex-col'>
                                        <h3 className='font-semibold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors'>
                                            {item.title}
                                        </h3>
                                        
                                        {/* Description Preview */}
                                        {item.description && (
                                            <p className='text-xs text-gray-500 line-clamp-2 mb-3 flex-1'>
                                                {item.description}
                                            </p>
                                        )}
                                        
                                        {/* Divider */}
                                        <div className="border-t border-gray-100 my-3" />
                                        
                                        {/* Action Button */}
                                        <Button
                                            variant={'default'}
                                            className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200'
                                            onClick={() => { setSelectedItem(item); setClaimOpen(true) }}
                                        >
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Claim Item
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <DonationClaimModal open={claimOpen} onOpenChange={setClaimOpen} item={selectedItem} />
                        {hasMoreItems && (
                            <div className='flex justify-center py-4'>
                                <Button
                                    variant={'outline'}
                                    onClick={() => setDisplayCount(prev => prev + 5)}
                                    className='px-8'
                                >
                                    Load more
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    )
}