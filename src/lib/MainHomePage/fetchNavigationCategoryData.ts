import { ApiResponse, MainCategory } from '@/types/navigation-menu';

export async function fetchNavigationCategoryData(): Promise<MainCategory[]> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const res = await fetch(
            `${baseUrl}/api/v1/ecommerce-category/ecomCategory/mainCategory`,
            {
                cache: 'no-store',
            }
        );

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: ApiResponse = await res.json();

        if (data?.success && Array.isArray(data.data)) {
            return data.data;
        }

        return [];
    } catch (error) {
        console.error('❌ Failed to fetch Main Category data:', error);
        return [];
    }
}