
import axios from 'axios';
import { ProductCardType } from '@/types/ProductCardType';

export async function fetchFlashSaleData(): Promise<ProductCardType[]> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const res = await axios.get(`${baseUrl}/api/v1/product/offerProduct`, {
            headers: { 'Cache-Control': 'no-store' },
        });

        if (res.data?.success && Array.isArray(res.data.data)) {
            return res.data.data;
        }

        return [];
    } catch (error) {
        console.error('❌ Failed to fetch Flash Sale products:', error);
        return [];
    }
}


