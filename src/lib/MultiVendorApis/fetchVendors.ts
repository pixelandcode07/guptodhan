
import { ApiResponse, Vendor } from '@/types/VendorType';
import axios, { AxiosError } from 'axios';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // client side
    return `${window.location.protocol}//${window.location.host}`;
  }
  // server side
  const url = process.env.NEXTAUTH_URL;
  if (!url) {
    console.error('NEXTAUTH_URL is not set in .env.local');
    throw new Error('API base URL is missing');
  }
  return url;
};

export async function fetchVendors(token?: string): Promise<Vendor[]> {
  const baseUrl = getBaseUrl();

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

    console.warn('Vendors API: invalid response', response.data);
    return [];
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      console.error('Failed to fetch vendors:', { status, message });
    } else if (error instanceof Error) {
      console.error('Unexpected error:', error.message);
    }
    return [];
  }
}


export async function fetchPublicVendors(): Promise<Vendor[]> {
  const baseUrl = getBaseUrl();

  try {
    // const headers: Record<string, string> = {
    //   'Cache-Control': 'no-store',
    // };

    // if (token) {
    //   headers['Authorization'] = `Bearer ${token}`;
    // }

    const response = await axios.get<ApiResponse<Vendor[]>>(
      `${baseUrl}/api/v1/public/vendors`,
    );

    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    console.warn('Vendors API: invalid response', response.data);
    return [];
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      console.error('Failed to fetch vendors:', { status, message });
    } else if (error instanceof Error) {
      console.error('Unexpected error:', error.message);
    }
    return [];
  }
}