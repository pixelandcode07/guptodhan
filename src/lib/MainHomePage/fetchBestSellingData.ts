import axios from 'axios';
import { ProductCardType } from '@/types/ProductCardType'; // You can rename this type later if needed

export async function fetchBestSellingData(): Promise<ProductCardType[]> {
    const baseUrl = process.env.NEXTAUTH_URL;

    try {
        const res = await axios.get(`${baseUrl}/api/v1/product/bestSelling`, {
            headers: { 'Cache-Control': 'no-store' },
        });

        if (res.data?.success && Array.isArray(res.data.data)) {
            return res.data.data.map((item: ProductCardType) => ({
                _id: item._id,
                productTitle: item.productTitle,
                thumbnailImage: item.thumbnailImage,
                productPrice: item.productPrice,
                discountPrice: item.discountPrice,
            }));
        }

        return [];
    } catch (error) {
        console.error('❌ Failed to fetch Best Selling products:', error);
        return [];
    }
}
