import axios from 'axios';
import CategoryItemsClient from './CategoryItemsClient';
import { generateGuptodhanMetadata } from '@/lib/metadata/generateGuptodhanMetadata';


interface FilterData {
  subCategories: { name: string; count: number }[];
  locations: { name: string; count: number }[];
  brand: { brand: string; count: number }[];
}

interface Ad {
  _id: string;
  title: string;
  price: number;
  images: string[];
  subCategory?: { _id: string; name: string };
  district?: string;
  brand?: string;
  division?: string;
  upazila?: string;
  condition?: string;
}

export async function generateMetadata() {
  return generateGuptodhanMetadata({
    title: "View Buy & Sell Ads | Guptodhan Marketplace",
    description:
      "Buy and sell new or used items in your city. Explore verified ads across electronics, vehicles, real estate, fashion, and more — only on Guptodhan.",
    urlPath: `/home/buyandsell/category-items`,
    imageUrl: "/og-images/guptodhan-marketplace-banner.jpg",
  })
}


export default async function CategoryItemsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const baseUrl = process.env.NEXTAUTH_URL;

  let ads: Ad[] = [];
  let category: any = { name: 'Loading...', adCount: 0 };
  let filters: FilterData = { subCategories: [], locations: [], brand: [] };
  let priceRange = { min: 0, max: 1000000 };

  try {
    // ১1. Category add counts
    const catRes = await axios.get(`${baseUrl}/api/v1/public/classifieds-categories/with-ad-counts`);
    const foundCat = catRes.data.data.find((c: any) => c._id === id);
    category = foundCat || { name: 'Unknown Category', adCount: 0 };

    // 2. get ads from category
    const adsRes = await axios.get(`${baseUrl}/api/v1/public/classifieds/ads/by-category/${id}`);
    // const filtered = adsRes.data.data.filter((ad: any) => ad.status === 'active');
    ads = adsRes.data.data || [];

    // 3. get filters by category
    const filterRes = await axios.get(`${baseUrl}/api/v1/public/classifieds/filters?categoryId=${id}`);
    filters = filterRes.data.data || filters;

    // 4. get price range 
    if (ads.length > 0) {
      const prices = ads.map(a => a.price);
      priceRange.min = Math.floor(Math.min(...prices) / 1000) * 1000;
      priceRange.max = Math.ceil(Math.max(...prices) / 1000) * 1000;
    }
  } catch (error) {
    console.error('API Error:', error);
  }

  return (
    <CategoryItemsClient
      initialAds={ads}
      filters={filters}
      priceRange={priceRange}
      category={category}
      categoryId={id}
    />
  );
}