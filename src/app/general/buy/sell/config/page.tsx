import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'
import React from 'react'

export default function BuySellConfig() {
    return (
        <div className='p-4'>
            <div className='bg-white p-4 border rounded-md'>
                <h1 className='text-gray-900 font-semibold'>BuySell Config Form</h1>
                <div className='my-10 space-y-8'>
                    <div className='space-y-5 md:flex md:gap-30'>
                        <h1 className='text-gray-900 font-semibold'>Page Banner</h1>
                        <Image src="/img/StoreBanner.jpeg" alt="banner" width={500} height={500} />
                    </div>
                    <div className='space-y-5 md:flex md:gap-30'>
                        <h1 className='text-gray-900 font-semibold'>Page Description</h1>
                        <Textarea placeholder='Here a Rich Text Editor will be available' />
                    </div>
                    <Button variant={'BlueBtn'}>Save Info</Button>
                </div>
            </div>
        </div>
    )
}
