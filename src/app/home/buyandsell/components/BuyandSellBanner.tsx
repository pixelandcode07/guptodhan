import Image from 'next/image'
import React from 'react'
// import BuySellBanner from '../../../../../public/img/buysell/buysell-banner.png'

interface BannerData {
    bannerImage: string;
    bannerDescription: string;
    status: string;
    _id: string;
}


interface BuyandSellBannerProps {
    banner: BannerData[];
}

export default async function BuyandSellBanner({ banner }: BuyandSellBannerProps) {
    // console.log(banner)

    return (
        <div className="space-y-5">
            {banner.map((bannerImg) =>
                bannerImg.status === "active" ? (
                    <div key={bannerImg._id} className="banner py-5">
                        {/* Banner Image */}
                        <Image
                            src={bannerImg.bannerImage}
                            width={1000}
                            height={300}
                            alt="banner"
                            className="w-full h-[300px] object-cover rounded-md"
                        />
                        {/* Banner Text */}
                        {/* <div
                            className="mt-2 text-gray-700"
                            dangerouslySetInnerHTML={{ __html: bannerImg.bannerDescription }}
                        /> */}
                    </div>
                ) : null
            )}
        </div>
    )
}

