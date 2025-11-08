import axios from 'axios';
import { BuyandSellApiResponse, CategoryDataType } from '@/types/BuyandSellCountDataType';

export async function fetchAllBuySellData(): Promise<CategoryDataType[]> {
    const baseUrl = process.env.NEXTAUTH_URL;
    try {
        const res = await axios.get<BuyandSellApiResponse>(
            `${baseUrl}/api/v1/public/classifieds-categories/with-ad-counts`,
            {
                headers: { 'Cache-Control': 'no-store' },
            }
        );
        if (res.data?.success && Array.isArray(res.data.data)) {
            return res.data.data;
        }

        return [];
    } catch (error) {
        console.error('❌ Failed to fetch Buy and Sell Banner data:', error);
        return [];
    }
}

