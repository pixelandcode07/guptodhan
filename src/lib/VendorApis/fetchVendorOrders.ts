import axios from 'axios';
import type {
  VendorOrdersApiResponse,
  Store,
  VendorOrder,
} from '@/types/VendorOrderTypes';

export const fetchVendorOrders = async (
  vendorId: string,
  token?: string
): Promise<{ store: Store; orders: VendorOrder[] }> => {
  
  // ✅ VPS Optimization: Use Public Base URL or Fallback to domain
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guptodhandigital.com';

  if (!vendorId) {
    throw new Error('Vendor ID is required');
  }

  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.get<VendorOrdersApiResponse>(
      `${baseUrl}/api/v1/vendor-store/vendorOrder/${vendorId}`,
      { headers, timeout: 15000 }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch vendor orders');
    }

    const data = response.data.data;

    return {
      store: data?.store || ({} as Store),
      orders: data?.orders || [],
    };
  } catch (error: any) {
    console.error('❌ [API Error]: fetchVendorOrders failed', error.message);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'অর্ডারগুলো লোড করতে সমস্যা হচ্ছে।'
    );
  }
};