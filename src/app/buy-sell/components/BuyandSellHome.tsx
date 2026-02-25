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
        <div className='mt-5 max-w-7xl mx-auto'>
            <BuyandSellBanner banner={banner} />
            <BuyandSellItems allCategory={allCategory} />
            {/* <BuyandSellAdds allAds={allAds} /> */}
            <Suspense fallback={<SectionSkeleton title="Best Selling" count={6} />}>
                {/* <BestSell products={bestSelling} topShoppage={topShoppage} /> */}
                <BuyandSellAdds allAds={allAds} />

            </Suspense>
        </div>
    )
}