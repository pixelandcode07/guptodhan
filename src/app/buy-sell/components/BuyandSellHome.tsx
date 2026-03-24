import { fetchPublicClassifiedAds } from "@/lib/BuyandSellApis/fetchClassifiedAds";
import BuyandSellAdds from "./BuyandSellAdds";
import BuyandSellBanner from "./BuyandSellBanner";
import BuyandSellItems from "./BuyandSellItems";
import { fetchAllBuySellData } from "@/lib/BuyandSellApis/fetchAllBuySellData";
import { fetchBuySellBanner } from "@/lib/BuyandSellApis/fetchBuySellBanner";
import { Suspense } from "react";
import SectionSkeleton from "@/components/ReusableComponents/SectionSkeleton";



export default async function BuyandSellHome() {

    const banner = await fetchBuySellBanner();
    const allCategory = await fetchAllBuySellData();
    const allAds = await fetchPublicClassifiedAds();
    // console.log("All Ads:", allAds);
    return (
        <div className='space-y-6'>
            <div className="pt-8">
                <BuyandSellBanner banner={banner} />
            </div>
            <BuyandSellItems allCategory={allCategory} />

            <Suspense fallback={<SectionSkeleton title="Best Selling" count={6} />}>
                {/* <BestSell products={bestSelling} topShoppage={topShoppage} /> */}
                <BuyandSellAdds allAds={allAds} />

            </Suspense>
        </div>
    )
}