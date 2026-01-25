// src/lib/MultiVendorApis/fetchAllStore.ts
// ✅ FIXED: Clean production version

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
    console.error('API base URL is not configured');
    return [];
  }

  try {
    const response = await axios.get<ApiResponse>(
      `${baseUrl}/api/v1/vendor-store`,
      {
        timeout: 15000,
        headers: { 'Cache-Control': 'no-cache' },
      }
    );

    if (!response.data?.success || !Array.isArray(response.data.data)) {
      return [];
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch stores:', error.message);
    return [];
  }
};

export const fetchAllPublicStores = async (): Promise<StoreInterface[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    console.error('API base URL is not configured');
    return [];
  }

  try {
    const response = await axios.get<ApiResponse>(
      `${baseUrl}/api/v1/public/vendor-store`,
      {
        timeout: 15000,
        headers: { 'Cache-Control': 'no-cache' },
      }
    );

    if (!response.data?.success || !Array.isArray(response.data.data)) {
      return [];
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch public stores:', error.message);
    return [];
  }
};