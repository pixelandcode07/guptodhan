import Image from 'next/image'
import React from 'react'
// import FooterImage from '../../../../public/img/footerimage1.png'
import FooterImage from '../../../../../public/img/footerimage1.png'
import PlayStore from '../../../../../public/img/playstore.png'
import AppleStore from '../../../../../public/img/AppleLogo.png'
import { Button } from '@/components/ui/button'

export default function Footerbanner() {
    return (
        <div className='max-w-7xl mx-auto bg-linear-to-r from-[#0084CB] to-[#00005E] flex justify-between items-center p-10'>
            <div className="image">
                <Image src={FooterImage} width={200} height={200} alt="logo" className='w-fit' />
            </div>
            <div className="footer-content">
                <h1 className='text-white font-medium text-2xl'>Download our new app today</h1>
            </div>
            <div className="btns hidden md:flex flex-col gap-4">
                <Button size={"xxl"} variant={'FooterBtn'} className=''>
                    <div className="image-icon">
                        <Image src={PlayStore} width={30} height={30} alt="logo" className='w-fit bg-black' />
                    </div>
                    <div>
                        <h6>Android app on</h6>
                        <h1>Google Play</h1>
                    </div>
                </Button>
                <Button size={"xxl"} variant={'FooterBtn'} className=''>
                    <div className="image-icon">
                        <Image src={AppleStore} width={30} height={30} alt="logo" className='w-fit bg-black' />
                    </div>
                    <div>
                        <h6>Android app on</h6>
                        <h1>Google Play</h1>
                    </div>
                </Button>
            </div>
        </div>
    )
}
