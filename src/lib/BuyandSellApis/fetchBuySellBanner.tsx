import axios from 'axios';
import { BannerDataType, BuyandSellApiResponse } from '@/types/BuySellBannerType';

export async function fetchBuySellBanner(): Promise<BannerDataType[]> {
    const baseUrl = process.env.NEXTAUTH_URL;
    try {
        const res = await axios.get<BuyandSellApiResponse>(
            `${baseUrl}/api/v1/public/classifieds-banners`,
            {
                headers: { 'Cache-Control': 'no-store' },
            }
        );
        if (res.data?.success && Array.isArray(res.data.data)) {
            return res.data.data;
        }

        return [];
    } catch (error) {
        console.error('❌ Failed to fetch Buy and Sell Category data:', error);
        return [];
    }
}

