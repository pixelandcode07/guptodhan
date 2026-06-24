import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { buysell_approder_ads_columns } from "@/components/TableHelper/buysell_approder_ads_columns";
import { DataTable } from "@/components/TableHelper/data-table";
import { fetchClassifiedAds } from "@/lib/BuyandSellApis/fetchClassifiedAds";
import { ClassifiedAdListing } from "@/types/ClassifiedAdsType";
import { getServerSession } from "next-auth";

export default async function ApprovedBuySellProducts() {
  const session = await getServerSession(authOptions)
  const token = session?.accessToken as string | undefined;
  
  const buySellProducts: ClassifiedAdListing[] = await fetchClassifiedAds(token)

  const buySellApprovedProducts = Array.isArray(buySellProducts) 
    ? buySellProducts.filter(ad => ad && ad.user && ad.status === 'active')
    : [];

  console.log(`Showing ${buySellApprovedProducts.length} approved ads with valid users.`);

  return (
    <>
      <div className='py-5'>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Approved Buy Sell Listing ({buySellApprovedProducts.length})</span>
        </h1>
      </div>

      <div>
        <DataTable columns={buysell_approder_ads_columns} data={buySellApprovedProducts} />
      </div>
    </>
  )
}