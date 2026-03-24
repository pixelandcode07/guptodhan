import { ApiResponse } from '@/types/VendorType';
import axios, { AxiosError } from 'axios';
import { ClassifiedAdListing } from '@/types/ClassifiedAdsType';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client side
    return `${window.location.protocol}//${window.location.host}`;
  }
  
  // Server side: NEXT_PUBLIC_API_URL কে অগ্রাধিকার দেওয়া হলো
  const url = process.env.NEXT_PUBLIC_API_URL || process.env.NEXTAUTH_URL;
  if (!url) {
    console.warn('API base URL is missing in environment variables. Defaulting to localhost.');
    return 'http://localhost:3000';
  }
  return url;
};

// ----------------------------------------------------------------------
// ১. অথেনটিকেটেড ইউজারদের জন্য (My Ads ইত্যাদি)
// ----------------------------------------------------------------------
export async function fetchClassifiedAds(token?: string): Promise<ClassifiedAdListing[]> {
  const baseUrl = getBaseUrl();

  try {
    const headers: Record<string, string> = {
      'Cache-Control': 'no-store, no-cache, must-revalidate', // ✅ ক্যাশ বন্ধ করা হলো
      Pragma: 'no-cache',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios.get<ApiResponse<ClassifiedAdListing[]>>(
      `${baseUrl}/api/v1/classifieds/ads`,
      { 
        headers,
        params: { 
          _t: Date.now(), // ✅ Next.js এর অ্যাগ্রেসিভ ক্যাশ বাইপাস করার জন্য
          limit: 100 // ✅ একসাথে ১০০টি অ্যাড আনার জন্য (আপনার API সাপোর্ট করলে)
        }
      }
    );

    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    console.warn('Classified ads API: invalid response', response.data);
    return [];
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      console.error('Failed to fetch classified ads:', { status, message });
    } else if (error instanceof Error) {
      console.error('Unexpected error:', error.message);
    }
    return [];
  }
}

// ----------------------------------------------------------------------
// ২. পাবলিক পেজের জন্য (Homepage / All Ads)
// ----------------------------------------------------------------------
export async function fetchPublicClassifiedAds(): Promise<ClassifiedAdListing[]> {
  const baseUrl = getBaseUrl();

  try {
    const response = await axios.get<ApiResponse<ClassifiedAdListing[]>>(
      `${baseUrl}/api/v1/public/classifieds/ads`,
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate', // ✅ এখানে আগে ক্যাশ কন্ট্রোল ছিল না
          Pragma: 'no-cache',
        },
        params: { 
          _t: Date.now(), // ✅ ইউনিক রিকোয়েস্ট তৈরি করবে যাতে ক্যাশ না ধরে
          limit: 100 // ✅ ডিফল্ট পেজিনেশন এড়ানোর জন্য লিমিট বাড়িয়ে দেওয়া হলো
        }
      }
    );

    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    console.warn('Public classified ads API: invalid response', response.data);
    return [];
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      console.error('Failed to fetch public classified ads:', { status, message });
    } else if (error instanceof Error) {
      console.error('Unexpected error:', error.message);
    }
    return [];
  }
}