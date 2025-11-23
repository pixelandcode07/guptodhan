import BuySellGrid from '@/components/ReusableComponents/BuySellGrid'
import PageHeader from '@/components/ReusableComponents/PageHeader'
import { fetchPublicClassifiedAds } from '@/lib/BuyandSellApis/fetchClassifiedAds';
import { generateGuptodhanMetadata } from '@/lib/metadata/generateGuptodhanMetadata';

export async function generateMetadata() {
    return generateGuptodhanMetadata({
        title: "View All | Guptodhan Marketplace",
        description:
            "Buy and sell new or used items in your city. Explore verified ads across electronics, vehicles, real estate, fashion, and more — only on Guptodhan.",
        urlPath: "/home/buyandsell",
        imageUrl: "/og-images/guptodhan-marketplace-banner.jpg",
    })
}

export default async function AllProducts() {
    const allAds = await fetchPublicClassifiedAds();
    return (
        <div className='max-w-7xl mx-auto pt-15 pb-52'>
            <PageHeader
                title="All Ads"
            />
            <BuySellGrid ads={allAds} />
        </div>
    )
}
