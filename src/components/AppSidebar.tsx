import { House } from 'lucide-react'
import React from 'react'

export default function AppSidebar() {
    return (
        <div className='bg-[#061b38] text-[#fff]'>
            <h1 className='py-5 text-center text-4xl font-bold'>Guptodhan</h1>

            <div className='flex items-center gap-2 pl-8'>
                <House /> Dashboard
            </div>
        </div>
    )
}
