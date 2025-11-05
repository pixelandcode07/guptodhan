import { ApiResponse, FeaturedCategory } from '@/types/FeaturedCategoryType';
import axios from 'axios';

export async function fetchFeaturedCategories(): Promise<FeaturedCategory[]> {
    const baseUrl = process.env.NEXTAUTH_URL;

    try {
        const res = await axios.get<ApiResponse<FeaturedCategory[]>>(
            `${baseUrl}/api/v1/ecommerce-category/ecomCategory/featured`,
            {
                headers: { 'Cache-Control': 'no-store' },
            }
        );

        if (res.data?.success && Array.isArray(res.data.data)) {
            return res.data.data;
        }

        return [];
    } catch (error) {
        console.error('❌ Failed to fetch Featured Categories:', error);
        return [];
    }
}
