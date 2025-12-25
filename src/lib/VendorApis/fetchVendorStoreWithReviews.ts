import { Product, Store, ApiResponse } from '@/types/VendorStoreWithReviewsTypes';
import axios from 'axios';

export const fetchVendorStoreWithReviews = async (
    vendorId: string,
    token?: string
): Promise<{ store: Store; products: Product[] }> => {
    const baseUrl = process.env.NEXTAUTH_URL;

    if (!baseUrl) {
        console.error('API base URL is not configured');
        return { store: {} as Store, products: [] };
    }

    if (!vendorId) {
        throw new Error('vendorId is required');
    }

    try {
        const headers: Record<string, string> = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await axios.get<ApiResponse>(
            `${baseUrl}/api/v1/vendor-store/review/${vendorId}`,
            { headers }
        );

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch vendor store data');
        }
        return response.data.data;
    } catch (error: any) {
        console.error('Axios Error: Failed to fetch vendor store with reviews', error.message || error);

        throw new Error(
            error.response?.data?.message ||
            error.message ||
            'Failed to fetch vendor store with reviews'
        );
    }
};