import axios from "axios";
import Image from "next/image";
import PageHeader from "@/components/ReusableComponents/PageHeader";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = process.env.NEXTAUTH_URL;

    try {
        // Optional: Fetch some public data (like total ads or popular categories)
        const { data } = await axios.get(`${baseUrl}/api/v1/public/classifieds-categories/with-ad-counts`);
        const stats = data?.data || {};

        const title = `Category Details - ${stats.adCount ?? "Thousands"} Ads | Guptodhan Marketplace`;
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
            title: "Category Details | Guptodhan Marketplace",
            description: "Explore items for sale and post your ads easily on Guptodhan.",
        };
    }
}


interface AdType {
    _id: string;
    title: string;
    price: number;
    images: string[];
    brand?: string;
    condition?: string;
    authenticity?: string;
    location?: string;
}

// export default async function CategoryDetailsPage({ params }: { params: { id: string } }) {
//   const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

//   try {
//     const { data } = await axios.get(
//       `${baseUrl}/api/v1/public/classifieds/ads/by-category/${params.id}`,
//       { headers: { "Cache-Control": "no-store" } }
//     );

//     const ads: AdType[] = data.data || [];

//     return (
//       <div className="max-w-7xl mx-auto mt-10 px-4">
//         <PageHeader title="Category Details" />

//         {ads.length === 0 ? (
//           <p className="text-center text-gray-500 mt-10">No ads found for this category.</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
//             {ads.map((ad) => (
//               <div
//                 key={ad._id}
//                 className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-all overflow-hidden"
//               >
//                 <Image
//                   src={ad.images?.[0] || "/placeholder.png"}
//                   alt={ad.title}
//                   width={400}
//                   height={250}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-3">
//                   <h2 className="font-semibold text-gray-800">{ad.title}</h2>
//                   <p className="text-sm text-gray-500">{ad.brand || "—"}</p>
//                   <p className="text-blue-600 font-semibold">৳ {ad.price}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   } catch (error: any) {
//     console.error("Error fetching ads:", error.response?.data || error.message);

//     return (
//       <div className="max-w-7xl mx-auto mt-10 px-4 text-center text-red-500">
//         <PageHeader title="Category Details" />
//         <p>⚠️ Failed to load ads. Please check the server logs.</p>
//       </div>
//     );
//   }
// }

export default async function CategoryDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params; // ✅ unwrap the promise

    const baseUrl = process.env.NEXTAUTH_URL;

    try {
        const { data } = await axios.get(
            `${baseUrl}/api/v1/public/classifieds/ads/by-category/${id}`,
            { headers: { "Cache-Control": "no-store" } }
        );

        const ads = data.data || [];

        return (
            <div className="max-w-7xl mx-auto mt-10 px-4">
                <PageHeader title="Category Details" />
                {ads.length === 0 ? (
                    <p className="text-center text-gray-500 mt-10">
                        No ads found for this category.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                        {ads.map((ad: any) => (
                            <div
                                key={ad._id}
                                className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-all overflow-hidden"
                            >
                                <Image
                                    src={ad.images?.[0] || "/placeholder.png"}
                                    alt={ad.title}
                                    width={400}
                                    height={250}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-3">
                                    <h2 className="font-semibold text-gray-800">{ad.title}</h2>
                                    <p className="text-sm text-gray-500">{ad.brand || "—"}</p>
                                    <p className="text-blue-600 font-semibold">৳ {ad.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    } catch (error: any) {
        console.error("Error fetching ads:", error.response?.data || error.message);
        return (
            <div className="max-w-7xl mx-auto mt-10 px-4 text-center text-red-500">
                <PageHeader title="Category Details" />
                <p>⚠️ Failed to load ads. Please check the server logs.</p>
            </div>
        );
    }
}

