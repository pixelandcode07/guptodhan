import Image from 'next/image'
import React from 'react'
import BuySellBanner from '../../../../../public/img/buysell/buysell-banner.png'




export default async function BuyandSellBanner() {
  
    return (
        <div>
            <div className="banner py-5">
                <Image src={BuySellBanner} width={1000} height={300} alt="banner" className='w-full' />
            </div>
        </div>
    )
}
