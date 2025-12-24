import { Product, Store, VendorStoreWithProductType } from '@/types/VendorStoreWithProductType';
import axios from 'axios';



// API function to fetch store with products by vendorId
export const fetchSingleVendorAds = async (
    vendorId: string
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
        const response = await axios.get<VendorStoreWithProductType>(
            `${baseUrl}/api/v1/vendor-store/store-with-product/${vendorId}`
        );

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch store data');
        }

        return response.data.data;
    } catch (error: any) {
        console.error('Axios Error: Failed to fetch vendor store with products', error.message || error);
        throw new Error(
            error.response?.data?.message || 'Failed to fetch vendor store with products'
        );
    }
};