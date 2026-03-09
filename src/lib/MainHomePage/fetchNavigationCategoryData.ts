import { ApiResponse, MainCategory } from '@/types/navigation-menu';

export async function fetchNavigationCategoryData(): Promise<MainCategory[]> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        // ১. ক্যাশ না ধরার জন্য fetch এবং 'no-store' ব্যবহার
        const res = await fetch(
            `${baseUrl}/api/v1/ecommerce-category/ecomCategory/mainCategory`,
            {
                cache: 'no-store', 
            }
        );

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data?.success && Array.isArray(data.data)) {
            const navbarCategories = data.data.filter(
                (category: any) => category.isNavbar === true
            );
            return navbarCategories;
        }

        return [];
    } catch (error) {
        console.error('❌ Failed to fetch Main Category data:', error);
        return [];
    }
}