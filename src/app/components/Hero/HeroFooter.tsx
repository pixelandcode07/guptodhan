import { Button } from '@/components/ui/button'
import { heroFooterData } from '@/data/hero_foot-data'
import { HandCoins, HeartHandshake, House } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function HeroFooter() {
    return (
        <>
            <div className='hidden lg:flex justify-center items-center gap-4 py-2 px-20 bg-white rounded-md overflow-x-auto'>
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
            <div className='lg:hidden flex justify-center items-center gap-4 py-2 px-4 bg-white rounded-md overflow-x-auto'>
                <div className='flex items-center justify-center py-4 md:px-6 rounded-md'>
                    <Button variant={'HomeBuy'} size={'lg'} className='rounded-none'><House size={32} />
                        <Link href={'/home/buyandsell'}>
                            Buy & Sale
                        </Link>
                    </Button>
                    <Button variant={'HomeDoante'} size={'lg'} className='rounded-none'><HandCoins size={32} />
                        <Link href={'/home/donate'}>
                            Donation
                        </Link>
                    </Button>
                    <Button variant={'HomeServices'} size={'lg'} className='rounded-none'><HeartHandshake size={32} />
                        <Link href={'/home/donate'}>
                            Services
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    )
}
