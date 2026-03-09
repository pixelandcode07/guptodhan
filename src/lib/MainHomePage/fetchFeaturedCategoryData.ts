import { ApiResponse, FeaturedCategory } from '@/types/FeaturedCategoryType';

export async function fetchFeaturedCategories(): Promise<FeaturedCategory[]> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const res = await fetch(`${baseUrl}/api/v1/ecommerce-category/ecomCategory/featured`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: ApiResponse<FeaturedCategory[]> = await res.json();

        if (data?.success && Array.isArray(data.data)) {
            return data.data;
        }

        return [];
    } catch (error) {
        console.error('❌ Failed to fetch Featured Categories:', error);
        return [];
    }
}