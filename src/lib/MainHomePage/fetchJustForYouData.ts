import axios from 'axios';
import { ProductCardType } from '@/types/ProductCardType';

export async function fetchJustForYouData(): Promise<ProductCardType[]> {
  const baseUrl = process.env.NEXTAUTH_URL;

  try {
    const res = await axios.get(`${baseUrl}/api/v1/product/forYou`, {
      headers: { 'Cache-Control': 'no-store' },
    });
    if (res.data?.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }

    return [];
  } catch (error) {
    console.error('❌ Failed to fetch "Just For You" products:', error);
    return [];
  }
}
