import { Phone } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
// import Link from 'next/link'
import React from 'react'

export default function NavHead() {
    const { data } = useSession()
    const role = (data?.user as any)?.role as string;
    return (
        <div className='bg-[#0084CB] w-full text-[#FFFFFF] hidden md:flex justify-between items-center py-3 px-5 lg:px-15'>
            <h1 className=' flex items-center gap-2'>
                <span className='hidden lg:block'><Phone /></span> <span className='text-sm lg:text-sm font-semibold'>Call us Now : 01816500600</span>
            </h1>
            <div>
                <ul className='flex gap-4 '>
                    {role === 'vendor' && <>
                        <Link href={'/dashboard'} className='text-sm hover:transition-all duration-500 font-medium hover:font-semibold hover:text-gray-900 hover:underline hover:underline-offset-8 cursor-pointer'>Vendor Dashboard</Link>
                        <li className='text-sm'>|</li>
                    </>}
                    {role === 'admin' && <>
                        <Link href={'/general/home'} className='text-sm hover:transition-all duration-500 font-medium hover:font-semibold hover:text-gray-900 hover:underline hover:underline-offset-8 cursor-pointer'>Admin Dashboard</Link>
                        <li className='text-sm'>|</li>
                    </>}
                    {role !== 'vendor' && role !== 'admin' && role !== 'user' ? <>
                        <Link href={'/join-as-vendor'} className='text-sm hover:transition-all duration-500 font-medium hover:font-semibold hover:text-gray-900 hover:underline hover:underline-offset-8 cursor-pointer'>Join As Vendor</Link>
                        <li className='text-sm'>|</li>
                        <Link href={'/join-as-provider'} className='text-sm hover:transition-all duration-500 font-medium hover:font-semibold hover:text-gray-900 hover:underline hover:underline-offset-8 cursor-pointer'>Join As Service Provider</Link>
                        <li className='text-sm'>|</li>
                    </> : null}
                    <li className='text-sm hover:transition-all duration-500 font-medium hover:font-semibold hover:text-gray-900 hover:underline hover:underline-offset-8 cursor-pointer'>Track Order</li>
                    <li className='text-sm'>|</li>
                    <li className='text-sm hover:transition-all duration-500 font-medium hover:font-semibold hover:text-gray-900 hover:underline hover:underline-offset-8 cursor-pointer'>
                        <Link
                            href="https://wa.me/8801816500600?text=Hello!%20Hope%20you're%20having%20a%20great%20day!%20I%20need%20assistance%20with...%20Thank%20you!"
                            target="_blank"
                            rel="noopener noreferrer">
                            Contact Us
                        </Link></li>

                </ul>
            </div>
        </div>
    )
}
