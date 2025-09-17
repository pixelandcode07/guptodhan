import { heroFooterData } from '@/data/hero_foot-data'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function HeroFooter() {
    return (
        <div className='flex justify-center items-center gap-4 py-2 px-20 bg-white rounded-md'>
            {heroFooterData.map((item, idx) => (
                <Link key={idx} href={item.href} className='flex items-center justify-center gap-2 py-4 px-6 rounded-md'>
                    <div>
                        <Image src={item.icon} alt="hero-image" width={40} height={40} />
                    </div>
                    <div>
                        <h6 className='text-[#00005E] font-medium text-base'>{item.title}</h6>
                    </div>
                </Link>))}
        </div>
    )
}
