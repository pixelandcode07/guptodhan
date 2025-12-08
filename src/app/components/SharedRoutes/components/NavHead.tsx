import { Phone } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
// import Link from 'next/link'
import React from 'react'

export default function NavHead() {
    const { data } = useSession()
    const vendorRole = (data?.user as any)?.role as string;
    return (
        <div className='bg-[#0084CB] text-[#FFFFFF] hidden md:flex justify-between items-center py-3 px-5 lg:px-15'>
            <h1 className=' flex items-center gap-2'>
                <span className='hidden lg:block'><Phone /></span> <span className='text-sm lg:text-sm font-semibold'>Call us Now : 01816500600</span>
            </h1>
            <div>
                <ul className='flex gap-4 '>
                    {vendorRole !== 'vendor' && <>
                        <Link href={'/join-as-vendor'} className='text-sm hover:text-black hover:font-semibold cursor-pointer'>Join As Vendor</Link>
                        <li className='text-sm'>|</li>
                    </>}
                    <li className='text-sm hover:text-black hover:font-semibold cursor-pointer'>Track Order</li>
                    <li className='text-sm'>|</li>
                    <li className='text-sm hover:text-black hover:font-semibold cursor-pointer'>Contact Us</li>
                </ul>
            </div>
        </div>
    )
}
