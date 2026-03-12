// "use client"

import BuySellGrid from '@/components/ReusableComponents/BuySellGrid'
import PageHeader from '@/components/ReusableComponents/PageHeader'
import { ClassifiedAdListing } from '@/types/ClassifiedAdsType'

type AllAdsProps = {
    allAds: ClassifiedAdListing[];
}

export default function BuyandSellAdds({ allAds }: AllAdsProps) {
    // const router = useRouter();
    return (
        // <div className='max-w-7xl mx-auto pt-15 pb-52'>
        <div className=''>
            <PageHeader
                title="Latest Ads"
                buttonLabel="View All"
                buttonHref="/buy-sell/all/products"
            />
            <BuySellGrid ads={allAds} />
        </div>
    )
}
