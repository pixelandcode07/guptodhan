import { BannerDataType } from '@/types/BuySellBannerType';
import Image from 'next/image'

interface BuyandSellBannerProps {
    banner: BannerDataType[];
}

export default async function BuyandSellBanner({ banner }: BuyandSellBannerProps) {
    return (
        <div className="space-y-5">
            {banner.map((bannerImg) =>
                bannerImg.status === "active" ? (
                    <div key={bannerImg._id} className="banner py-5">
                        {/* Banner Image */}
                        <div className='hidden md:block'>
                            <Image
                                src={bannerImg.bannerImage}
                                width={1000}
                                height={300}
                                alt="banner"
                                className="w-full h-[300px] object-cover rounded-md"
                            />
                        </div>
                        <div className='md:hidden'>
                            <Image
                                src={bannerImg.bannerImage}
                                width={1000}
                                height={200}
                                alt="banner"
                                className="w-full h-[200px] object-cover rounded-md"
                            />
                        </div>
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

