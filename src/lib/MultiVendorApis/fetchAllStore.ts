// src/lib/MultiVendorApis/fetchAllStore.ts
// ✅ FIXED: Proper error handling + null safety + timeout

import { StoreInterface } from '@/types/StoreInterface';
import axios from 'axios';

export interface ApiResponse {
  success: boolean;
  message: string;
  data: StoreInterface[];
}

export const fetchAllStores = async (): Promise<StoreInterface[]> => {
  const baseUrl = process.env.NEXTAUTH_URL;

  if (!baseUrl) {
    console.error('❌ [fetchAllStores] API base URL (NEXTAUTH_URL) is not configured');
    return [];
  }

  try {
    const response = await axios.get<ApiResponse>(
      `${baseUrl}/api/v1/vendor-store`,
      {
        timeout: 15000, // ✅ 15 second timeout
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    );

    // ✅ Validate response structure
    if (!response.data) {
      console.warn('⚠️ [fetchAllStores] Empty response from API');
      return [];
    }

    if (!Array.isArray(response.data.data)) {
      console.warn('⚠️ [fetchAllStores] Response data is not an array:', response.data);
      return [];
    }

    console.log(`✅ [fetchAllStores] Successfully fetched ${response.data.data.length} stores`);
    return response.data.data;
  } catch (error: any) {
    console.error('❌ [fetchAllStores] Axios Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });
    // ✅ Return empty array instead of throwing
    return [];
  }
};

export const fetchAllPublicStores = async (): Promise<StoreInterface[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    console.error('❌ [fetchAllPublicStores] API base URL (NEXT_PUBLIC_API_URL) is not configured');
    return [];
  }

  try {
    const response = await axios.get<ApiResponse>(
      `${baseUrl}/api/v1/public/vendor-store`,
      {
        timeout: 15000, // ✅ 15 second timeout
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    );

    // ✅ Validate response structure
    if (!response.data) {
      console.warn('⚠️ [fetchAllPublicStores] Empty response from API');
      return [];
    }

    if (!response.data.success) {
      console.warn('⚠️ [fetchAllPublicStores] API returned success: false', response.data.message);
      return [];
    }

    if (!Array.isArray(response.data.data)) {
      console.warn('⚠️ [fetchAllPublicStores] Response data is not an array:', response.data);
      return [];
    }

    console.log(`✅ [fetchAllPublicStores] Successfully fetched ${response.data.data.length} public stores`);
    return response.data.data;
  } catch (error: any) {
    console.error('❌ [fetchAllPublicStores] Axios Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
    });
    // ✅ Return empty array instead of throwing
    return [];
  }
};