// "use client"

import BuySellGrid from '@/components/ReusableComponents/BuySellGrid'
import PageHeader from '@/components/ReusableComponents/PageHeader'
import { ClassifiedAdListing } from '@/types/ClassifiedAdsType'
// import { useRouter } from 'next/navigation'

type AllAdsProps = {
    allAds: ClassifiedAdListing[];
}

export default function BuyandSellAdds({ allAds }: AllAdsProps) {
    // const router = useRouter();
    return (
        <div className='max-w-7xl mx-auto pt-15 pb-52'>
            <PageHeader
                title="Latest Ads"
                buttonLabel="View All"
                // onButtonClick={() => router.push("/buy-sell/all/products")}
                buttonHref="/buy-sell/all/products"
            />
            <BuySellGrid ads={allAds} />
        </div>
    )
}
