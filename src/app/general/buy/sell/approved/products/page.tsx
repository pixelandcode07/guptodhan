import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { buysell_approder_ads_columns } from "@/components/TableHelper/buysell_approder_ads_columns";
import { DataTable } from "@/components/TableHelper/data-table";
import { fetchClassifiedAds } from "@/lib/BuyandSellApis/fetchClassifiedAds";
import { ClassifiedAdListing } from "@/types/ClassifiedAdsType";
import { getServerSession } from "next-auth";

export default async function ApprovedBuySellProducts() {
  const session = await getServerSession(authOptions)
  const token = session?.accessToken as string | undefined;
  // console.log("Token in BuySellListing page:", token);
  const buySellProducts: ClassifiedAdListing[] = await fetchClassifiedAds(token)
  const buySellApprovedProducts = buySellProducts.filter(ad => ad.status === 'active');
  console.log("BuySellListing data:", buySellApprovedProducts);
  return (
    <>
      <div className='py-5'>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Buy Sell Listing</span>
        </h1>
      </div>

      <div>
        <DataTable columns={buysell_approder_ads_columns} data={buySellApprovedProducts} />
      </div>

    </>
  )
}
