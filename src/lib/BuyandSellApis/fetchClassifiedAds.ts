import { ApiResponse } from '@/types/VendorType';
import { ClassifiedAdListing } from '@/types/ClassifiedAdsType';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client side
    return `${window.location.protocol}//${window.location.host}`;
  }
  
  // Server side: NEXT_PUBLIC_API_URL কে অগ্রাধিকার দেওয়া হলো
  const url = process.env.NEXT_PUBLIC_API_URL || process.env.NEXTAUTH_URL;
  if (!url) {
    console.warn('API base URL is missing in environment variables. Defaulting to localhost.');
    return 'https://guptodhan.com';
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
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // URL Setup
    const url = new URL(`${baseUrl}/api/v1/classifieds/ads`);
    url.searchParams.append('limit', '100'); // একসাথে ১০০টি অ্যাড আনার জন্য

    // ✅ Axios এর বদলে Native fetch ব্যবহার করা হলো
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
      cache: 'no-store', // ✅ Next.js এর ক্যাশিং ১০০% বন্ধ করার একমাত্র উপায়
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData: ApiResponse<ClassifiedAdListing[]> = await response.json();

    if (responseData.success && Array.isArray(responseData.data)) {
      return responseData.data;
    }

    console.warn('Classified ads API: invalid response', responseData);
    return [];
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to fetch classified ads:', error.message);
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
    // URL Setup
    const url = new URL(`${baseUrl}/api/v1/public/classifieds/ads`);
    url.searchParams.append('limit', '100');

    // ✅ Axios এর বদলে Native fetch ব্যবহার করা হলো
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // ✅ এখানেও ক্যাশিং সম্পূর্ণ বন্ধ করা হলো
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData: ApiResponse<ClassifiedAdListing[]> = await response.json();

    if (responseData.success && Array.isArray(responseData.data)) {
      return responseData.data;
    }

    console.warn('Public classified ads API: invalid response', responseData);
    return [];
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to fetch public classified ads:', error.message);
    }
    return [];
  }
}