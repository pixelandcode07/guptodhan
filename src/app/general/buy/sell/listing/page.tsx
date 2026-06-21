import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { fetchAllClassifiedAdsForAdmin } from '@/lib/BuyandSellApis/fetchClassifiedAds' // Use the correct fetch function
import { ClassifiedAdListing } from '@/types/ClassifiedAdsType'
import { getServerSession } from 'next-auth'
import ListingClient from './components/ListingClient'

export const dynamic = 'force-dynamic'; // Prevent Next.js 15 build errors

export default async function BuySellListing() {
    const session = await getServerSession(authOptions)
    const token = session?.accessToken as string | undefined;
    
    // ডাটা ফেচ করা হচ্ছে
    const rawListing: ClassifiedAdListing[] = await fetchAllClassifiedAdsForAdmin(token)
    
    const safeListing = Array.isArray(rawListing) 
        ? rawListing.filter(ad => ad && ad.user !== null && ad.user !== undefined)
        : [];

    return (
        <>
            <div className='py-5'>
                <h1 className="text-lg font-semibold border-l-2 border-blue-500">
                    <span className="pl-5">Buy Sell Listing ({safeListing.length})</span>
                </h1>
            </div>

            {/* ✅ Pass data to Client Component for Bulk Actions */}
            <ListingClient initialListing={safeListing} />
        </>
    )
}