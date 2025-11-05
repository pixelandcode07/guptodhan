// import axios from "axios";
// import Image from "next/image";
// import PageHeader from "@/components/ReusableComponents/PageHeader";
// import { Metadata } from "next";

// export async function generateMetadata(): Promise<Metadata> {
//     const baseUrl = process.env.NEXTAUTH_URL;

//     try {
//         // Optional: Fetch some public data (like total ads or popular categories)
//         const { data } = await axios.get(`${baseUrl}/api/v1/public/classifieds-categories/with-ad-counts`);
//         const stats = data?.data || {};

//         const title = `Category Details - ${stats.adCount ?? "Thousands"} Ads | Guptodhan Marketplace`;
//         const description =
//             "Buy and sell new or used items in your city. Explore verified ads across electronics, vehicles, real estate, fashion, and more — only on Guptodhan.";

//         const image = `${baseUrl}/og-images/buy-sell-banner.jpg`;

//         return {
//             title,
//             description,
//             alternates: { canonical: `${baseUrl}/home/buyandsell` },
//             openGraph: {
//                 title,
//                 description,
//                 url: `${baseUrl}/home/buyandsell`,
//                 siteName: "Guptodhan Marketplace",
//                 type: "website",
//                 images: [
//                     {
//                         url: image,
//                         width: 1200,
//                         height: 630,
//                         alt: "Guptodhan Buy & Sell Marketplace",
//                     },
//                 ],
//             },
//             twitter: {
//                 card: "summary_large_image",
//                 title,
//                 description,
//                 images: [image],
//             },
//             other: {
//                 "facebook-domain-verification": "YOUR_FB_VERIFICATION_CODE",
//                 "og:locale": "en_US",
//                 "og:type": "website",
//             },
//         };
//     } catch (error) {
//         console.error("Metadata fetch failed:", error);
//         return {
//             title: "Category Details | Guptodhan Marketplace",
//             description: "Explore items for sale and post your ads easily on Guptodhan.",
//         };
//     }
// }


// interface AdType {
//     _id: string;
//     title: string;
//     price: number;
//     images: string[];
//     brand?: string;
//     condition?: string;
//     authenticity?: string;
//     location?: string;
// }



// export default async function CategoryDetailsPage({
//     params,
// }: {
//     params: Promise<{ id: string }>
// }) {
//     const { id } = await params; // ✅ unwrap the promise

//     const baseUrl = process.env.NEXTAUTH_URL;

//     try {
//         const { data } = await axios.get(
//             `${baseUrl}/api/v1/public/classifieds/ads/by-category/${id}`,
//             { headers: { "Cache-Control": "no-store" } }
//         );

//         const ads = data.data || [];

//         return (
//             <div className="max-w-7xl mx-auto mt-10 px-4">
//                 <PageHeader title="Category Details" />
//                 {ads.length === 0 ? (
//                     <p className="text-center text-gray-500 mt-10">
//                         No ads found for this category.
//                     </p>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
//                         {ads.map((ad: any) => (
//                             <div
//                                 key={ad._id}
//                                 className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-all overflow-hidden"
//                             >
//                                 <Image
//                                     src={ad.images?.[0] || "/placeholder.png"}
//                                     alt={ad.title}
//                                     width={400}
//                                     height={250}
//                                     className="w-full h-48 object-cover"
//                                 />
//                                 <div className="p-3">
//                                     <h2 className="font-semibold text-gray-800">{ad.title}</h2>
//                                     <p className="text-sm text-gray-500">{ad.brand || "—"}</p>
//                                     <p className="text-blue-600 font-semibold">৳ {ad.price}</p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         );
//     } catch (error: any) {
//         console.error("Error fetching ads:", error.response?.data || error.message);
//         return (
//             <div className="max-w-7xl mx-auto mt-10 px-4 text-center text-red-500">
//                 <PageHeader title="Category Details" />
//                 <p>⚠️ Failed to load ads. Please check the server logs.</p>
//             </div>
//         );
//     }
// }



import axios from "axios";
import Image from "next/image";
import { Metadata } from "next";
import { Search, ChevronRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface Ad {
  _id: string;
  title: string;
  price: number;
  images: string[];
  brand?: string;
  condition?: string;
  authenticity?: string;
  location?: string;
  isVerified?: boolean;
  sellerName?: string;
  category?: string;
}

interface CategoryData {
  name: string;
  adCount: number;
  parentPath: string[];
}

// export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
    const { data } = await axios.get(`${baseUrl}/api/v1/public/classifieds-categories/with-ad-counts`);
    const stats = data?.data?.[id] || {};

    const title = `${stats.name || "Category"} - ${stats.adCount || "Many"} Ads | Guptodhan`;
    const description = `Buy and sell ${stats.name || "items"} in Bangladesh. Verified local ads, best prices.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${baseUrl}/home/buyandsell/buy-sell/category/category-items/${id}`,
        images: [`${baseUrl}/og-images/buy-sell-banner.jpg`],
      },
    };
  } catch {
    return {
      title: "Category | Guptodhan Marketplace",
      description: "Explore local classifieds.",
    };
  }
}

export default async function CategoryItemsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  let ads: Ad[] = [];
  let category: CategoryData | null = null;

  try {
    const [adsRes, catRes] = await Promise.all([
      axios.get(`${baseUrl}/api/v1/public/classifieds/ads/by-category/${id}`, {
        headers: { "Cache-Control": "no-store" },
      }),
      axios.get(`${baseUrl}/api/v1/public/classifieds-categories/with-ad-counts`),
    ]);

    ads = adsRes.data.data || [];
    const allCats = catRes.data.data || {};
    category = allCats[id] || { name: "Unknown", adCount: ads.length, parentPath: [] };
  } catch (error: any) {
    console.error("Failed to fetch data:", error.message);
  }

  const breadcrumb = ["Home", "Buy & Sell", "All Categories", ...(category?.parentPath || []), category?.name || "Items"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Search Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/home/buyandsell" className="text-green-600 font-bold text-xl">
              Guptodhan
            </Link>
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Input
                  placeholder="What are you looking for?"
                  className="pl-10 pr-12 h-11 rounded-full border-gray-300"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-yellow-500 p-2 rounded-full hover:bg-yellow-600 transition">
                  <Search className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2 text-sm text-gray-600">
          <nav className="flex items-center gap-1 flex-wrap">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb} className="flex items-center">
                {i > 0 && <ChevronRight className="w-4 h-4 mx-1" />}
                {i === breadcrumb.length - 1 ? (
                  <span className="font-medium text-gray-900">{crumb}</span>
                ) : (
                  <Link href="#" className="hover:text-green-600">
                    {crumb}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-80 space-y-6">
            {/* Price Range */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4">PRICE RANGE</h3>
              <Slider defaultValue={[42990]} max={459990} step={1000} className="mb-3" />
              <div className="flex justify-between text-sm">
                <span className="font-medium">৳42,990</span>
                <span className="text-gray-500">—</span>
                <span className="font-medium">৳459,990</span>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Categories</h3>
              <div className="space-y-2">
                {[
                  "For streaming & media editing",
                  "For gaming",
                  "For video editing",
                  "Industrial use",
                  "For music production",
                  "Ultra-lightweight",
                ].map((cat) => (
                  <Label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox />
                    <span>{cat}</span>
                  </Label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Location</h3>
              <Label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <Checkbox defaultChecked />
                <span>All of Bangladesh</span>
              </Label>
              <Separator className="my-3" />
              {[
                { name: "Dhaka", count: 0 },
                { name: "Mirpur", count: 1770 },
                { name: "Savar", count: 922 },
                { name: "Uttara", count: 562 },
                { name: "Jatrabari", count: 338 },
                { name: "Mohammadpur", count: 241 },
              ].map((loc) => (
                <Label key={loc.name} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox />
                  <span>
                    {loc.name} {loc.count > 0 && `(${loc.count})`}
                  </span>
                </Label>
              ))}
            </div>

            {/* Brand */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Brand</h3>
              <div className="space-y-2">
                {["Lenovo", "Asus", "HP", "Dell", "Macbook"].map((brand) => (
                  <Label key={brand} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox />
                    <span>{brand}</span>
                  </Label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">
                {category?.name || "Items"} for Sale in Bangladesh
              </h1>
              <p className="text-sm text-gray-600">
                Showing 1–{ads.length} of {category?.adCount || ads.length} ads
              </p>
            </div>

            {ads.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No ads found in this category.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ads.map((ad) => (
                  <Link
                    key={ad._id}
                    href={`/home/buyandsell/buy-sell/ad/${ad._id}`}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                  >
                    <div className="relative aspect-video bg-gray-100">
                      <Image
                        src={ad.images?.[0] || "/placeholder.png"}
                        alt={ad.title}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                      />
                      <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition">
                        <MapPin className="w-4 h-4 text-red-500" />
                      </button>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-lg line-clamp-2">{ad.title}</h3>

                      {ad.isVerified && (
                        <div className="flex gap-1 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            MEMBER
                          </Badge>
                          <Badge className="bg-green-600 text-white text-xs">
                            VERIFIED SELLER
                          </Badge>
                        </div>
                      )}

                      <p className="text-sm text-gray-600">
                        {ad.location || "Bangladesh"}
                        {ad.brand && `, ${ad.brand}`}
                      </p>

                      <div className="flex justify-between items-center">
                        <p className="text-xl font-bold text-green-600">
                          Tk {ad.price.toLocaleString()}
                        </p>
                        <div className="flex gap-2">
                          <button className="p-1.5 bg-orange-100 rounded-full hover:bg-orange-200 transition">
                            <MapPin className="w-4 h-4 text-orange-600" />
                          </button>
                          <button className="p-1.5 bg-red-100 rounded-full hover:bg-red-200 transition">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((p) => (
                <button
                  key={p}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    p === 1 ? "bg-green-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button className="px-4 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-100">
                Next
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}