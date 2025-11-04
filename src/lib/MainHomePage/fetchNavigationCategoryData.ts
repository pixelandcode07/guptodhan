import { ApiResponse, MainCategory } from '@/types/navigation-menu';
import axios from 'axios';



export async function fetchNavigationCategoryData(): Promise<MainCategory[]> {
    const baseUrl = process.env.NEXTAUTH_URL;

    try {
        const res = await axios.get<ApiResponse>(
            `${baseUrl}/api/v1/ecommerce-category/ecomCategory/mainCategory`,
            {
                headers: { 'Cache-Control': 'no-store' },
            }
        );

        if (res.data?.success && Array.isArray(res.data.data)) {
            return res.data.data;
        }

        return [];
    } catch (error) {
        console.error('❌ Failed to fetch Main Category data:', error);
        return [];
    }
}
