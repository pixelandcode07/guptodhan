import Image from 'next/image'
import React from 'react'

export default function DonationBanner() {
    return (
        <div>
            <div className="banner py-5">
                <Image src="/img/banner.png" width={1000} height={300} alt="Donation banner" className='w-full' />
            </div>
        </div>
    )
}


