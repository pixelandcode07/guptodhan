import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React, { useState } from 'react'

export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = () => {
        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery)
            // TODO: Add your search logic here 
        }
    }
    return (
        <>
            <Input
                placeholder='Search...'
                className='w-full pr-10 bg-white text-gray-800 border border-gray-300 focus:border-black focus:ring-0 focus:outline-none'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Search
                className='absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#00005E] cursor-pointer'
                onClick={handleSearch}
            />
        </>
    )
}
