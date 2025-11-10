
// import axios from 'axios';
// import { ProductCardType } from '@/types/ProductCardType';

// export async function fetchFlashSaleData(): Promise<ProductCardType[]> {
//     const baseUrl = process.env.NEXTAUTH_URL;

//     try {
//         const res = await axios.get(`${baseUrl}/api/v1/product/offerProduct`, {
//             headers: { 'Cache-Control': 'no-store' },
//         });

//         if (res.data?.success && Array.isArray(res.data.data)) {
//             return res.data.data.map((item: ProductCardType) => ({
//                 _id: item._id,
//                 productTitle: item.productTitle,
//                 thumbnailImage: item.thumbnailImage,
//                 productPrice: item.productPrice,
//                 discountPrice: item.discountPrice,
//             }));
//         }

//         return [];
//     } catch (error) {
//         console.error('❌ Failed to fetch Flash Sale products:', error);
//         return [];
//     }
// }

// src/lib/MainHomePage/fetchFlashSaleData.ts

import axios from 'axios';
import { ProductCardType } from '@/types/ProductCardType';

// ──────────────────────────────────────────────────────────────
// Safe converters
// ──────────────────────────────────────────────────────────────
const toString = (val: unknown, fallback = ''): string =>
  typeof val === 'string' ? (val.trim() || fallback) : fallback;

const toNumber = (val: unknown, fallback = 0): number => {
  const n = Number(val);
  return Number.isNaN(n) ? fallback : n;
};

const toBrand = (raw: unknown): Brand | undefined => {
  if (!raw) return undefined;
  if (typeof raw === 'string') return { _id: raw, name: 'Brand' };
  if (typeof raw === 'object' && raw !== null) {
    const id = toString((raw as any)._id);
    const name = toString((raw as any).name, 'Brand');
    return id ? { _id: id, name } : undefined;
  }
  return undefined;
};

// ──────────────────────────────────────────────────────────────
// Validate single product
// ──────────────────────────────────────────────────────────────
function validateProduct(item: unknown): ProductCardType | null {
  if (!item || typeof item !== 'object') return null;

  const o = item as Record<string, unknown>;

  const _id = toString(o._id);
  if (!_id) return null;

  const gallery = Array.isArray(o.photoGallery) ? o.photoGallery : [];
  const thumbnailImage =
    toString(o.thumbnailImage) ||
    (gallery[0] ? toString(gallery[0]) : '/placeholder.png');

  return {
    _id,
    productTitle: toString(o.productTitle, 'Untitled'),
    thumbnailImage,
    productPrice: toNumber(o.productPrice),
    discountPrice: toNumber(o.discountPrice),
    stock: toNumber(o.stock),
    offerDeadline: toString(o.offerDeadline) || undefined,
    brand: toBrand(o.brand),
  };
}

// ──────────────────────────────────────────────────────────────
// Public fetcher
// ──────────────────────────────────────────────────────────────
export async function fetchFlashSaleData(): Promise<ProductCardType[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXTAUTH_URL;
  if (!baseUrl) return [];

  try {
    const { data } = await axios.get<{ success: boolean; data: unknown[] }>(
      `${baseUrl}/api/v1/product/offerProduct`,
      {
        headers: { 'Cache-Control': 'no-store' },
        timeout: 10000,
      }
    );

    if (data?.success && Array.isArray(data.data)) {
      return data.data
        .map(validateProduct)
        .filter((p): p is ProductCardType => p !== null);
    }

    return [];
  } catch {
    return [];
  }
}