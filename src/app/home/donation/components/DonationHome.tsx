"use client"

import DonationBanner from './DonationBanner'
import DonationModal from './DonationModal'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import DonationClaimModal from './DonationClaimModal'

export default function DonationHome() {
    const [items, setItems] = useState<{ id: string, title: string, image: string, category?: string }[]>([])
    const [category, setCategory] = useState<string>('all')
    const [displayCount, setDisplayCount] = useState<number>(5)
    const [claimOpen, setClaimOpen] = useState<boolean>(false)
    const [selectedItem, setSelectedItem] = useState<{ id: string, title: string, image: string, category?: string } | undefined>(undefined)

    const handleSubmit = (data: { title: string, image?: string, category?: string }) => {
        setItems(prev => [{ id: `${Date.now()}`, title: data.title || 'Untitled', image: data.image || '/img/banner.png', category: data.category }, ...prev])
    }

    useEffect(() => {
        setDisplayCount(5) // Reset display count when category changes
    }, [category])

    // Mock seed data for initial view
    useEffect(() => {
        if (items.length === 0) {
            const seed = [
                { id: 'seed-1', title: 'Winter Jacket', image: '/img/buysell/men-fashion.png', category: 'clothes' },
                { id: 'seed-2', title: 'Math Textbooks', image: '/img/buysell/education.png', category: 'books' },
                { id: 'seed-3', title: 'Rice Bag 10kg', image: '/img/buysell/agriculture.png', category: 'food' },
                { id: 'seed-4', title: 'Football', image: '/img/buysell/sports.png', category: 'other' },
                { id: 'seed-5', title: 'Study Lamp', image: '/img/buysell/electronics.png', category: 'other' },
                { id: 'seed-6', title: 'Denim Jeans', image: '/img/buysell/men-fashion.png', category: 'clothes' },
                { id: 'seed-7', title: 'Science Books', image: '/img/buysell/education.png', category: 'books' },
                { id: 'seed-8', title: 'Vegetables', image: '/img/buysell/agriculture.png', category: 'food' },
                { id: 'seed-9', title: 'Tennis Racket', image: '/img/buysell/sports.png', category: 'other' },
                { id: 'seed-10', title: 'Laptop', image: '/img/buysell/electronics.png', category: 'other' },
                { id: 'seed-11', title: 'T-Shirt', image: '/img/buysell/men-fashion.png', category: 'clothes' },
                { id: 'seed-12', title: 'Novels', image: '/img/buysell/education.png', category: 'books' },
            ]
            setItems(seed)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const filteredItems = items.filter(item => category === 'all' || item.category === category);
    const hasMoreItems = displayCount < filteredItems.length;

    return (
        <div className='mt-5 max-w-7xl mx-auto'>
            <DonationModal onSubmit={handleSubmit} />
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
                                <SelectItem value='clothes'>Clothes</SelectItem>
                                <SelectItem value='food'>Food</SelectItem>
                                <SelectItem value='books'>Books</SelectItem>
                                <SelectItem value='other'>Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
                    {filteredItems.slice(0, displayCount).map(item => (
                        <div key={item.id} className='bg-white border rounded-md overflow-hidden flex flex-col'>
                            <div className="relative w-full h-40">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <div className='p-3 flex-1'>
                                <div className='font-semibold'>{item.title}</div>
                                {item.category && <div className='text-xs text-gray-500 mt-1 capitalize'>{item.category}</div>}
                            </div>
                            <div className='p-3 pt-0'>
                                <Button
                                    variant={'default'}
                                    className='w-full'
                                    onClick={() => { setSelectedItem(item); setClaimOpen(true) }}
                                >
                                    Claim
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
            </section>
        </div>
    )
}