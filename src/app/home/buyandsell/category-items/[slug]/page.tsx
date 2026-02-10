import axios from 'axios';
import { generateGuptodhanMetadata } from '@/lib/metadata/generateGuptodhanMetadata';
import { notFound } from 'next/navigation';
import CategoryItemsClient from '../[id]/CategoryItemsClient';

// SEO Metadata (Dynamic)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cleanName = decodeURIComponent(slug).replace(/-/g, ' ');
  const titleName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

  return generateGuptodhanMetadata({
    title: `${titleName} Ads | Guptodhan Marketplace`, 
    description: `Buy and sell ${cleanName} in Bangladesh. Explore verified ads on Guptodhan.`,
    urlPath: `/home/buyandsell/category-items/${slug}`,
  });
}

export default async function CategoryItemsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'; // ফলব্যাক URL

  try {
    // 🔥 The Single Powerful API Call
    const res = await axios.get(`${baseUrl}/api/v1/public/classifieds/category-page/${slug}`, {
      // ক্যাশ এড়াতে চাইলে (Development এ), নাহলে Next.js বাই ডিফল্ট ক্যাশ করে
      headers: { 'Cache-Control': 'no-cache' } 
    });
    
    if (!res.data.success || !res.data.data) {
        return notFound();
    }

    const { category, ads, filters, priceRange } = res.data.data;

    return (
      <CategoryItemsClient
        initialAds={ads}
        filters={filters}
        priceRange={priceRange}
        category={category}
        categoryId={category._id} 
      />
    );

  } catch (error: any) {
    console.error('Category Page Error:', error.response?.data || error.message);
    return notFound(); // ৪৪০ দেখাবে যদি ক্যাটাগরি না থাকে
  }
}