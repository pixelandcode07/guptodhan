// src/lib/VendorApis/fetchVendorOrders.ts

import axios from 'axios';
import type {
  VendorOrdersApiResponse,
  Store,
  VendorOrder,
} from '@/types/VendorOrderTypes';

/**
 * @description ভেন্ডরের স্টোর এবং অর্ডারগুলো ফেচ করার জন্য প্রফেশনাল এপিআই ইউটিলিটি।
 * এটি VPS এবং লোকাল উভয় এনভায়রনমেন্টে কাজ করবে।
 */
export const fetchVendorOrders = async (
  vendorId: string,
  token?: string
): Promise<{ store: Store; orders: VendorOrder[] }> => {
  
  // ✅ VPS Optimization: NEXTAUTH_URL অনেক সময় সার্ভার সাইডে কাজ করে না। 
  // তাই NEXT_PUBLIC_BASE_URL ব্যবহার করা সবচেয়ে নিরাপদ।
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guptodhandigital.com';

  if (!vendorId) {
    throw new Error('Vendor ID পাওয়া যায়নি। দয়া করে আবার লগইন করুন।');
  }

  try {
    const headers: Record<string, string> = {};

    // টোকেন থাকলে সেটি হেডার হিসেবে পাঠিয়ে দাও
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // এপিআই কল
    const response = await axios.get<VendorOrdersApiResponse>(
      `${baseUrl}/api/v1/vendor-store/vendorOrder/${vendorId}`,
      { 
        headers,
        timeout: 10000 // ১০ সেকেন্ডের বেশি সময় নিলে টাইমআউট দিবে
      }
    );

    // রেসপন্স সাকসেস না হলে এরর থ্রো করো
    if (!response.data.success) {
      throw new Error(response.data.message || 'অর্ডারগুলো লোড করতে ব্যর্থ হয়েছে।');
    }

    // ডাটা স্ট্রাকচার চেক করে রিটার্ন করো
    const data = response.data.data;

    return {
      store: data?.store || ({} as Store),
      orders: data?.orders || [],
    };

  } catch (error: any) {
    // ডিটেইলড এরর লগ যাতে ডিবাগ করা সহজ হয়
    console.error('❌ [API Error - fetchVendorOrders]:', {
      message: error.message,
      response: error.response?.data
    });

    // ইউজারের জন্য সুন্দর এরর মেসেজ
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'অর্ডারগুলো লোড করার সময় একটি সমস্যা হয়েছে।'
    );
  }
};