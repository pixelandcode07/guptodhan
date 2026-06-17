import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { buySellListing_columns } from '@/components/TableHelper/buySellListing_columns'
import { DataTable } from '@/components/TableHelper/data-table'
import { fetchAllClassifiedAdsForAdmin } from '@/lib/BuyandSellApis/fetchClassifiedAds' // ✅ Updated Import
import { ClassifiedAdListing } from '@/types/ClassifiedAdsType'
import { getServerSession } from 'next-auth'

export default async function BuySellListing() {
    const session = await getServerSession(authOptions)
    const token = session?.accessToken as string | undefined;
    
    // ✅ ডাটা ফেচ করা হচ্ছে অ্যাডমিন API থেকে (Pending সহ সব আসবে)
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

            <div>
                {/* ফিল্টার করা সেফ ডাটা পাঠানো হচ্ছে */}
                <DataTable columns={buySellListing_columns} data={safeListing} />
            </div>
        </>
    )
}