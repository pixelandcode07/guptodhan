export const dynamic = 'force-dynamic';
import axios from 'axios';
import { ProductCardType } from '@/types/ProductCardType';

export async function fetchFlashSaleData(): Promise<ProductCardType[]> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        // ✅ FIX: URL এর শেষে ?limit=6 যোগ করা হয়েছে
        const res = await axios.get(`${baseUrl}/api/v1/product/offerProduct?limit=6`, {
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