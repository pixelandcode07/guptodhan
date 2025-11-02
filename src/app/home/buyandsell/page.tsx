import axios from "axios";
import BuyandSellHome from "./components/BuyandSellHome";
import { Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = process.env.NEXTAUTH_URL;

    try {
        // Optional: Fetch some public data (like total ads or popular categories)
        const { data } = await axios.get(`${baseUrl}/api/v1/public/classifieds-categories/with-ad-counts`);
        const stats = data?.data || {};

        const title = `Buy & Sell - ${stats.totalAds ?? "Thousands"} Ads | Guptodhan Marketplace`;
        const description =
            "Buy and sell new or used items in your city. Explore verified ads across electronics, vehicles, real estate, fashion, and more — only on Guptodhan.";

        const image = `${baseUrl}/og-images/buy-sell-banner.jpg`;

        return {
            title,
            description,
            alternates: { canonical: `${baseUrl}/home/buyandsell` },
            openGraph: {
                title,
                description,
                url: `${baseUrl}/home/buyandsell`,
                siteName: "Guptodhan Marketplace",
                type: "website",
                images: [
                    {
                        url: image,
                        width: 1200,
                        height: 630,
                        alt: "Guptodhan Buy & Sell Marketplace",
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                images: [image],
            },
            other: {
                "facebook-domain-verification": "YOUR_FB_VERIFICATION_CODE",
                "og:locale": "en_US",
                "og:type": "website",
            },
        };
    } catch (error) {
        console.error("Metadata fetch failed:", error);
        return {
            title: "Buy & Sell | Guptodhan Marketplace",
            description: "Explore items for sale and post your ads easily on Guptodhan.",
        };
    }
}


export default function BuySellPage() {
    return (
        <div>
            <BuyandSellHome />
        </div>
    )
}
