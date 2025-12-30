// src/lib/VendorApis/fetchVendorOrders.ts

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
  const baseUrl = process.env.NEXTAUTH_URL;

  if (!baseUrl) {
    console.error('API base URL is not configured');
    return {
      store: {} as Store,
      orders: [],
    };
  }

  if (!vendorId) {
    throw new Error('vendorId is required');
  }

  try {
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.get<VendorOrdersApiResponse>(
      `${baseUrl}/api/v1/vendor-store/vendorOrder/${vendorId}`,
      { headers }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch vendor orders');
    }

    const { store, orders } = response.data.data;

    return {
      store,
      orders: orders || [],
    };
  } catch (error: any) {
    console.error('Axios Error: Failed to fetch vendor orders', error.message || error);

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        'Failed to fetch vendor orders'
    );
  }
};