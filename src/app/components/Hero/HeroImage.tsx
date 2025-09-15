import Image from 'next/image'
import React from 'react'
import BannerImage from '../../../../public/img/banner.png'

export default function HeroImage() {
    return (
        <div className='my-5 max-w-[80vw] mx-auto'>
            <Image src={BannerImage} alt="hero-image" width={1800} height={800} />
        </div>
    )
}
