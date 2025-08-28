import { House } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Vendors from './components/MultivendorModules/Vendors'

export default function AppSidebar() {
    return (
        <div className='bg-[#061b38] text-[#fff]'>
            <h1 className='py-5 text-center text-4xl font-bold'>Guptodhan</h1>

            <div className='flex items-center gap-2 pl-8'>
                <House /> Dashboard
            </div>
            <Button><Vendors /></Button>
        </div>
    )
}
