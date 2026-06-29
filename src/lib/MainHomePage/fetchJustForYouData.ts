import axios from 'axios';
import { ProductCardType } from '@/types/ProductCardType';

export async function fetchJustForYouData(): Promise<ProductCardType[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    // ✅ FIX: নতুন অ্যালগরিদম API কল করা হচ্ছে (page=1, limit=60)
    const res = await axios.get(`${baseUrl}/api/v1/product/just-for-you?page=1&limit=60`, {
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