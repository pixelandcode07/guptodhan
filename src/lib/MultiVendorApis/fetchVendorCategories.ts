import { ApiResponse, VendorCategory } from '@/types/VendorCategoryType';
import axios, { AxiosError } from 'axios';
export async function fetchVendorCategories(token?: string): Promise<VendorCategory[]> {
  const baseUrl = process.env.NEXTAUTH_URL;

  if (!baseUrl) {
    console.error('API base URL is not configured');
    return [];
  }

  try {
    const headers: Record<string, string> = {
      'Cache-Control': 'no-store'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios.get<ApiResponse<VendorCategory[]>>(
      `${baseUrl}/api/v1/public/vendor-category`,
      {
        headers
      }
    );

    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    console.warn('Vendor categories API returned no data or invalid format', {
      success: response.data.success,
      data: response.data.data,
    });

    return [];
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      console.error('Failed to fetch vendor categories:', {
        status,
        message,
        url: `${baseUrl}/api/v1/vendor-category`,
      });
    } else if (error instanceof Error) {
      console.error('Unexpected error while fetching vendor categories:', {
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error('Unknown error occurred while fetching vendor categories');
    }

    return [];
  }
}