import BuyandSellAdds from "./BuyandSellAdds";
import BuyandSellBanner from "./BuyandSellBanner";
import BuyandSellItems from "./BuyandSellItems";


export default function BuyandSellHome() {
    return (
        <div className='mt-5 max-w-7xl mx-auto'>
            <BuyandSellBanner />
            <BuyandSellItems />
            <BuyandSellAdds />
        </div>
    )
}
