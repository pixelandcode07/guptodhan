import BuyandSellAdds from "./BuyandSellAdds";
import BuyandSellBanner from "./BuyandSellBanner";
import BuyandSellItems from "./BuyandSellItems";
import { fetchAllBuySellData } from "@/lib/BuyandSellApis/fetchAllBuySellData";
import { fetchBuySellBanner } from "@/lib/BuyandSellApis/fetchBuySellBanner";



export default async function BuyandSellHome() {
    const banner = await fetchBuySellBanner();
    const allCategory = await fetchAllBuySellData();
    return (
        <div className='mt-5 max-w-7xl mx-auto'>
            <BuyandSellBanner banner={banner} />
            <BuyandSellItems allCategory={allCategory} />
            <BuyandSellAdds />
        </div>
    )
}