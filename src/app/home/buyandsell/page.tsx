import BuyandSellHome from "./components/BuyandSellHome";
import { generateGuptodhanMetadata } from "@/lib/metadata/generateGuptodhanMetadata";


export async function generateMetadata() {
    return generateGuptodhanMetadata({
        title: "Buy & Sell | Guptodhan Marketplace",
        description:
            "Buy and sell new or used items in your city. Explore verified ads across electronics, vehicles, real estate, fashion, and more — only on Guptodhan.",
        urlPath: "/home/buyandsell",
        imageUrl: "/og-images/guptodhan-marketplace-banner.jpg",
    })
}

export default function BuySellPage() {
    return (
        <div>
            <BuyandSellHome />
        </div>
    )
}
