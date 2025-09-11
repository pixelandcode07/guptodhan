import { Phone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function NavHead() {
    return (
        <div className='bg-[#0084CB] text-[#FFFFFF]  flex justify-between items-center py-3 px-15'>
            <div className='text-base flex items-center gap-2'>
                <Phone /> Call us Now : 01816500600
            </div>
            <div>
                <ul className='flex gap-4 text-base'>
                    <li>Vendor Login</li>
                    <li>|</li>
                    <li>Vendor Registration</li>
                    <li>|</li>
                    <li>Track Order</li>
                    <li>|</li>
                    <li>Contact Us</li>
                    <li>|</li>
                    <li>
                        <Link href={'/general/home'}>Dashboard</Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}
