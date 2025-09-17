"use client"

import DonationBanner from './DonationBanner'
import DonationModal from './DonationModal'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Select } from '@radix-ui/react-select'

export default function DonationHome() {
    const [items, setItems] = React.useState<{ id: string, title: string, image: string, category?: string }[]>([])
    const [category, setCategory] = React.useState<string>('all')

    const handleSubmit = (data: { title: string, image?: string, category?: string }) => {
        setItems(prev => [{ id: `${Date.now()}`, title: data.title || 'Untitled', image: data.image || '/img/banner.png', category: data.category }, ...prev])
    }

    // Temporary: no persistence while using mock data; backend will replace this later

    // Mock seed data for initial view
    React.useEffect(() => {
        if (items.length === 0) {
            const seed = [
                { id: 'seed-1', title: 'Winter Jacket', image: '/img/buysell/men-fashion.png', category: 'clothes' },
                { id: 'seed-2', title: 'Math Textbooks', image: '/img/buysell/education.png', category: 'books' },
                { id: 'seed-3', title: 'Rice Bag 10kg', image: '/img/buysell/agriculture.png', category: 'food' },
                { id: 'seed-4', title: 'Football', image: '/img/buysell/sports.png', category: 'food' },
                { id: 'seed-5', title: 'Study Lamp', image: '/img/buysell/electronics.png', category: 'books' },
            ]
            setItems(seed)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className='mt-5 max-w-7xl mx-auto'>
            <DonationModal onSubmit={handleSubmit} />
            <DonationBanner />
            <section id='browse-items' className='mt-6'>
                <div className='flex items-center justify-between px-4'>
                    <h2 className='text-lg font-semibold'>Browse Available Items</h2>
                    <div className='flex items-center gap-2'>
                        <label className='text-sm text-gray-600'>Select categories</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className='h-9 border rounded-md px-3 text-sm min-w-[180px]'
                        >
                            <option value='all'>All</option>
                            <option value='clothes'>Clothes</option>
                            <option value='food'>Food</option>
                            <option value='books'>Books</option>
                        </select>
                    </div>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4'>
                    {(items.length === 0 ? Array.from({ length: 6 }).map((_, i) => ({ id: `ph-${i}`, title: '', image: '', category: '' })) : items)
                        .filter(item => category === 'all' || item.category === category)
                        .map(item => (
                            item.title ? (
                                <div key={item.id} className='bg-white border rounded-md overflow-hidden flex flex-col'>
                                    <img src={item.image} alt={item.title} className='w-full h-32 object-cover' />
                                    <div className='p-3 flex-1'>
                                        <div className='text-sm font-medium'>{item.title}</div>
                                        {item.category && <div className='text-xs text-gray-500 mt-1'>{item.category}</div>}
                                    </div>
                                    <div className='p-3 pt-0'>
                                        <Button variant={'BlueBtn'} className='w-full h-8 text-xs'>Claim</Button>
                                    </div>
                                </div>
                            ) : (
                                <div key={item.id} className='bg-white border rounded-md h-40' />
                            )
                        ))}
                </div>
            </section>
        </div>
    )
}


