import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
// import BannerImage from '../../../../public/img/banner.png'

export default function HeroImage() {
    return (
        <>
            <div className=' my-5 max-w-[80vw] mx-auto grid grid-cols-1 md:grid-cols-12 gap-2'>
                <div className='col-span-8'>
                    <Link href={'/newpage'}>
                        <Image src={'/img/banner-first.png'} alt="hero-image" width={1000} height={800} className='h-36 md:h-full' />
                    </Link>
                </div>
                <div className='col-span-4 flex flex-col gap-2'>
                    <Link href={"/home/buyandsell"}>
                        <Image src={'/img/banner-second.png'} alt="hero-image" width={500} height={500} className='h-36 md:h-full' />
                    </Link>
                    <Link href={"/home/donation"}>
                        <Image src={'/img/banner-third.png'} alt="hero-image" width={500} height={500} className='h-36 md:h-full' />
                    </Link>
                </div>
            </div>
        </>
    )
}
