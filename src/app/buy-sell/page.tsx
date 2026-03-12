import BuyandSellHome from "./components/BuyandSellHome";
import { generateGuptodhanMetadata } from "@/lib/metadata/generateGuptodhanMetadata";


export async function generateMetadata() {
    return generateGuptodhanMetadata({
        title: "Buy & Sell | Guptodhan Marketplace",
        description:
            "Buy and sell new or used items in your city. Explore verified ads across electronics, vehicles, real estate, fashion, and more — only on Guptodhan.",
        urlPath: "/buy-sell",
        imageUrl: "/og-images/guptodhan-marketplace-banner.jpg",
    })
}

export default function BuySellPage() {
    return (
        // <div className="px-2 md:max-w-[80vw] mx-auto">
        <div className="md:max-w-[95vw] xl:container sm:px-8 mx-auto ">
            <BuyandSellHome />
        </div>
    )
}
