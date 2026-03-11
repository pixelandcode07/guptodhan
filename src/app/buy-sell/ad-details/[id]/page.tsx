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
  brand?: string;
  productModel?: string;
  edition?: string;
  category: { name: string };
  subCategory: { name: string };
  division: string;
  district: string;
  upazila: string;
  user: { _id: string; name: string; profilePicture?: string };
  createdAt: string;
  contactDetails: {
    name: string;
    phone: string;
    email?: string;
    isPhoneHidden: boolean;
  };
  isNegotiable?: boolean;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const baseUrl = process.env.NEXTAUTH_URL;

  try {
    const res = await axios.get(`${baseUrl}/api/v1/public/classifieds/ads/${id}`);
    const ad = res.data.data;

    return generateGuptodhanMetadata({
      title: `${ad.title} - ${ad.brand || ''} ${ad.edition || ''} | Guptodhan`,
      description: ad.description.slice(0, 160),
      urlPath: `/buy-sell/ad-details/${id}`,
      imageUrl: ad.images[0] || "/og-images/default-ad.jpg",
    });
  } catch {
    return generateGuptodhanMetadata({
      title: "Ad Not Found | Guptodhan",
      description: "The ad you're looking for is no longer available.",
    });
  }
}

export default async function AdDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const baseUrl = process.env.NEXTAUTH_URL;

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
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return <AdDetailsClient ad={ad} />;
}