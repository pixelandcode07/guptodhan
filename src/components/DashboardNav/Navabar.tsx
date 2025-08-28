import { MoveRight, Send } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { NavProfile } from './components/NavProfile'

export default function Navabar() {
    return (
        <div className='flex justify-between items-center px-4 py-3 border-b'>
            <div>
                <span className='flex items-center text-[#2e7ce4] text-sm'>Pages <MoveRight /> (Dynamic routes name)</span>
                <h1 className='text-2xl'>
                    Page Info Dynamic
                </h1>
            </div>
            <div className='flex justify-end items-center mt-4'>
                <Button variant="custom" size="customSize1"><Send /> Visit Website</Button>
                <NavProfile />
            </div>
        </div>
    )
}
