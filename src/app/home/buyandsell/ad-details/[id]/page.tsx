import axios from 'axios';
import AdDetailsClient from './AdDetailsClient';
import { generateGuptodhanMetadata } from '@/lib/metadata/generateGuptodhanMetadata';

interface Ad {
  _id: string;
  title: string;
  price: number;
  images: string[];
  description: string;
  condition: string;
  authenticity: string;
  features: string[];
  district: string;
  division: string;
  upazila: string;
  brand?: { name: string };
  subCategory?: { name: string };
  user: { _id: string; name: string; profilePicture?: string };
  createdAt: string;
  contactDetails: {
    name: string;
    phone: string;
    email?: string;
    isPhoneHidden: boolean;
  };
}

export async function generateMetadata() {
  return generateGuptodhanMetadata({
    title: "Product Details | Guptodhan Marketplace",
    description:
      "Buy and sell new or used items in your city. Explore verified ads across electronics, vehicles, real estate, fashion, and more — only on Guptodhan.",
    urlPath: `/home/buyandsell/category-items`,
    imageUrl: "/og-images/guptodhan-marketplace-banner.jpg",
  })
}



export default async function AdDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const baseUrl = process.env.NEXTAUTH_URL

  let ad: Ad | null = null;
  let error = null;

  try {
    const res = await axios.get(`${baseUrl}/api/v1/public/classifieds/ads/${id}`);
    ad = res.data.data;
  } catch (err: any) {
    error = err.response?.data?.message || 'Ad not found';
  }

  if (!ad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return <AdDetailsClient ad={ad} />;
}