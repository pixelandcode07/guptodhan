import { ApiResponse, Vendor } from '@/types/VendorType';

export async function fetchAllVendors(token?: string): Promise<Vendor[]> {
  const baseUrl = process.env.NEXTAUTH_URL;

  if (!baseUrl) {
    console.error('API base URL is not configured');
    return [];
  }

  try {
    const headers: Record<string, string> = {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}/api/v1/vendors`, {
      method: 'GET',
      headers,
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch vendors'}`);
    }

    const result: ApiResponse<Vendor[]> = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data;
    }

    console.warn('All vendors API returned invalid data', {
      success: result.success,
      data: result.data,
    });

    return [];
  } catch (error) {
    console.error('Failed to fetch all vendors:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      url: `${baseUrl}/api/v1/vendors`,
    });

    return [];
  }
}