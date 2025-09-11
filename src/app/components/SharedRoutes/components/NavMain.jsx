'use client'

import { Input } from '@/components/ui/input'
import { Handbag, Heart, Search, User } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import Login from '../../LogInAndRegister/Login'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'

export default function NavMain() {

    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = () => {
        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery)
            // TODO: Add your search logic here 
        }
    }
    return (
        <div className='bg-[#FFFFFF] text-black  flex justify-between items-center py-5 px-15 border-2'>
            <div className="logo">
                <Image src="/logo.png" width={130} height={44} alt="logo" />
            </div>
            <div className="search flex items-center justify-center w-full max-w-md mx-auto relative">
                <Input
                    placeholder='Search...'
                    className='w-full pr-10'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Search
                    className='absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#00005E] cursor-pointer'
                    onClick={handleSearch}
                />
            </div>
            <div>
                <Dialog>
                    <ul className='flex gap-4 text-base'>
                        <li className='flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer'><Heart /><span className='text-[#00005E] text-[12px]'> Whishlist</span></li>
                        <li className='flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer'><Handbag /><span className='text-[#00005E] text-[12px]'> Cart</span></li>
                        <DialogTrigger>
                            <li className='flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer'><User /><span className='text-[#00005E] text-[12px]'>
                                Login /Register
                            </span></li>
                        </DialogTrigger>
                    </ul>
                    {/* Login page */}
                    <Login />
                </Dialog>
            </div>
        </div>
    )
}
