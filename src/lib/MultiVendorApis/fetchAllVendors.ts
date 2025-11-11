import { ApiResponse, Vendor } from '@/types/VendorType';
import axios, { AxiosError } from 'axios';

export async function fetchAllVendors(token?: string): Promise<Vendor[]> {
  const baseUrl = process.env.NEXTAUTH_URL;

  if (!baseUrl) {
    console.error('API base URL is not configured');
    return [];
  }

  try {
    const headers: Record<string, string> = {
      'Cache-Control': 'no-store',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios.get<ApiResponse<Vendor[]>>(
      `${baseUrl}/api/v1/vendors`,
      { headers }
    );

    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    console.warn('All vendors API returned no data or invalid format', {
      success: response.data.success,
      data: response.data.data,
    });

    return [];
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      console.error('Failed to fetch all vendors:', {
        status,
        message,
        url: `${baseUrl}/api/v1/vendors`,
      });
    } else if (error instanceof Error) {
      console.error('Unexpected error while fetching all vendors:', {
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error('Unknown error occurred while fetching all vendors');
    }

    return [];
  }
}