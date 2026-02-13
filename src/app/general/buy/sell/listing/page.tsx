import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { buySellListing_columns } from '@/components/TableHelper/buySellListing_columns'
import { DataTable } from '@/components/TableHelper/data-table'
import { fetchClassifiedAds } from '@/lib/BuyandSellApis/fetchClassifiedAds'
import { ClassifiedAdListing } from '@/types/ClassifiedAdsType'
import { getServerSession } from 'next-auth'


export default async function BuySellListing() {
    const session = await getServerSession(authOptions)
    const token = session?.accessToken as string | undefined;
    const buySellListing: ClassifiedAdListing[] = await fetchClassifiedAds(token)
    return (
        <>
            <div className='py-5'>
                <h1 className="text-lg font-semibold border-l-2 border-blue-500">
                    <span className="pl-5">Buy Sell Listing</span>
                </h1>
            </div>


            <div>
                <DataTable columns={buySellListing_columns} data={buySellListing} />
            </div>
        </>
    )
}
